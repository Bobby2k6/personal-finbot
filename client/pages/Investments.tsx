import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus, Eye, MoreVertical } from "lucide-react";
import { InvestmentDetailModal } from "@/components/InvestmentDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const initialInvestments: Investment[] = [
  {
    id: "1",
    name: "HDFC Top 100 Fund",
    type: "Mutual Fund",
    currentValue: 15000,
    initialValue: 12000,
    growth: 25.0,
    isPositive: true,
    dateEnrolled: "2023-06-15",
    description: "Large cap equity mutual fund for long-term growth",
  },
  {
    id: "2",
    name: "Reliance Industries",
    type: "Stock",
    currentValue: 8500,
    initialValue: 9000,
    growth: -5.6,
    isPositive: false,
    dateEnrolled: "2023-09-20",
    description: "Blue chip stock in energy and petrochemicals sector",
  },
  {
    id: "3",
    name: "Bitcoin",
    type: "Crypto",
    currentValue: 12000,
    initialValue: 10000,
    growth: 20.0,
    isPositive: true,
    dateEnrolled: "2023-11-01",
    description: "Digital cryptocurrency investment",
  },
  {
    id: "4",
    name: "Gold ETF",
    type: "Gold",
    currentValue: 5500,
    initialValue: 5200,
    growth: 5.8,
    isPositive: true,
    dateEnrolled: "2023-08-10",
    description: "Gold exchange-traded fund for portfolio diversification",
  },
];

export default function Investments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInitial = investments.reduce((sum, inv) => sum + inv.initialValue, 0);
  const totalGrowth = ((totalValue - totalInitial) / totalInitial) * 100;

  const handleViewDetails = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  const handleSaveInvestment = (updatedInvestment: Investment) => {
    setInvestments(prev =>
      prev.map(inv => inv.id === updatedInvestment.id ? updatedInvestment : inv)
    );
    setIsModalOpen(false);
    setSelectedInvestment(null);
  };

  const handleDeleteInvestment = (investmentId: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== investmentId));
    setIsModalOpen(false);
    setSelectedInvestment(null);
  };

  const handleAddInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: "New Investment",
      type: "Stock",
      currentValue: 0,
      initialValue: 0,
      growth: 0,
      isPositive: true,
      dateEnrolled: new Date().toISOString().split('T')[0],
      description: "",
    };
    setInvestments(prev => [...prev, newInvestment]);
    setSelectedInvestment(newInvestment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Overview</CardTitle>
          <Button onClick={handleAddInvestment} disabled={user?.isDemo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">₹{totalValue.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Current Value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">₹{totalInitial.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Initial Investment</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${totalGrowth >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                {totalGrowth >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
              </div>
              <div className={`text-sm ${totalGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Total Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{investment.name}</div>
                  <div className="text-sm text-gray-500">{investment.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{investment.currentValue.toLocaleString()}</div>
                  <div className={`text-sm flex items-center gap-1 ${investment.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {investment.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {investment.isPositive ? '+' : ''}{investment.growth.toFixed(1)}%
                    {investment.isPositive ? ' ✅' : ' ❌'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
