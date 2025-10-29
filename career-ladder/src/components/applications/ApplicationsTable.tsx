import ApplicationCard from "./ApplicationCard";
import type { JobApplication } from "@/api/apps";

export default function ApplicationsTable({
  items,
  onOpenDetails,
}: {
  items: JobApplication[];
  onOpenDetails: (app: JobApplication) => void;
}) {
  if (!items?.length) {
    return (
      <div className="rounded-xl border border-custom p-8 text-center text-secondary">
        No applications yet. Click "New Application" to add your first one.
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app as any}
          onClick={() => onOpenDetails(app)}
        />
      ))}
    </div>
  );
}
