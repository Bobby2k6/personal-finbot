# 🚀 FinanceBot Full-Stack Setup Guide

This guide will help you set up both the **React frontend** and **FastAPI backend** with database integration.

## 📋 Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **PostgreSQL** (optional, for production)

## 🎯 Quick Start

### 1. Setup Backend (FastAPI + Database)

```bash
# Clone and navigate to backend
cd backend

# Automated setup (recommended)
python setup.py

# This will:
# ✅ Create virtual environment
# ✅ Install dependencies
# ✅ Setup environment variables
# ✅ Start the server at http://localhost:8000
```

### 2. Setup Frontend (React)

```bash
# In a new terminal, from project root
npm install

# Create environment file
cp .env.example .env

# Start frontend development server
npm run dev
# Frontend will be available at http://localhost:8080
```

### 3. Database Configuration

#### Option A: SQLite (Development - Default)

- No additional setup required
- Database file created automatically
- Perfect for local development

#### Option B: PostgreSQL (Production)

```sql
-- Create database and user
CREATE DATABASE financebot;
CREATE USER financebot_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE financebot TO financebot_user;
```

Update `backend/.env`:

```env
DATABASE_URL=postgresql://financebot_user:your_password@localhost:5432/financebot
```

## 🔧 Manual Backend Setup

If you prefer manual setup:

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env file as needed

# 5. Run server
uvicorn main:app --reload
```

## 📊 Database Models Created

The backend automatically creates these database tables:

### 👤 Users Table

```sql
- id (Primary Key)
- name
- email (Unique)
- hashed_password (bcrypt)
- preferred_currency (default: INR)
- theme_mode (default: light)
- family_mode (default: false)
- created_at, updated_at
```

### 💰 Income Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- source (e.g., "Salary", "Freelance")
- amount
- date
- notes
- created_at
```

### 💸 Expenses Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- category (e.g., "Rent", "Food")
- amount
- date
- description
- notes
- created_at
```

### 📈 Investments Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- type (e.g., "Stock", "Mutual Fund")
- name
- initial_amount
- current_value
- date_enrolled
- description
- created_at, updated_at
```

### 🎯 Goals Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- target_amount
- current_saved
- deadline
- description
- status (on_track/behind/completed)
- created_at, updated_at
```

## 🔐 Security Features Implemented

- ✅ **Password Hashing**: bcrypt for secure password storage
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Environment Variables**: Sensitive data protection
- ✅ **CORS Configuration**: Secure cross-origin requests
- ✅ **SQL Injection Protection**: SQLAlchemy ORM
- ✅ **Token Expiration**: Configurable session timeouts

## 🌐 API Endpoints Available

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard

- `GET /api/dashboard` - Complete dashboard data

### Financial Data

- `GET/POST/DELETE /api/income` - Income management
- `GET/POST/DELETE /api/expenses` - Expense management
- `GET/POST/PUT/DELETE /api/investments` - Investment management
- `GET/POST/PUT/DELETE /api/goals` - Goals management

### User Settings

- `PUT /api/users/settings` - Update user preferences

## 🎨 Frontend Integration

The React frontend now:

- ✅ **Authenticates** with FastAPI backend
- ✅ **Stores data** in PostgreSQL/SQLite database
- ✅ **Real-time updates** when adding/editing data
- ✅ **Secure sessions** with JWT tokens
- ✅ **Proper currency formatting** (₹ symbol)
- ✅ **Investment tracking** with real growth calculations

## 🔄 Data Flow

1. **User Registration/Login** → JWT token stored in localStorage
2. **Add Investment** → POST to `/api/investments` → Stored in database
3. **Dashboard Load** → GET `/api/dashboard` → Real data from database
4. **Settings Update** → PUT `/api/users/settings` → User preferences saved

## 📱 Testing the Integration

1. **Start both servers**:

   ```bash
   # Terminal 1: Backend
   cd backend && python -m uvicorn main:app --reload

   # Terminal 2: Frontend
   npm run dev
   ```

2. **Test the flow**:
   - Visit http://localhost:8080
   - Sign up for a new account
   - Add some income/expenses/investments
   - Check dashboard updates
   - Verify data persists after refresh

## 🚀 Production Deployment

### Backend (FastAPI)

```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Database (PostgreSQL)

```bash
# Setup PostgreSQL database
# Update DATABASE_URL in production
# Run database migrations if needed
```

### Frontend (React)

```bash
# Build for production
npm run build

# Serve with nginx or deploy to Vercel/Netlify
```

## 🐛 Troubleshooting

### Backend Issues

- **Database connection**: Check `DATABASE_URL` in `.env`
- **CORS errors**: Update `FRONTEND_URL` in backend `.env`
- **Token errors**: Verify `SECRET_KEY` is set

### Frontend Issues

- **API connection**: Check `VITE_API_URL` in frontend `.env`
- **Login issues**: Ensure backend is running on correct port

### Common Commands

```bash
# Check backend is running
curl http://localhost:8000/docs

# Check frontend environment
echo $VITE_API_URL

# Reset database (development)
rm backend/financebot.db  # SQLite only
```

## 📚 API Documentation

Once backend is running, visit:

- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc documentation**: http://localhost:8000/redoc

Your FinanceBot application now has a complete backend with:

- ✅ **Secure user authentication**
- ✅ **Persistent data storage**
- ✅ **Real-time updates**
- ✅ **Production-ready security**
- ✅ **Complete API integration**

The Add Investment button now saves to the database, all financial data persists between sessions, and the rupee symbol (₹) displays correctly throughout the application!
