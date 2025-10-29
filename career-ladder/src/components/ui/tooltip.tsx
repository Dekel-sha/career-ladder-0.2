import * as React from "react";
export const TooltipProvider: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;
export const Tooltip: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;
export const TooltipTrigger: React.FC<{asChild?: boolean, children: React.ReactNode}> = ({ children }) => <>{children}</>;
export const TooltipContent: React.FC<{side?: "right" | "left" | "top" | "bottom", children: React.ReactNode}> = ({ children }) => <>{children}</>;
export default Tooltip;
