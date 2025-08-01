from sqlalchemy.orm import Session
from sqlalchemy import func, desc, extract
from datetime import datetime, timedelta
from passlib.context import CryptContext
from . import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        preferred_currency=user.preferred_currency,
        theme_mode=user.theme_mode,
        family_mode=user.family_mode
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def update_user_settings(db: Session, user_id: int, settings: dict):
    user = get_user(db, user_id)
    if user:
        for key, value in settings.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
    return user

# Income operations
def create_income(db: Session, income: schemas.IncomeCreate, user_id: int):
    db_income = models.Income(**income.dict(), user_id=user_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def get_incomes(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Income).filter(models.Income.user_id == user_id).offset(skip).limit(limit).all()

def delete_income(db: Session, income_id: int, user_id: int):
    income = db.query(models.Income).filter(models.Income.id == income_id, models.Income.user_id == user_id).first()
    if income:
        db.delete(income)
        db.commit()
        return True
    return False

# Expense operations
def create_expense(db: Session, expense: schemas.ExpenseCreate, user_id: int):
    db_expense = models.Expense(**expense.dict(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Expense).filter(models.Expense.user_id == user_id).offset(skip).limit(limit).all()

def delete_expense(db: Session, expense_id: int, user_id: int):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == user_id).first()
    if expense:
        db.delete(expense)
        db.commit()
        return True
    return False

# Investment operations
def create_investment(db: Session, investment: schemas.InvestmentCreate, user_id: int):
    db_investment = models.Investment(**investment.dict(), user_id=user_id)
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

def get_investments(db: Session, user_id: int):
    return db.query(models.Investment).filter(models.Investment.user_id == user_id).all()

def update_investment(db: Session, investment_id: int, investment: schemas.InvestmentCreate, user_id: int):
    db_investment = db.query(models.Investment).filter(
        models.Investment.id == investment_id, 
        models.Investment.user_id == user_id
    ).first()
    if db_investment:
        for key, value in investment.dict().items():
            setattr(db_investment, key, value)
        db.commit()
        db.refresh(db_investment)
    return db_investment

def delete_investment(db: Session, investment_id: int, user_id: int):
    investment = db.query(models.Investment).filter(
        models.Investment.id == investment_id, 
        models.Investment.user_id == user_id
    ).first()
    if investment:
        db.delete(investment)
        db.commit()
        return True
    return False

# Goal operations
def create_goal(db: Session, goal: schemas.GoalCreate, user_id: int):
    db_goal = models.Goal(**goal.dict(), user_id=user_id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_goals(db: Session, user_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).all()

def update_goal(db: Session, goal_id: int, goal: schemas.GoalCreate, user_id: int):
    db_goal = db.query(models.Goal).filter(
        models.Goal.id == goal_id, 
        models.Goal.user_id == user_id
    ).first()
    if db_goal:
        for key, value in goal.dict().items():
            setattr(db_goal, key, value)
        db.commit()
        db.refresh(db_goal)
    return db_goal

def delete_goal(db: Session, goal_id: int, user_id: int):
    goal = db.query(models.Goal).filter(
        models.Goal.id == goal_id, 
        models.Goal.user_id == user_id
    ).first()
    if goal:
        db.delete(goal)
        db.commit()
        return True
    return False

# Dashboard data
def get_dashboard_data(db: Session, user_id: int):
    # Get current month data
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    # Monthly income
    monthly_income = db.query(func.sum(models.Income.amount)).filter(
        models.Income.user_id == user_id,
        extract('month', models.Income.date) == current_month,
        extract('year', models.Income.date) == current_year
    ).scalar() or 0.0
    
    # Monthly expenses
    monthly_expenses = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.user_id == user_id,
        extract('month', models.Expense.date) == current_month,
        extract('year', models.Expense.date) == current_year
    ).scalar() or 0.0
    
    # Total savings (income - expenses for all time)
    total_income = db.query(func.sum(models.Income.amount)).filter(models.Income.user_id == user_id).scalar() or 0.0
    total_expenses = db.query(func.sum(models.Expense.amount)).filter(models.Expense.user_id == user_id).scalar() or 0.0
    total_savings = total_income - total_expenses
    
    # Investment value
    investment_value = db.query(func.sum(models.Investment.current_value)).filter(models.Investment.user_id == user_id).scalar() or 0.0
    
    # Net worth (savings + investments)
    net_worth = total_savings + investment_value
    
    # Recent transactions (last 10)
    recent_incomes = db.query(models.Income).filter(models.Income.user_id == user_id).order_by(desc(models.Income.date)).limit(5).all()
    recent_expenses = db.query(models.Expense).filter(models.Expense.user_id == user_id).order_by(desc(models.Expense.date)).limit(5).all()
    
    recent_transactions = []
    for income in recent_incomes:
        recent_transactions.append({
            "id": f"income_{income.id}",
            "type": "income",
            "description": income.source,
            "amount": income.amount,
            "date": income.date.isoformat(),
            "category": "Income"
        })
    
    for expense in recent_expenses:
        recent_transactions.append({
            "id": f"expense_{expense.id}",
            "type": "expense",
            "description": expense.description,
            "amount": -expense.amount,
            "date": expense.date.isoformat(),
            "category": expense.category
        })
    
    # Sort by date
    recent_transactions.sort(key=lambda x: x["date"], reverse=True)
    recent_transactions = recent_transactions[:10]
    
    # Expense breakdown by category
    expense_breakdown = db.query(
        models.Expense.category,
        func.sum(models.Expense.amount).label('total')
    ).filter(
        models.Expense.user_id == user_id,
        extract('month', models.Expense.date) == current_month,
        extract('year', models.Expense.date) == current_year
    ).group_by(models.Expense.category).all()
    
    expense_breakdown_list = []
    for category, total in expense_breakdown:
        percentage = (total / monthly_expenses * 100) if monthly_expenses > 0 else 0
        expense_breakdown_list.append({
            "category": category,
            "amount": total,
            "percentage": round(percentage, 1)
        })
    
    # Savings rate
    savings_rate = ((monthly_income - monthly_expenses) / monthly_income * 100) if monthly_income > 0 else 0
    
    return {
        "monthly_income": monthly_income,
        "total_expenses": monthly_expenses,
        "total_savings": total_savings,
        "net_worth": net_worth,
        "recent_transactions": recent_transactions,
        "expense_breakdown": expense_breakdown_list,
        "savings_rate": round(savings_rate, 1)
    }
