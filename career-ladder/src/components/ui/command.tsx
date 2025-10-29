import * as React from "react";
import { cn } from "@/lib/utils";

export const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-card text-primary border border-custom",
        className
      )}
      {...props}
    />
  )
);
Command.displayName = "Command";

export const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  onValueChange?: (value: string) => void;
}>(
  ({ className, onValueChange, ...props }, ref) => (
    <div className="flex items-center border-b border-custom px-3">
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-secondary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = "CommandInput";

export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm text-secondary", className)}
      {...props}
    />
  )
);
CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-hidden p-1 text-primary", className)}
      {...props}
    />
  )
);
CommandGroup.displayName = "CommandGroup";

export const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}>(
  ({ className, value, onSelect, disabled, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/5 aria-selected:bg-black/5 dark:aria-selected:bg-white/5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onSelect?.(value || "")}
      {...props}
    />
  )
);
CommandItem.displayName = "CommandItem";

// Export all components as default for easier importing
export default {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};
