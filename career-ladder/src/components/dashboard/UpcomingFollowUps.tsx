import Card from "@/components/ui/card";

export default function UpcomingFollowUps({
  followUps,
  isLoading,
}: {
  followUps: any[];
  isLoading?: boolean;
  onApplicationClick?: (app: any) => void;
}) {
  return (
    <Card className="p-6 card-elevated">
      <div className="text-primary font-semibold mb-2">Upcoming Follow-Ups (placeholder)</div>
      <ul className="text-secondary text-sm space-y-1">
        {(isLoading ? [] : followUps || []).map((f, i) => (
          <li key={i}>{f.company} — {f.follow_up_date}</li>
        ))}
      </ul>
    </Card>
  );
}
