
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      "px-4 py-2 rounded-lg font-medium text-sm transition-all relative overflow-hidden group",
      active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:shadow-sm",
      className
    )}
    {...props}
  >
    {/* Effet d'animation au survol */}
    {!active && (
      <span className="absolute inset-0 w-full h-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
    
    {/* Animation de clic */}
    {active && (
      <motion.span
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0 }}
        className="absolute inset-0 rounded-lg bg-primary-foreground"
      />
    )}
    
    {/* Contenu du bouton */}
    <span className="relative z-10">{props.children}</span>
  </button>
));
ExpandedTabsTrigger.displayName = "ExpandedTabsTrigger";

const ExpandedTabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg",
      active 
        ? "block animate-in fade-in-50 duration-300 ease-out" 
        : "hidden",
      className
    )}
    {...props}
  />
));
ExpandedTabsContent.displayName = "ExpandedTabsContent";

export { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent };
