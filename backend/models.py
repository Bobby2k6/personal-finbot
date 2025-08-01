from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.relationship import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    preferred_currency = Column(String, default="INR")
    theme_mode = Column(String, default="light")
    family_mode = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    incomes = relationship("Income", back_populates="owner")
    expenses = relationship("Expense", back_populates="owner")
    investments = relationship("Investment", back_populates="owner")
    goals = relationship("Goal", back_populates="owner")

class Income(Base):
    __tablename__ = "incomes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source = Column(String, index=True)  # e.g., "Salary", "Freelance", "Investment"
    amount = Column(Float)
    date = Column(DateTime(timezone=True))
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="incomes")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, index=True)  # e.g., "Rent", "Food", "Transport"
    amount = Column(Float)
    date = Column(DateTime(timezone=True))
    notes = Column(Text, nullable=True)
    description = Column(String)  # Brief description of the expense
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="expenses")

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)  # e.g., "Stock", "Mutual Fund", "Crypto", "Gold"
    name = Column(String)  # e.g., "HDFC Top 100 Fund", "Bitcoin"
    initial_amount = Column(Float)  # Amount initially invested
    current_value = Column(Float)  # Current market value
    date_enrolled = Column(DateTime(timezone=True))
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="investments")

    @property
    def growth_percentage(self):
        if self.initial_amount and self.initial_amount > 0:
            return ((self.current_value - self.initial_amount) / self.initial_amount) * 100
        return 0.0

    @property
    def is_positive(self):
        return self.current_value >= self.initial_amount

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)  # e.g., "Emergency Fund", "Vacation"
    target_amount = Column(Float)
    current_saved = Column(Float, default=0.0)
    deadline = Column(DateTime(timezone=True))
    description = Column(Text, nullable=True)
    status = Column(String, default="on_track")  # "on_track", "behind", "completed"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="goals")

    @property
    def progress_percentage(self):
        if self.target_amount and self.target_amount > 0:
            return min((self.current_saved / self.target_amount) * 100, 100)
        return 0.0
