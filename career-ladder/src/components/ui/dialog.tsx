import * as React from "react";
export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean)=>void; children: React.ReactNode }) {
  React.useEffect(() => { if (open === false) onOpenChange?.(false); }, [open, onOpenChange]);
  return <>{children}</>;
}
export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className={`relative z-10 rounded-2xl bg-card p-4 w-[95vw] max-w-3xl ${className || ""}`}>{children}</div>
    </div>
  );
}
export function DialogHeader({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={`text-xl font-semibold text-primary ${className || ""}`}>{children}</h2>;
}
export default { Dialog, DialogContent, DialogHeader, DialogTitle };
