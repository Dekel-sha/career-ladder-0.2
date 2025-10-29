import * as React from "react";
export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [val, setVal] = React.useState(defaultValue);
  return <TabsContext.Provider value={{ val, setVal }}>{children}</TabsContext.Provider>;
}
const TabsContext = React.createContext<{ val: string; setVal: (v: string) => void } | null>(null);
export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex gap-2 rounded-lg bg-black/5 dark:bg-white/10 p-1">{children}</div>;
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.val === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setVal(value)}
      className={`px-3 py-1.5 rounded-md text-sm ${active ? "bg-card shadow text-primary" : "text-secondary"}`}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.val !== value) return null;
  return <div className={className}>{children}</div>;
}
export default { Tabs, TabsList, TabsTrigger, TabsContent };
