from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    preferred_currency: str = "INR"
    theme_mode: str = "light"
    family_mode: bool = False

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Income schemas
class IncomeBase(BaseModel):
    source: str
    amount: float
    date: datetime
    notes: Optional[str] = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Expense schemas
class ExpenseBase(BaseModel):
    category: str
    amount: float
    date: datetime
    description: str
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Investment schemas
class InvestmentBase(BaseModel):
    type: str
    name: str
    initial_amount: float
    current_value: float
    date_enrolled: datetime
    description: Optional[str] = None

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentResponse(InvestmentBase):
    id: int
    user_id: int
    growth_percentage: float
    is_positive: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Goal schemas
class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_saved: float = 0.0
    deadline: datetime
    description: Optional[str] = None
    status: str = "on_track"

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    user_id: int
    progress_percentage: float
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Dashboard response schema
class DashboardResponse(BaseModel):
    monthly_income: float
    total_expenses: float
    total_savings: float
    net_worth: float
    recent_transactions: List[dict]
    expense_breakdown: List[dict]
    savings_rate: float
    
    class Config:
        from_attributes = True
