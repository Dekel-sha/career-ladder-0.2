import * as React from "react";
import { cn } from "@/lib/utils";

export const Popover = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>(
  ({ className, open, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open || false);
    
    React.useEffect(() => {
      if (open !== undefined) {
        setIsOpen(open);
      }
    }, [open]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              isOpen, 
              onOpenChange: handleOpenChange 
            } as any);
          }
          return child;
        })}
      </div>
    );
  }
);
Popover.displayName = "Popover";

export const PopoverTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>(
  ({ className, asChild, isOpen, onOpenChange, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("", className)} 
      onClick={() => onOpenChange?.(!isOpen)}
      {...props}
    >
      {children}
    </div>
  )
);
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end";
  isOpen?: boolean;
}>(
  ({ className, align = "center", isOpen, children, ...props }, ref) => {
    if (!isOpen) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 w-72 rounded-md border bg-card p-4 text-primary shadow-lg outline-none",
          align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 transform -translate-x-1/2",
          "top-full mt-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";
