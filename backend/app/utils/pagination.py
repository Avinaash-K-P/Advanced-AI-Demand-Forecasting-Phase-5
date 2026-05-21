def paginator(query, skip:int, limit:int):
    total = query.count()
    data = query.offset(skip).limit(limit).all()
    return {
        "items": data,
        "total":total,
        "skip":skip,
        "limit":limit
    }
