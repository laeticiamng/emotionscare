
import React from "react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import AudioControls from '@/components/audio/AudioControls';

interface PageHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  text,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        <AudioControls minimal />
        <ThemeSelector minimal />
        {children}
      </div>
    </div>
  );
}
