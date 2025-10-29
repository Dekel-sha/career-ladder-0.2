import React from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, Clock, MessageSquare, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type StatKey = "total" | "active" | "interviews" | "offers";

const statCards: Array<{
  title: string;
  key: StatKey;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
}> = [
  { title: "Total Applications", key: "total", icon: Briefcase, gradient: "from-blue-500 to-cyan-500" },
  { title: "Active",              key: "active", icon: Clock,     gradient: "from-purple-500 to-pink-500" },
  { title: "Interviews",          key: "interviews", icon: MessageSquare, gradient: "from-orange-500 to-red-500" },
  { title: "Offers",              key: "offers", icon: Trophy,    gradient: "from-green-500 to-emerald-500" },
];

export default function StatsGrid({
  stats,
  isLoading = false,
}: {
  stats: Record<StatKey, number>;
  isLoading?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.key} className="relative overflow-hidden border-none card-elevated">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
          <div className="p-6 relative">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">{stats[stat.key]}</div>
            )}
            <div className="text-sm text-secondary mt-1">{stat.title}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
