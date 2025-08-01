// Finance API service connected to FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Backend availability check
let backendAvailable: boolean | null = null;

async function checkBackendAvailability(): Promise<boolean> {
  if (backendAvailable !== null) {
    return backendAvailable;
  }

  try {
    // Use a simple timeout-based approach to check if backend is available
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: "HEAD",
      signal: controller.signal,
      mode: "no-cors",
    });

    clearTimeout(timeoutId);
    backendAvailable = true;
    return true;
  } catch (error) {
    // Any error (network, CORS, timeout) means backend is not available
    console.warn("Backend not available, falling back to demo mode:", error);
    backendAvailable = false;
    return false;
  }
}

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
  color?: string;
}

export interface Investment {
  id: number;
  name: string;
  type: string;
  current_value: number;
  initial_amount: number;
  growth_percentage: number;
  is_positive: boolean;
  date_enrolled: string;
  description?: string;
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
  id: number;
  name: string;
  target_amount: number;
  current_saved: number;
  deadline: string;
  description: string;
  status: "on_track" | "behind" | "completed";
  progress_percentage: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  preferred_currency: string;
  theme_mode: string;
  family_mode: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// API Helper functions
function getAuthToken(): string | null {
  return localStorage.getItem("financebot-token");
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    throw new Error("Backend not available - using demo mode");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("financebot-token");
      window.location.href = "/login";
      throw new Error("Authentication required");
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Authentication API functions
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // Demo login - simulate successful authentication
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    const demoUser: User = {
      id: 1,
      name: email.split("@")[0] || "Demo User",
      email: email,
      preferred_currency: "INR",
      theme_mode: "light",
      family_mode: false,
    };

    const demoResponse: AuthResponse = {
      access_token: "demo-token",
      token_type: "bearer",
      user: demoUser,
    };

    localStorage.setItem("financebot-token", "demo-token");
    localStorage.setItem("financebot-demo-user", JSON.stringify(demoUser));
    return demoResponse;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await response.json();
  localStorage.setItem("financebot-token", data.access_token);
  return data;
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // Demo registration - simulate successful registration
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    const demoUser: User = {
      id: Date.now(),
      name: name,
      email: email,
      preferred_currency: "INR",
      theme_mode: "light",
      family_mode: false,
    };

    const demoResponse: AuthResponse = {
      access_token: "demo-token",
      token_type: "bearer",
      user: demoUser,
    };

    localStorage.setItem("financebot-token", "demo-token");
    localStorage.setItem("financebot-demo-user", JSON.stringify(demoUser));
    return demoResponse;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  const data = await response.json();
  localStorage.setItem("financebot-token", data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    const demoUser = localStorage.getItem("financebot-demo-user");
    if (demoUser) {
      return JSON.parse(demoUser);
    }
    throw new Error("No demo user found");
  }

  return apiRequest<User>("/api/auth/me");
}

export function logoutUser(): void {
  localStorage.removeItem("financebot-token");
  localStorage.removeItem("financebot-demo-user");
}

// Demo data for fallback mode
const DEMO_DASHBOARD: DashboardMetrics = {
  monthly_income: 75000,
  total_expenses: 45000,
  total_savings: 125000,
  net_worth: 350000,
  savings_rate: 40.0,
};

const DEMO_INVESTMENTS: Investment[] = [
  {
    id: 1,
    name: "HDFC Top 100 Fund",
    type: "Mutual Fund",
    current_value: 15000,
    initial_amount: 12000,
    growth_percentage: 25.0,
    is_positive: true,
    date_enrolled: "2023-06-15",
    description: "Large cap equity mutual fund for long-term growth",
  },
  {
    id: 2,
    name: "Reliance Industries",
    type: "Stock",
    current_value: 8500,
    initial_amount: 9000,
    growth_percentage: -5.6,
    is_positive: false,
    date_enrolled: "2023-09-20",
    description: "Blue chip stock in energy and petrochemicals sector",
  },
];

const DEMO_GOALS: FinancialGoal[] = [
  {
    id: 1,
    name: "Emergency Fund",
    target_amount: 300000,
    current_saved: 125000,
    deadline: "2024-12-31",
    description: "Build 6 months of emergency fund",
    status: "on_track",
    progress_percentage: 41.7,
  },
  {
    id: 2,
    name: "Vacation to Europe",
    target_amount: 200000,
    current_saved: 85000,
    deadline: "2024-08-15",
    description: "Summer vacation with family",
    status: "behind",
    progress_percentage: 42.5,
  },
];

// Dashboard API functions
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // Return demo data with a slight delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(DEMO_DASHBOARD), 300);
    });
  }

  return apiRequest<DashboardMetrics>("/api/dashboard");
}

// Investment API functions
export async function getInvestments(): Promise<Investment[]> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_INVESTMENTS]), 300);
    });
  }

  return apiRequest<Investment[]>("/api/investments");
}

export async function createInvestment(
  investment: Omit<Investment, "id" | "growth_percentage" | "is_positive">,
): Promise<Investment> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // Demo: create a new investment with calculated growth
    const newInvestment: Investment = {
      ...investment,
      id: Date.now(),
      growth_percentage:
        ((investment.current_value - investment.initial_amount) /
          investment.initial_amount) *
        100,
      is_positive: investment.current_value >= investment.initial_amount,
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newInvestment), 500);
    });
  }

  return apiRequest<Investment>("/api/investments", {
    method: "POST",
    body: JSON.stringify({
      type: investment.type,
      name: investment.name,
      initial_amount: investment.initial_amount,
      current_value: investment.current_value,
      date_enrolled: investment.date_enrolled,
      description: investment.description,
    }),
  });
}

export async function updateInvestment(
  id: number,
  investment: Omit<Investment, "id" | "growth_percentage" | "is_positive">,
): Promise<Investment> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // Demo: return updated investment
    const updatedInvestment: Investment = {
      ...investment,
      id: id,
      growth_percentage:
        ((investment.current_value - investment.initial_amount) /
          investment.initial_amount) *
        100,
      is_positive: investment.current_value >= investment.initial_amount,
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedInvestment), 500);
    });
  }

  return apiRequest<Investment>(`/api/investments/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      type: investment.type,
      name: investment.name,
      initial_amount: investment.initial_amount,
      current_value: investment.current_value,
      date_enrolled: investment.date_enrolled,
      description: investment.description,
    }),
  });
}

export async function deleteInvestment(id: number): Promise<void> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }

  return apiRequest<void>(`/api/investments/${id}`, {
    method: "DELETE",
  });
}

// Goals API functions
export async function getGoals(): Promise<FinancialGoal[]> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_GOALS]), 300);
    });
  }

  return apiRequest<FinancialGoal[]>("/api/goals");
}

export async function createGoal(
  goal: Omit<FinancialGoal, "id" | "progress_percentage">,
): Promise<FinancialGoal> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now(),
      progress_percentage:
        goal.target_amount > 0
          ? (goal.current_saved / goal.target_amount) * 100
          : 0,
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newGoal), 500);
    });
  }

  return apiRequest<FinancialGoal>("/api/goals", {
    method: "POST",
    body: JSON.stringify({
      name: goal.name,
      target_amount: goal.target_amount,
      current_saved: goal.current_saved,
      deadline: goal.deadline,
      description: goal.description,
      status: goal.status,
    }),
  });
}

export async function updateGoal(
  id: number,
  goal: Omit<FinancialGoal, "id" | "progress_percentage">,
): Promise<FinancialGoal> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    const updatedGoal: FinancialGoal = {
      ...goal,
      id: id,
      progress_percentage:
        goal.target_amount > 0
          ? (goal.current_saved / goal.target_amount) * 100
          : 0,
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedGoal), 500);
    });
  }

  return apiRequest<FinancialGoal>(`/api/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: goal.name,
      target_amount: goal.target_amount,
      current_saved: goal.current_saved,
      deadline: goal.deadline,
      description: goal.description,
      status: goal.status,
    }),
  });
}

export async function deleteGoal(id: number): Promise<void> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }

  return apiRequest<void>(`/api/goals/${id}`, {
    method: "DELETE",
  });
}

// Income API functions
export async function getIncomes(): Promise<Income[]> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 300);
    });
  }

  return apiRequest<Income[]>("/api/income");
}

export async function createIncome(
  income: Omit<Income, "id">,
): Promise<Income> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    const newIncome: Income = {
      ...income,
      id: Date.now(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newIncome), 500);
    });
  }

  return apiRequest<Income>("/api/income", {
    method: "POST",
    body: JSON.stringify(income),
  });
}

export async function deleteIncome(id: number): Promise<void> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }

  return apiRequest<void>(`/api/income/${id}`, {
    method: "DELETE",
  });
}

// Expense API functions
export async function getExpenses(): Promise<Expense[]> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 300);
    });
  }

  return apiRequest<Expense[]>("/api/expenses");
}

export async function createExpense(
  expense: Omit<Expense, "id">,
): Promise<Expense> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    const newExpense: Expense = {
      ...expense,
      id: Date.now(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(newExpense), 500);
    });
  }

  return apiRequest<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id: number): Promise<void> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }

  return apiRequest<void>(`/api/expenses/${id}`, {
    method: "DELETE",
  });
}

// User settings API functions
export async function updateUserSettings(
  settings: Partial<User>,
): Promise<User> {
  const isBackendAvailable = await checkBackendAvailability();

  if (!isBackendAvailable) {
    // For demo mode, just return the updated settings as if they were saved
    const demoUser = localStorage.getItem("financebot-demo-user");
    if (demoUser) {
      const user = JSON.parse(demoUser);
      const updatedUser = { ...user, ...settings };
      localStorage.setItem("financebot-demo-user", JSON.stringify(updatedUser));
      return new Promise((resolve) => {
        setTimeout(() => resolve(updatedUser), 300);
      });
    }
    throw new Error("No demo user found");
  }

  return apiRequest<User>("/api/users/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
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
