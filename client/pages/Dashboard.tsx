import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, MousePointer } from "lucide-react";
import { MetricBreakdownModal } from "@/components/MetricBreakdownModal";
import { useAuth } from "@/contexts/AuthContext";

// Placeholder data - will be replaced with API calls
const metrics = {
  monthlyIncome: 75000,
  totalExpenses: 45000,
  totalSavings: 125000,
  netWorth: 350000,
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
  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{metrics.monthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{metrics.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{metrics.totalSavings.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₹{metrics.netWorth.toLocaleString()}</div>
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
                    <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">₹{expense.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{expense.percentage}%</div>
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
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm font-medium text-emerald-700">Total Income</span>
                <span className="text-sm font-bold text-emerald-900">₹{metrics.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-700">Total Expenses</span>
                <span className="text-sm font-bold text-red-900">₹{metrics.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Net Savings</span>
                <span className="text-sm font-bold text-blue-900">₹{(metrics.monthlyIncome - metrics.totalExpenses).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Savings Rate</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {((metrics.monthlyIncome - metrics.totalExpenses) / metrics.monthlyIncome * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
