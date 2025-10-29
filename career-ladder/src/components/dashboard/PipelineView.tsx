import Card from "@/components/ui/card";

export default function PipelineView({
  applications,
  isLoading,
}: {
  applications: any[];
  isLoading?: boolean;
  onApplicationClick?: (app: any) => void;
}) {
  return (
    <Card className="p-6 card-elevated mt-6">
      <div className="text-primary font-semibold mb-2">Pipeline (placeholder)</div>
      <div className="text-secondary text-sm">{isLoading ? "Loading..." : `${applications?.length ?? 0} applications`}</div>
    </Card>
  );
}
