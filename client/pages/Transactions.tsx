import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

const recentTransactions = [
  { id: 1, amount: -2500, category: "Food", description: "Grocery shopping", date: "2024-01-15", type: "expense" },
  { id: 2, amount: 75000, category: "Salary", description: "Monthly salary", date: "2024-01-01", type: "income" },
  { id: 3, amount: -800, category: "Transport", description: "Uber rides", date: "2024-01-14", type: "expense" },
  { id: 4, amount: -1200, category: "Entertainment", description: "Movie tickets", date: "2024-01-13", type: "expense" },
  { id: 5, amount: -20000, category: "Rent", description: "Monthly rent", date: "2024-01-01", type: "expense" },
];

const monthlyBudget = {
  total: 50000,
  spent: 32500,
  remaining: 17500,
  progress: 65,
};

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    type: "expense",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add transaction to database
    console.log("Adding transaction:", formData);
    setShowForm(false);
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      type: "expense",
    });
  };

  return (
    <div className="space-y-6">
      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget Usage</span>
              <span className="text-sm font-medium">{monthlyBudget.progress}%</span>
            </div>
            <Progress value={monthlyBudget.progress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">₹{monthlyBudget.total.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Budget</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">₹{monthlyBudget.spent.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Spent</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-600">₹{monthlyBudget.remaining.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add Transaction</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Transaction"}
          </Button>
        </CardHeader>
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === "income" ? (
                        <>
                          <SelectItem value="Salary">Salary</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Transaction</Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"}`}>
                    {transaction.type === "income" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.category} • {transaction.date}</div>
                  </div>
                </div>
                <div className={`font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
