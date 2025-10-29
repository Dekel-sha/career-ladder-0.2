import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationForm from "@/components/applications/ApplicationForm";
import ApplicationDetailsDialog from "@/components/applications/ApplicationDetailsDialog";
import { listApps, createApp, updateApp, deleteApp, seedIfEmpty } from "@/api/apps";
import type { JobApplication } from "@/api/apps";

export default function ApplicationsPage() {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = React.useState(false);
  const [selected, setSelected] = React.useState<JobApplication | null>(null);

  React.useEffect(() => {
    seedIfEmpty();
  }, []);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setIsCreating(true);
    }
  }, [searchParams]);

  const appsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: listApps,
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (data: Partial<JobApplication>) => createApp(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      setIsCreating(false);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    },
  });

  const updateMut = useMutation({
    mutationFn: (vars: { id: string; data: Partial<JobApplication> }) => updateApp(vars.id, vars.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      setSelected((prev) => (prev ? { ...prev, ...vars.data } as JobApplication : prev));
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteApp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      setSelected(null);
    },
  });

  const handleCancelCreate = () => {
    setIsCreating(false);
    searchParams.delete("new");
    setSearchParams(searchParams, { replace: true });
  };

  const handleSubmitCreate = (data: Partial<JobApplication>) => {
    createMut.mutate(data);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">All Applications</h1>
            <p className="text-secondary mt-1">Browse and manage your job applications.</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[var(--theme-color)] to-purple-600 text-white"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {isCreating && (
          <div className="rounded-xl border border-custom p-6 bg-card">
            <h2 className="text-lg font-semibold mb-4 text-primary">Create New Application</h2>
            <ApplicationForm
              onSubmit={handleSubmitCreate}
              onCancel={handleCancelCreate}
              isSubmitting={createMut.isPending}
              initialData={{}}
            />
          </div>
        )}

        <ApplicationsTable
          items={appsQuery.data as JobApplication[]}
          onOpenDetails={(app) => setSelected(app)}
        />

        {selected && (
          <ApplicationDetailsDialog
            application={selected}
            onClose={() => setSelected(null)}
            onUpdate={(data) => updateMut.mutate({ id: selected.id, data })}
            onDelete={() => deleteMut.mutate(selected.id)}
          />
        )}
      </div>
    </div>
  );
}