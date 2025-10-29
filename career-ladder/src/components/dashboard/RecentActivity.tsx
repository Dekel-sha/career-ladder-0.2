import Card from "@/components/ui/card";

export default function RecentActivity({
  applications,
  isLoading,
}: {
  applications: any[];
  isLoading?: boolean;
  onApplicationClick?: (app: any) => void;
}) {
  return (
    <Card className="p-6 card-elevated">
      <div className="text-primary font-semibold mb-2">Recent Activity (placeholder)</div>
      <ul className="text-secondary text-sm space-y-1">
        {(isLoading ? [] : applications || []).map((a, i) => (
          <li key={i}>{a.company} — {a.position} ({a.status})</li>
        ))}
      </ul>
    </Card>
  );
}
