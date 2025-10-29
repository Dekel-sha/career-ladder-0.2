import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "default" }) {
  const base = "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium";
  const variants: Record<string, string> = {
    default: "bg-black/5 dark:bg-white/10 border-transparent text-primary",
    secondary: "bg-black/5 dark:bg-white/10 border-custom text-primary",
  };
  return <span className={cn(base, variants[variant], className)} {...props} />;
}
export default Badge;
