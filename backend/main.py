from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from .database import get_db, engine, Base
from .models import User, Income, Expense, Investment, Goal
from .schemas import (
    UserCreate, UserLogin, UserResponse, 
    IncomeCreate, IncomeResponse,
    ExpenseCreate, ExpenseResponse,
    InvestmentCreate, InvestmentResponse,
    GoalCreate, GoalResponse,
    DashboardResponse,
    Token
)
from . import crud

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinanceBot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Dashboard endpoint
@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_dashboard_data(db=db, user_id=current_user.id)

# Income endpoints
@app.post("/api/income", response_model=IncomeResponse)
async def create_income(income: IncomeCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_income(db=db, income=income, user_id=current_user.id)

@app.get("/api/income", response_model=list[IncomeResponse])
async def get_incomes(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_incomes(db=db, user_id=current_user.id, skip=skip, limit=limit)

@app.delete("/api/income/{income_id}")
async def delete_income(income_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = crud.delete_income(db=db, income_id=income_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Income not found")
    return {"message": "Income deleted successfully"}

# Expense endpoints
@app.post("/api/expenses", response_model=ExpenseResponse)
async def create_expense(expense: ExpenseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_expense(db=db, expense=expense, user_id=current_user.id)

@app.get("/api/expenses", response_model=list[ExpenseResponse])
async def get_expenses(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_expenses(db=db, user_id=current_user.id, skip=skip, limit=limit)

@app.delete("/api/expenses/{expense_id}")
async def delete_expense(expense_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = crud.delete_expense(db=db, expense_id=expense_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

# Investment endpoints
@app.post("/api/investments", response_model=InvestmentResponse)
async def create_investment(investment: InvestmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_investment(db=db, investment=investment, user_id=current_user.id)

@app.get("/api/investments", response_model=list[InvestmentResponse])
async def get_investments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_investments(db=db, user_id=current_user.id)

@app.put("/api/investments/{investment_id}", response_model=InvestmentResponse)
async def update_investment(investment_id: int, investment: InvestmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_investment = crud.update_investment(db=db, investment_id=investment_id, investment=investment, user_id=current_user.id)
    if not updated_investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    return updated_investment

@app.delete("/api/investments/{investment_id}")
async def delete_investment(investment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = crud.delete_investment(db=db, investment_id=investment_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Investment not found")
    return {"message": "Investment deleted successfully"}

# Goals endpoints
@app.post("/api/goals", response_model=GoalResponse)
async def create_goal(goal: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_goal(db=db, goal=goal, user_id=current_user.id)

@app.get("/api/goals", response_model=list[GoalResponse])
async def get_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_goals(db=db, user_id=current_user.id)

@app.put("/api/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: int, goal: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_goal = crud.update_goal(db=db, goal_id=goal_id, goal=goal, user_id=current_user.id)
    if not updated_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return updated_goal

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = crud.delete_goal(db=db, goal_id=goal_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted successfully"}

# User settings
@app.put("/api/users/settings", response_model=UserResponse)
async def update_user_settings(settings: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.update_user_settings(db=db, user_id=current_user.id, settings=settings)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
