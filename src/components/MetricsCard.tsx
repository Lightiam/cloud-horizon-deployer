
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
}

const MetricsCard = ({ title, value, change, changeType, icon }: MetricsCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="text-emerald-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {changeType === "increase" ? (
            <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={changeType === "increase" ? "text-emerald-500" : "text-red-500"}>
            {change}%
          </span>
          <span className="text-gray-400 ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
