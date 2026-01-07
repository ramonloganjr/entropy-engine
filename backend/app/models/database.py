"""
Database Models for The Entropy Engine
SQLAlchemy models for SQLite database
"""
from sqlalchemy import Column, Integer, String, DateTime, JSON, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./entropy_engine.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class HistoricalWin(Base):
    """
    Official historical winning numbers
    Used for pattern analysis and backtesting
    """
    __tablename__ = "historical_wins"
    
    id = Column(Integer, primary_key=True, index=True)
    draw_date = Column(DateTime, nullable=False)
    white_balls = Column(JSON, nullable=False)  # List of 5 numbers
    powerball = Column(Integer, nullable=False)
    jackpot_amount = Column(String, nullable=True)  # Optional prize info
    created_at = Column(DateTime, default=datetime.utcnow)


class UserFailure(Base):
    """
    Crowdsourced losing tickets
    Used for "inverse learning" - patterns to avoid
    """
    __tablename__ = "user_failures"
    
    id = Column(Integer, primary_key=True, index=True)
    white_balls = Column(JSON, nullable=False)  # List of 5 numbers
    powerball = Column(Integer, nullable=False)
    pattern_hash = Column(String(64), nullable=False, index=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)


class GenerationLog(Base):
    """
    Log of generated combinations for reality check feature
    """
    __tablename__ = "generation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, nullable=False, index=True)
    combinations_generated = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


# Initialize on import
init_db()
