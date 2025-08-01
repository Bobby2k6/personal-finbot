# FinanceBot Backend

FastAPI backend with PostgreSQL/SQLite database for the FinanceBot personal finance application.

## Features

- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 💾 **Database Support**: PostgreSQL for production, SQLite for development
- 📊 **Complete API**: RESTful endpoints for all financial data
- 🔒 **Data Security**: Environment variables for sensitive configuration
- 📱 **CORS Enabled**: Ready for React frontend integration

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
cd backend
python setup.py
```

This script will:
- Check Python version (3.8+ required)
- Create a virtual environment
- Install all dependencies
- Set up environment variables
- Optionally start the server

### Option 2: Manual Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=sqlite:///./financebot.db  # For development
# DATABASE_URL=postgresql://user:password@localhost:5432/financebot  # For production

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:8080
```

## Database Setup

### SQLite (Development)
No additional setup required. Database file will be created automatically.

### PostgreSQL (Production)

1. **Install PostgreSQL**
2. **Create database:**
   ```sql
   CREATE DATABASE financebot;
   CREATE USER financebot_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE financebot TO financebot_user;
   ```
3. **Update .env file:**
   ```env
   DATABASE_URL=postgresql://financebot_user:your_password@localhost:5432/financebot
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics

### Income
- `GET /api/income` - Get user incomes
- `POST /api/income` - Create new income
- `DELETE /api/income/{id}` - Delete income

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create new expense
- `DELETE /api/expenses/{id}` - Delete expense

### Investments
- `GET /api/investments` - Get user investments
- `POST /api/investments` - Create new investment
- `PUT /api/investments/{id}` - Update investment
- `DELETE /api/investments/{id}` - Delete investment

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### Settings
- `PUT /api/users/settings` - Update user settings

## API Documentation

Once the server is running, visit:
- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc documentation**: http://localhost:8000/redoc

## Database Models

### User
- Personal information and preferences
- Secure password storage with bcrypt
- Currency and theme preferences

### Income
- Track income sources and amounts
- Date-based organization

### Expense
- Categorized expense tracking
- Notes and descriptions

### Investment
- Investment portfolio management
- Automatic growth calculation
- Multiple investment types support

### Goal
- Financial goal tracking
- Progress calculation
- Deadline management

## Security Features

- 🔐 **Password Hashing**: Bcrypt for secure password storage
- 🔑 **JWT Tokens**: Secure authentication tokens
- ⏰ **Token Expiration**: Configurable token lifetime
- 🛡️ **CORS Protection**: Configurable allowed origins
- 🔒 **Environment Variables**: Sensitive data protection

## Development

### Run with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run tests:
```bash
pytest  # (tests to be added)
```

### Database migrations:
```bash
# If using Alembic (to be configured)
alembic upgrade head
```

## Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Checklist
- [ ] Set strong SECRET_KEY
- [ ] Configure PostgreSQL database
- [ ] Set proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## Troubleshooting

### Common Issues

**1. Database connection error:**
- Check DATABASE_URL in .env file
- Ensure PostgreSQL is running (if using PostgreSQL)
- Verify database credentials

**2. CORS errors:**
- Update FRONTEND_URL in .env
- Check CORS middleware configuration

**3. Token errors:**
- Verify SECRET_KEY is set
- Check token expiration settings

For more help, check the logs or create an issue in the repository.
