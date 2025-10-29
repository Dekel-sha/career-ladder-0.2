import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700 border-blue-200",
  interviewing: "bg-purple-100 text-purple-700 border-purple-200",
  offer: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-gray-100 text-gray-700 border-gray-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  withdrawn: "bg-orange-100 text-orange-700 border-orange-200",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function ApplicationCard({
  application,
  onClick,
}: {
  application: any;
  onClick?: () => void;
}) {
  const hasUpcomingFollowUp =
    application.follow_up_date &&
    new Date(application.follow_up_date) >= new Date();

  const followUpDays = hasUpcomingFollowUp
    ? differenceInDays(new Date(application.follow_up_date), new Date())
    : null;

  return (
    <Card
      onClick={onClick}
      className="border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                {application.company}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {application.position}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={statusColors[application.status] || ""}>
              {application.status}
            </Badge>
            {application.priority && application.priority !== "medium" && (
              <Badge variant="secondary" className={priorityColors[application.priority] || ""}>
                {application.priority}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {application.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{application.location}</span>
              </div>
            )}
            {application.applied_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Applied {format(new Date(application.applied_date), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {hasUpcomingFollowUp && (
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${
                    (followUpDays ?? 2) <= 1 ? "text-red-500" : "text-orange-500"
                  }`}
                />
                <span
                  className={
                    (followUpDays ?? 2) <= 1
                      ? "text-red-600 font-medium"
                      : "text-orange-600"
                  }
                >
                  Follow-up{" "}
                  {followUpDays === 0
                    ? "today"
                    : followUpDays === 1
                    ? "tomorrow"
                    : `in ${followUpDays} days`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
