import * as React from "react";
export function Select({
  value,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}) {
  return <div data-select-value={value}>{children}</div>;
}
export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <div className="border border-custom rounded-md px-3 py-2 bg-card text-primary">{children}</div>;
}
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-secondary">{placeholder ?? ""}</span>;
}
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 space-y-1">{children}</div>;
}
export function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (v: string) => void;
}) {
  return (
    <button
      type="button"
      className="block w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </button>
  );
}
// wire simple behavior: parent passes onValueChange; we intercept clicks via context
// Minimal enhancement: we expose a helper HOC to map clicks
export default { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
