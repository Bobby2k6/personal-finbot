import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";

const existingGoals = [
  {
    id: 1,
    title: "Emergency Fund",
    targetAmount: 300000,
    currentAmount: 125000,
    deadline: "2024-12-31",
    description: "Build 6 months of emergency fund",
    status: "on_track",
  },
  {
    id: 2,
    title: "Vacation to Europe",
    targetAmount: 200000,
    currentAmount: 85000,
    deadline: "2024-08-15",
    description: "Summer vacation with family",
    status: "behind",
  },
  {
    id: 3,
    title: "New Laptop",
    targetAmount: 80000,
    currentAmount: 65000,
    deadline: "2024-03-30",
    description: "Upgrade to MacBook Pro",
    status: "on_track",
  },
];

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    description: "",
  });

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track":
        return "bg-emerald-100 text-emerald-800";
      case "behind":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on_track":
        return "On Track";
      case "behind":
        return "Behind Schedule";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add goal to database
    console.log("Adding goal:", formData);
    setShowForm(false);
    setFormData({
      title: "",
      targetAmount: "",
      deadline: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{existingGoals.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Goals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {existingGoals.filter(g => g.status === "on_track").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">On Track</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{existingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Target</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Goal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial Goals</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Goal"}
          </Button>
        </CardHeader>
        {showForm && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Buy a car"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="Enter target amount"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Existing Goals */}
      <div className="space-y-4">
        {existingGoals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusText(goal.status)}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-3" />
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      ₹{goal.currentAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Monthly target to achieve goal:</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      ₹{Math.ceil((goal.targetAmount - goal.currentAmount) / Math.max(daysRemaining / 30, 1)).toLocaleString()}/month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
