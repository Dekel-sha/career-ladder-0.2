import * as React from "react";
export function AlertDialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o:boolean)=>void; children: React.ReactNode }) {
  React.useEffect(() => { if (open === false) onOpenChange?.(false); }, [open, onOpenChange]);
  return <>{children}</>;
}
export function AlertDialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 rounded-2xl bg-card p-4 w-[95vw] max-w-lg">{children}</div>
    </div>
  );
}
export function AlertDialogHeader({ children }: { children: React.ReactNode }) { return <div className="mb-3">{children}</div>; }
export function AlertDialogTitle({ children }: { children: React.ReactNode }) { return <h3 className="text-lg font-semibold text-primary">{children}</h3>; }
export function AlertDialogDescription({ children }: { children: React.ReactNode }) { return <p className="text-secondary text-sm">{children}</p>; }
export function AlertDialogFooter({ children }: { children: React.ReactNode }) { return <div className="mt-4 flex justify-end gap-2">{children}</div>; }
export function AlertDialogAction({ className, onClick, children }: { className?: string; onClick?: ()=>void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`px-3 py-2 rounded-md bg-blue-600 text-white ${className || ""}`}>{children}</button>;
}
export function AlertDialogCancel({ onClick, children }: { onClick?: ()=>void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className="px-3 py-2 rounded-md bg-black/5 dark:bg-white/10">{children}</button>;
}
export default {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
};
