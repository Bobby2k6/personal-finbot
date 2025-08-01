// Finance API service connected to FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DashboardMetrics {
  monthly_income: number;
  total_expenses: number;
  total_savings: number;
  net_worth: number;
  savings_rate: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  initialValue: number;
  growth: number;
  isPositive: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
  status: "on_track" | "behind" | "completed";
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Placeholder data
const PLACEHOLDER_METRICS: DashboardMetrics = {
  monthlyIncome: 75000,
  totalExpenses: 45000,
  totalSavings: 125000,
  netWorth: 350000,
};

const PLACEHOLDER_EXPENSES: ExpenseCategory[] = [
  { category: "Rent", amount: 20000, percentage: 44.4, color: "#8b5cf6" },
  { category: "Food", amount: 12000, percentage: 26.7, color: "#06b6d4" },
  { category: "Transport", amount: 8000, percentage: 17.8, color: "#10b981" },
  { category: "Entertainment", amount: 3000, percentage: 6.7, color: "#f59e0b" },
  { category: "Others", amount: 2000, percentage: 4.4, color: "#ef4444" },
];

const PLACEHOLDER_INVESTMENTS: Investment[] = [
  {
    id: "1",
    name: "HDFC Top 100 Fund",
    type: "Mutual Fund",
    currentValue: 15000,
    initialValue: 12000,
    growth: 25.0,
    isPositive: true,
  },
  {
    id: "2",
    name: "Reliance Industries",
    type: "Stock",
    currentValue: 8500,
    initialValue: 9000,
    growth: -5.6,
    isPositive: false,
  },
  {
    id: "3",
    name: "Bitcoin",
    type: "Crypto",
    currentValue: 12000,
    initialValue: 10000,
    growth: 20.0,
    isPositive: true,
  },
  {
    id: "4",
    name: "Gold ETF",
    type: "Gold",
    currentValue: 5500,
    initialValue: 5200,
    growth: 5.8,
    isPositive: true,
  },
];

const PLACEHOLDER_TRANSACTIONS: Transaction[] = [
  { id: "1", amount: -2500, category: "Food", description: "Grocery shopping", date: "2024-01-15", type: "expense" },
  { id: "2", amount: 75000, category: "Salary", description: "Monthly salary", date: "2024-01-01", type: "income" },
  { id: "3", amount: -800, category: "Transport", description: "Uber rides", date: "2024-01-14", type: "expense" },
  { id: "4", amount: -1200, category: "Entertainment", description: "Movie tickets", date: "2024-01-13", type: "expense" },
  { id: "5", amount: -20000, category: "Rent", description: "Monthly rent", date: "2024-01-01", type: "expense" },
];

const PLACEHOLDER_GOALS: FinancialGoal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 300000,
    currentAmount: 125000,
    deadline: "2024-12-31",
    description: "Build 6 months of emergency fund",
    status: "on_track",
  },
  {
    id: "2",
    title: "Vacation to Europe",
    targetAmount: 200000,
    currentAmount: 85000,
    deadline: "2024-08-15",
    description: "Summer vacation with family",
    status: "behind",
  },
  {
    id: "3",
    title: "New Laptop",
    targetAmount: 80000,
    currentAmount: 65000,
    deadline: "2024-03-30",
    description: "Upgrade to MacBook Pro",
    status: "on_track",
  },
];

// API Functions (currently returning placeholder data)
// TODO: Replace these with actual API calls to FastAPI backend

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/dashboard/metrics');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(PLACEHOLDER_METRICS), 500);
  });
}

export async function getExpenseData(): Promise<ExpenseCategory[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/expenses/breakdown');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(PLACEHOLDER_EXPENSES), 500);
  });
}

export async function getInvestments(): Promise<Investment[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/investments');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(PLACEHOLDER_INVESTMENTS), 500);
  });
}

export async function getTransactions(): Promise<Transaction[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/transactions');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(PLACEHOLDER_TRANSACTIONS), 500);
  });
}

export async function addTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/transactions', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(transaction)
  // });
  // return response.json();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(newTransaction), 500);
  });
}

export async function getGoals(): Promise<FinancialGoal[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/goals');
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(PLACEHOLDER_GOALS), 500);
  });
}

export async function addGoal(goal: Omit<FinancialGoal, "id" | "currentAmount" | "status">): Promise<FinancialGoal> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/goals', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(goal)
  // });
  // return response.json();
  
  const newGoal: FinancialGoal = {
    ...goal,
    id: Date.now().toString(),
    currentAmount: 0,
    status: "on_track",
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(newGoal), 500);
  });
}

export async function sendChatMessage(message: string): Promise<string> {
  // TODO: Replace with actual API call to FastAPI + OpenAI
  // const response = await fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ message })
  // });
  // const data = await response.json();
  // return data.response;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateBotResponse(message));
    }, 1500);
  });
}

function generateBotResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes("save") || input.includes("saving")) {
    return "Based on your current income of ₹75,000 and expenses of ₹45,000, you can save ₹30,000 this month. That's a 40% savings rate - excellent work! Consider investing some of this in mutual funds or SIPs for long-term growth.";
  }
  
  if (input.includes("expense") || input.includes("spending")) {
    return "Your monthly expenses breakdown:\n• Rent: ₹20,000 (44.4%)\n• Food: ₹12,000 (26.7%)\n• Transport: ₹8,000 (17.8%)\n• Entertainment: ₹3,000 (6.7%)\n• Others: ₹2,000 (4.4%)\n\nYour largest expense category is rent. Consider if there are ways to optimize your food and transport costs.";
  }
  
  if (input.includes("invest") || input.includes("investment")) {
    return "Here are some investment suggestions based on your profile:\n\n🔹 **Emergency Fund**: Build 6 months of expenses (₹2.7L) in a high-yield savings account\n🔹 **SIP in Equity Mutual Funds**: ₹15,000/month for long-term wealth building\n🔹 **ELSS Funds**: ₹12,500/month for tax saving under 80C\n🔹 **Gold ETF**: 5-10% allocation for diversification\n\nStart with index funds if you're a beginner. Would you like specific fund recommendations?";
  }
  
  if (input.includes("budget") || input.includes("plan")) {
    return "Let me create a budget plan for you:\n\n**Income**: ₹75,000\n**Fixed Expenses**: ₹35,000 (Rent, utilities, insurance)\n**Variable Expenses**: ₹20,000 (Food, transport, entertainment)\n**Savings**: ₹20,000 (27% savings rate)\n\n**Recommendations**:\n• Try to reduce variable expenses by ₹5,000\n• Increase savings rate to 35-40%\n• Set up automatic transfers to savings\n\nWould you like help setting specific spending limits for each category?";
  }
  
  return "I understand you're asking about your finances. I can help with budgeting, expense tracking, investment advice, and financial planning. Could you be more specific about what you'd like to know? For example, you could ask about your savings potential, expense breakdown, or investment options.";
}
