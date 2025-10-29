import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  trend?: string;
  alert?: boolean;
}

export default function MetricCard({ title, value, icon: Icon, gradient, trend, alert }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardContent className="p-6 relative">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {trend && (
          <Badge variant="secondary" className="mt-3 bg-green-50 text-green-700 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </Badge>
        )}
        {alert && (
          <Badge variant="secondary" className="mt-3 bg-orange-50 text-orange-700 border-orange-200">
            Action needed
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
