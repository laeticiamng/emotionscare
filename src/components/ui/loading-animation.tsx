import React from "react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "minimal";
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = "md",
  text,
  variant = "default",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
          sizeClasses[size]
        )}
      />
      {text && variant !== "minimal" && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

export default LoadingAnimation;