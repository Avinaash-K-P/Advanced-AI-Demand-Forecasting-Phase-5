from datetime import datetime
from typing import Any, Optional


# ──────────────────────────────────────────
# Unified Response Wrapper
# ──────────────────────────────────────────

def success_response(
    message: str,
    data: Any = None,
    meta: dict = None
) -> dict:
    """
    Standard success response shape used across all routes.

    Shape:
    {
        "status":    "success",
        "message":   "...",
        "data":      {...} or [...],
        "meta":      {...} or null,
        "timestamp": "2024-01-01T12:00:00"
    }
    """

    return {
        "status":    "success",
        "message":   message,
        "data":      data,
        "meta":      meta,
        "timestamp": datetime.utcnow().isoformat()
    }


def error_response(
    message: str,
    details: Any = None,
    code: Optional[str] = None
) -> dict:
    """
    Standard error response shape.

    Shape:
    {
        "status":    "error",
        "message":   "...",
        "details":   "..." or null,
        "code":      "VALIDATION_ERROR" or null,
        "timestamp": "2024-01-01T12:00:00"
    }
    """

    return {
        "status":    "error",
        "message":   message,
        "details":   details,
        "code":      code,
        "timestamp": datetime.utcnow().isoformat()
    }


def paginated_response(
    message: str,
    items: list,
    total: int,
    skip: int,
    limit: int,
    meta: dict = None
) -> dict:
    """
    Standardized paginated response replacing the basic paginator utility.

    Shape:
    {
        "status":  "success",
        "message": "...",
        "data":    [...],
        "meta": {
            "total":       100,
            "skip":        0,
            "limit":       10,
            "page":        1,
            "total_pages": 10,
            ...extra meta
        },
        "timestamp": "..."
    }
    """

    total_pages = (total + limit - 1) // limit if limit else 1
    current_page = (skip // limit) + 1 if limit else 1

    pagination_meta = {
        "total":       total,
        "skip":        skip,
        "limit":       limit,
        "page":        current_page,
        "total_pages": total_pages
    }

    if meta:
        pagination_meta.update(meta)

    return {
        "status":    "success",
        "message":   message,
        "data":      items,
        "meta":      pagination_meta,
        "timestamp": datetime.utcnow().isoformat()
    }