import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const investments = [
  {
    name: "HDFC Top 100 Fund",
    type: "Mutual Fund",
    currentValue: 15000,
    initialValue: 12000,
    growth: 25.0,
    isPositive: true,
  },
  {
    name: "Reliance Industries",
    type: "Stock",
    currentValue: 8500,
    initialValue: 9000,
    growth: -5.6,
    isPositive: false,
  },
  {
    name: "Bitcoin",
    type: "Crypto",
    currentValue: 12000,
    initialValue: 10000,
    growth: 20.0,
    isPositive: true,
  },
  {
    name: "Gold ETF",
    type: "Gold",
    currentValue: 5500,
    initialValue: 5200,
    growth: 5.8,
    isPositive: true,
  },
];

export default function Investments() {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInitial = investments.reduce((sum, inv) => sum + inv.initialValue, 0);
  const totalGrowth = ((totalValue - totalInitial) / totalInitial) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
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
