import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-custom bg-card px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-[var(--theme-color)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export default Input;
