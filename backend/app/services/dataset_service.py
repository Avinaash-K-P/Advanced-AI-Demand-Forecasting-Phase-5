import json
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from fastapi import HTTPException

from app.models.dataset_version import DatasetVersion
from app.models.dataset_upload_history import DatasetUploadHistory
from app.models.dataset_modification import DatasetModification


# ──────────────────────────────────────────
# 6.1 — Dataset Versioning
# ──────────────────────────────────────────

def create_dataset_version(
    db, dataset_name, file_type, total_rows,
    total_columns, columns_list, file_size_kb,
    uploaded_by, project_id=None
):
    last_version = db.query(
        func.max(DatasetVersion.version_number)
    ).filter(DatasetVersion.dataset_name == dataset_name).scalar()

    next_version = (last_version or 0) + 1

    version = DatasetVersion(
        version_number=next_version,
        dataset_name=dataset_name,
        file_type=file_type,
        total_rows=total_rows,
        total_columns=total_columns,
        file_size_kb=file_size_kb,
        columns_snapshot=json.dumps(columns_list),
        uploaded_by=uploaded_by,
        project_id=project_id,
        status="active"
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def get_all_versions(db, dataset_name=None):
    query = db.query(DatasetVersion)
    if dataset_name:
        query = query.filter(DatasetVersion.dataset_name == dataset_name)
    return query.order_by(DatasetVersion.uploaded_at.desc()).all()


def get_version_by_id(db, version_id):
    version = db.query(DatasetVersion).filter(DatasetVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Dataset version not found")
    return version


# ──────────────────────────────────────────
# 6.2 — Upload History
# ──────────────────────────────────────────

def log_upload_history(
    db, dataset_version_id, dataset_name, uploaded_by,
    upload_status, rows_uploaded, rows_cleaned,
    duplicates_removed, cleaning_report, error_message=None
):
    history = DatasetUploadHistory(
        dataset_version_id=dataset_version_id,
        dataset_name=dataset_name,
        uploaded_by=uploaded_by,
        upload_status=upload_status,
        rows_uploaded=rows_uploaded,
        rows_cleaned=rows_cleaned,
        duplicates_removed=duplicates_removed,
        cleaning_report=json.dumps(cleaning_report),
        error_message=error_message
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


def get_upload_history(db, dataset_name=None, uploaded_by=None):
    query = db.query(DatasetUploadHistory)
    if dataset_name:
        query = query.filter(DatasetUploadHistory.dataset_name == dataset_name)
    if uploaded_by:
        query = query.filter(DatasetUploadHistory.uploaded_by == uploaded_by)
    return query.order_by(DatasetUploadHistory.uploaded_at.desc()).all()


# ──────────────────────────────────────────
# 6.3 — Modification Tracking
# ──────────────────────────────────────────

def log_modification(
    db, dataset_version_id, modified_by, modification_type,
    description, rows_affected=0, previous_value=None, new_value=None
):
    modification = DatasetModification(
        dataset_version_id=dataset_version_id,
        modified_by=modified_by,
        modification_type=modification_type,
        description=description,
        rows_affected=rows_affected,
        previous_value=json.dumps(previous_value) if previous_value else None,
        new_value=json.dumps(new_value) if new_value else None
    )
    db.add(modification)
    db.commit()
    db.refresh(modification)
    return modification


def get_modifications(db, dataset_version_id):
    return db.query(DatasetModification).filter(
        DatasetModification.dataset_version_id == dataset_version_id
    ).order_by(DatasetModification.modified_at.desc()).all()


# ──────────────────────────────────────────
# 6.4 — Archive / Restore
# ──────────────────────────────────────────

def archive_dataset_version(db, version_id, user_id):
    version = get_version_by_id(db, version_id)
    if version.is_archived:
        raise HTTPException(status_code=400, detail="Dataset version is already archived")

    previous = {"status": version.status, "is_archived": version.is_archived}
    version.is_archived = True
    version.status = "archived"
    version.archived_at = datetime.utcnow()
    db.commit()
    db.refresh(version)

    log_modification(
        db=db, dataset_version_id=version_id, modified_by=user_id,
        modification_type="ARCHIVED",
        description=f"Version {version.version_number} of '{version.dataset_name}' archived",
        previous_value=previous,
        new_value={"status": "archived", "is_archived": True}
    )
    return version


def restore_dataset_version(db, version_id, user_id):
    version = get_version_by_id(db, version_id)
    if not version.is_archived:
        raise HTTPException(status_code=400, detail="Dataset version is not archived")

    previous = {"status": version.status, "is_archived": version.is_archived}
    version.is_archived = False
    version.status = "active"
    version.archived_at = None
    db.commit()
    db.refresh(version)

    log_modification(
        db=db, dataset_version_id=version_id, modified_by=user_id,
        modification_type="RESTORED",
        description=f"Version {version.version_number} of '{version.dataset_name}' restored",
        previous_value=previous,
        new_value={"status": "active", "is_archived": False}
    )
    return version


# ──────────────────────────────────────────
# 6.5 — Dataset Comparison
# ──────────────────────────────────────────

def compare_dataset_versions(db, version_id_a, version_id_b):
    if version_id_a == version_id_b:
        raise HTTPException(status_code=400, detail="Both version IDs must be different")

    ver_a = get_version_by_id(db, version_id_a)
    ver_b = get_version_by_id(db, version_id_b)

    if ver_a.dataset_name != ver_b.dataset_name:
        raise HTTPException(
            status_code=400,
            detail="Both versions must belong to the same dataset name"
        )

    rows_change = ver_b.total_rows - ver_a.total_rows
    rows_change_pct = round((rows_change / ver_a.total_rows * 100) if ver_a.total_rows else 0, 2)
    columns_change = ver_b.total_columns - ver_a.total_columns
    size_change_kb = round(ver_b.file_size_kb - ver_a.file_size_kb, 2) if (ver_a.file_size_kb and ver_b.file_size_kb) else None

    cols_a = set(json.loads(ver_a.columns_snapshot)) if ver_a.columns_snapshot else set()
    cols_b = set(json.loads(ver_b.columns_snapshot)) if ver_b.columns_snapshot else set()

    return {
        "dataset_name": ver_a.dataset_name,
        "version_a": ver_a.version_number,
        "version_b": ver_b.version_number,
        "rows_change": rows_change,
        "rows_change_pct": rows_change_pct,
        "columns_change": columns_change,
        "size_change_kb": size_change_kb,
        "added_columns": list(cols_b - cols_a),
        "removed_columns": list(cols_a - cols_b),
        "common_columns": list(cols_a & cols_b),
        "version_a_rows": ver_a.total_rows,
        "version_b_rows": ver_b.total_rows,
        "version_a_uploaded_at": ver_a.uploaded_at,
        "version_b_uploaded_at": ver_b.uploaded_at
    }