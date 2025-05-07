
import * as React from "react";
import { cn } from "@/lib/utils";

const ExpandedTabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-4 w-full",
      className
    )}
    {...props}
  />
));
ExpandedTabs.displayName = "ExpandedTabs";

const ExpandedTabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap gap-2",
      className
    )}
    {...props}
  />
));
ExpandedTabsList.displayName = "ExpandedTabsList";

const ExpandedTabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "px-4 py-2 rounded-lg font-medium text-sm transition-all",
      active 
        ? "bg-primary text-primary-foreground" 
        : "bg-muted hover:bg-muted/80 text-muted-foreground",
      className
    )}
    {...props}
  />
));
ExpandedTabsTrigger.displayName = "ExpandedTabsTrigger";

const ExpandedTabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      active ? "block" : "hidden",
      "mt-2 rounded-lg animate-fade-in",
      className
    )}
    {...props}
  />
));
ExpandedTabsContent.displayName = "ExpandedTabsContent";

export { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent };
