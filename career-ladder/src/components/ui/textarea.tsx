import * as React from "react";
import { cn } from "@/lib/utils";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-custom bg-card px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-[var(--theme-color)]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
export default Textarea;
