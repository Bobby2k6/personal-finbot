import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, MousePointer } from "lucide-react";
import { MetricBreakdownModal } from "@/components/MetricBreakdownModal";
import { useAuth } from "@/contexts/AuthContext";

import { getDashboardMetrics, DashboardMetrics } from "@/lib/finance-api";

// Placeholder data - will be replaced with API calls
const defaultMetrics: DashboardMetrics = {
  monthly_income: 75000,
  total_expenses: 45000,
  total_savings: 125000,
  net_worth: 350000,
  savings_rate: 40.0,
};

const expenseData = [
  { category: "Rent", amount: 20000, percentage: 44.4, color: "#8b5cf6" },
  { category: "Food", amount: 12000, percentage: 26.7, color: "#06b6d4" },
  { category: "Transport", amount: 8000, percentage: 17.8, color: "#10b981" },
  { category: "Entertainment", amount: 3000, percentage: 6.7, color: "#f59e0b" },
  { category: "Others", amount: 2000, percentage: 4.4, color: "#ef4444" },
];

const incomeBreakdown = [
  { id: "1", label: "Salary", amount: 65000, editable: true },
  { id: "2", label: "Freelance", amount: 8000, editable: true },
  { id: "3", label: "Investments", amount: 2000, editable: true },
];

const savingsBreakdown = [
  { id: "1", label: "Emergency Fund", amount: 75000, editable: true },
  { id: "2", label: "Retirement Fund", amount: 30000, editable: true },
  { id: "3", label: "Short-term Savings", amount: 20000, editable: true },
];

const netWorthBreakdown = [
  { id: "1", label: "Cash & Savings", amount: 125000, editable: false },
  { id: "2", label: "Investments", amount: 185000, editable: false },
  { id: "3", label: "Property", amount: 80000, editable: true },
  { id: "4", label: "Debt", amount: -40000, editable: true },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        // Keep default metrics if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handleSaveBreakdown = (metric: string, items: any[]) => {
    // TODO: Save to database
    console.log(`Saving ${metric} breakdown:`, items);
    setSelectedMetric(null);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleMetricClick('income')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</CardTitle>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.monthly_income.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleMetricClick('expenses')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</CardTitle>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Wallet className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.total_expenses.toLocaleString()}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleMetricClick('savings')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Savings</CardTitle>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <PiggyBank className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.total_savings.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleMetricClick('networth')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Worth</CardTitle>
            <div className="flex items-center gap-1">
              <MousePointer className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{metrics.net_worth.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseData.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: expense.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">₹{expense.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{expense.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Income</span>
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">₹{metrics.monthly_income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">Total Expenses</span>
                <span className="text-sm font-bold text-red-900 dark:text-red-200">₹{metrics.total_expenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Net Savings</span>
                <span className="text-sm font-bold text-blue-900 dark:text-blue-200">₹{(metrics.monthly_income - metrics.total_expenses).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {metrics.savings_rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Modals */}
      <MetricBreakdownModal
        open={selectedMetric === 'income'}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        title="Monthly Income"
        description="Breakdown of your monthly income sources"
        items={incomeBreakdown}
        onSave={(items) => handleSaveBreakdown('income', items)}
      />

      <MetricBreakdownModal
        open={selectedMetric === 'expenses'}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        title="Total Expenses"
        description="Breakdown of your monthly expenses"
        items={expenseData.map(expense => ({
          id: expense.category.toLowerCase(),
          label: expense.category,
          amount: expense.amount,
          editable: true,
        }))}
        onSave={(items) => handleSaveBreakdown('expenses', items)}
      />

      <MetricBreakdownModal
        open={selectedMetric === 'savings'}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        title="Total Savings"
        description="Breakdown of your savings accounts and funds"
        items={savingsBreakdown}
        onSave={(items) => handleSaveBreakdown('savings', items)}
      />

      <MetricBreakdownModal
        open={selectedMetric === 'networth'}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        title="Net Worth"
        description="Assets and liabilities that make up your net worth"
        items={netWorthBreakdown}
        onSave={(items) => handleSaveBreakdown('networth', items)}
        allowEdit={true}
      />
    </div>
  );
}
