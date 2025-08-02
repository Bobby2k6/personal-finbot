from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL from environment variable or default to SQLite for local development
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./financebot.db")

# For PostgreSQL in production, use:
DATABASE_URL = "postgresql://finbot_user:cobWsVmqSkJ1l4rWe50Rkia8D9jFW9T5@dpg-d26jd6re5dus73b6d120-a.oregon-postgres.render.com/finbot_db"

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
