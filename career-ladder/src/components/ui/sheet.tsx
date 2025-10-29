import * as React from "react";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open = false, children }) => {
  if (!open) return null;
  return <>{children}</>;
};

export const SheetContent: React.FC<SheetContentProps> = ({ side = "left", className, children }) => {
  const sideClasses = {
    left: "fixed left-0 top-0 h-full z-50",
    right: "fixed right-0 top-0 h-full z-50",
    top: "fixed top-0 left-0 w-full z-50",
    bottom: "fixed bottom-0 left-0 w-full z-50",
  };

  return (
    <div className={`${sideClasses[side]} ${className || ""}`}>
      {children}
    </div>
  );
};

export default Sheet;
