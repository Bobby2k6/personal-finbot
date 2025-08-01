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
import { useState } from "react";
import { Pencil, Save, X, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface BreakdownItem {
  id: string;
  label: string;
  amount: number;
  editable?: boolean;
}

interface MetricBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  items: BreakdownItem[];
  onSave?: (items: BreakdownItem[]) => void;
  allowEdit?: boolean;
}

export function MetricBreakdownModal({
  open,
  onOpenChange,
  title,
  description,
  items,
  onSave,
  allowEdit = true,
}: MetricBreakdownModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editableItems, setEditableItems] = useState<BreakdownItem[]>(items);

  const handleSave = () => {
    onSave?.(editableItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableItems(items);
    setIsEditing(false);
  };

  const addNewItem = () => {
    const newItem: BreakdownItem = {
      id: Date.now().toString(),
      label: "New Item",
      amount: 0,
      editable: true,
    };
    setEditableItems([...editableItems, newItem]);
  };

  const updateItem = (
    id: string,
    field: keyof BreakdownItem,
    value: string | number,
  ) => {
    setEditableItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeItem = (id: string) => {
    setEditableItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = editableItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            {allowEdit && !user?.isDemo && (
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total Display */}
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  ₹{total.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  Total {title}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {editableItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                {isEditing && item.editable !== false ? (
                  <>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateItem(item.id, "label", e.target.value)
                        }
                        placeholder="Item name"
                        className="h-8"
                      />
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "amount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="Amount"
                        className="h-8"
                      />
                    </div>
                    {item.editable !== false && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </div>
                      {item.editable === false && (
                        <Badge variant="secondary" className="text-xs">
                          Auto-calculated
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ₹{item.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((item.amount / total) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Item Button */}
          {isEditing && (
            <Button variant="outline" className="w-full" onClick={addNewItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}

          {user?.isDemo && (
            <div className="text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              Sign in to edit your financial data
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
