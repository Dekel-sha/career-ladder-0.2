import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import StatsGrid from "@/components/dashboard/StatsGrid";
import PipelineView from "@/components/dashboard/PipelineView";
import UpcomingFollowUps from "@/components/dashboard/UpcomingFollowUps";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ApplicationDetailsDialog from "@/components/applications/ApplicationDetailsDialog";

const WELCOME_MESSAGES = [
  "Welcome back, {name}! 👋",
  "Ready for your next opportunity, {name}?",
  "Good to see you again, {name}. What's your next move?",
  "Let's climb the ladder today, {name}.",
  "Time to land your dream job, {name}!",
  "Your next big break is waiting, {name}.",
];

export default function Dashboard() {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: () => base44.entities.JobApplication.list("-created_date"),
    initialData: [],
  });

  useEffect(() => {
    if (user) {
      const firstName = (user as any).full_name?.split(" ")[0] || "there";
      const lastMessage = localStorage.getItem("lastWelcomeMessage");
      let availableMessages = WELCOME_MESSAGES.filter((msg) => msg !== lastMessage);
      if (availableMessages.length === 0) availableMessages = WELCOME_MESSAGES;
      const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
      const personalizedMessage = randomMessage.replace("{name}", firstName);
      setWelcomeMessage(personalizedMessage);
      localStorage.setItem("lastWelcomeMessage", randomMessage);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => base44.entities.JobApplication.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application updated successfully!");
    },
    onError: () => toast.error("Failed to update application. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => base44.entities.JobApplication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSelectedApp(null);
      toast.success("Application deleted successfully!");
    },
    onError: () => toast.error("Failed to delete application. Please try again."),
  });

  const stats = {
    total: applications.length,
    active: applications.filter((app: any) => ["applied", "interviewing"].includes(app.status)).length,
    interviews: applications.filter((app: any) => app.status === "interviewing").length,
    offers: applications.filter((app: any) => app.status === "offer").length,
  } as const;

  const upcomingFollowUps = applications
    .filter((app: any) => app.follow_up_date && new Date(app.follow_up_date) >= new Date())
    .sort((a: any, b: any) => +new Date(a.follow_up_date) - +new Date(b.follow_up_date))
    .slice(0, 5);

  const recentApplications = applications.slice(0, 6);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {welcomeMessage || "Welcome back! 👋"}
            </h1>
            <p className="text-secondary mt-1">Here's your job search progress</p>
          </div>
          <Link to={`${createPageUrl("Applications")}?new=1`}>
            <Button className="bg-gradient-to-r from-[var(--theme-color)] to-purple-600 hover:shadow-lg transition-all duration-200 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </Link>
        </div>

        <StatsGrid stats={stats as any} isLoading={isLoading} />

        <PipelineView
          applications={applications as any[]}
          isLoading={isLoading}
          onApplicationClick={setSelectedApp}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity
              applications={recentApplications as any[]}
              isLoading={isLoading}
              onApplicationClick={setSelectedApp}
            />
          </div>
          <div>
            <UpcomingFollowUps
              followUps={upcomingFollowUps as any[]}
              isLoading={isLoading}
              onApplicationClick={setSelectedApp}
            />
          </div>
        </div>

        {selectedApp && (
          <ApplicationDetailsDialog
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdate={(data: any) => updateMutation.mutate({ id: (selectedApp as any).id, data })}
            onDelete={() => deleteMutation.mutate((selectedApp as any).id)}
          />
        )}
      </div>
    </div>
  );
}