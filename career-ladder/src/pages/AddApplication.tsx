import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { JobApplication } from "@/entities/JobApplication";

import ApplicationForm from "../components/applications/ApplicationForm";

export default function AddApplication() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: Partial<JobApplication>) => base44.entities.JobApplication.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application created successfully!");
      navigate(createPageUrl("Dashboard"));
    },
    onError: () => {
      toast.error("Failed to create application. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: Partial<JobApplication>) => {
    setIsSubmitting(true);
    await createMutation.mutateAsync(data);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-2xl">Add New Application</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ApplicationForm
              onSubmit={handleSubmit}
              onCancel={() => navigate(createPageUrl("Dashboard"))}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
