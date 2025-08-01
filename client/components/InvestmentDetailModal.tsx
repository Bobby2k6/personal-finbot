import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Pencil, Save, X, Trash2, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Investment {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  initialValue: number;
  growth: number;
  isPositive: boolean;
  dateEnrolled?: string;
  description?: string;
}

interface InvestmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment | null;
  onSave?: (investment: Investment) => void;
  onDelete?: (investmentId: string) => void;
}

export function InvestmentDetailModal({
  open,
  onOpenChange,
  investment,
  onSave,
  onDelete,
}: InvestmentDetailModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Investment | null>(null);

  // Check if this is a new investment (id exists but values are defaults)
  const isNewInvestment = investment && investment.name === "New Investment" && investment.currentValue === 0;

  // Auto-enter edit mode for new investments
  useState(() => {
    if (isNewInvestment && !isEditing) {
      setIsEditing(true);
      setEditData(investment);
    }
  });

  if (!investment && !isEditing) return null;

  const handleEdit = () => {
    setEditData(investment);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      const updatedInvestment = {
        ...editData,
        growth: ((editData.currentValue - editData.initialValue) / editData.initialValue) * 100,
        isPositive: editData.currentValue >= editData.initialValue,
      };
      onSave?.(updatedInvestment);
      setIsEditing(false);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (investment && !user?.isDemo) {
      onDelete?.(investment.id);
      onOpenChange(false);
    }
  };

  const currentInvestment = editData || investment;
  if (!currentInvestment) return null;

  const growthAmount = currentInvestment.currentValue - currentInvestment.initialValue;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Investment' : 'Investment Details'}</span>
            {!user?.isDemo && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={handleEdit}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your investment details' : 'View and manage your investment'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Investment Overview */}
          <Card className={`${currentInvestment.isPositive ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <Badge variant={currentInvestment.isPositive ? "default" : "destructive"}>
                  {currentInvestment.type}
                </Badge>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{currentInvestment.currentValue.toLocaleString()}
                </div>
                <div className={`flex items-center justify-center gap-1 text-sm ${currentInvestment.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {currentInvestment.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {currentInvestment.isPositive ? '+' : ''}₹{Math.abs(growthAmount).toLocaleString()} 
                  ({currentInvestment.isPositive ? '+' : ''}{currentInvestment.growth.toFixed(1)}%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Details Form */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Investment Name</Label>
              <Input
                id="name"
                value={currentInvestment.name}
                onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : null)}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={currentInvestment.type}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, type: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateEnrolled">Date Enrolled</Label>
                <Input
                  id="dateEnrolled"
                  type="date"
                  value={currentInvestment.dateEnrolled || '2024-01-01'}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, dateEnrolled: e.target.value } : null)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialValue">Initial Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="initialValue"
                    type="number"
                    value={currentInvestment.initialValue}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, initialValue: parseFloat(e.target.value) || 0 } : null)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentValue">Current Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentValue"
                    type="number"
                    value={currentInvestment.currentValue}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, currentValue: parseFloat(e.target.value) || 0 } : null)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={currentInvestment.description || ''}
                onChange={(e) => setEditData(prev => prev ? { ...prev, description: e.target.value } : null)}
                disabled={!isEditing}
                placeholder="Add notes about this investment..."
              />
            </div>
          </div>

          {/* Growth Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Amount</div>
              <div className={`text-lg font-semibold ${currentInvestment.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {currentInvestment.isPositive ? '+' : ''}₹{Math.abs(growthAmount).toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
              <div className={`text-lg font-semibold ${currentInvestment.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {currentInvestment.isPositive ? '+' : ''}{currentInvestment.growth.toFixed(1)}%
              </div>
            </div>
          </div>

          {user?.isDemo && (
            <div className="text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              Sign in to edit your investment data
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
