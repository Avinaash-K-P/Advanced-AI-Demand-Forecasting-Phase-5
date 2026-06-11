from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,

     # ── Connection Pool Settings ──
    pool_size=10,           # Max persistent connections
    max_overflow=20,        # Extra connections beyond pool_size under load
    pool_timeout=30,        # Seconds to wait before giving up on a connection
    pool_recycle=1800,      # Recycle connections every 30 min (prevents stale connections)
    pool_pre_ping=True,     # Ping before using a connection (detects dropped connections)
 
    # ── Query Performance ──
    echo=False,             # Set True only for debugging — logs every SQL query  
    
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()