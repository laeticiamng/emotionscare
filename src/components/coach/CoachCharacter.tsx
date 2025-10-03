
import React from 'react';
import { CoachCharacterProps } from '@/types/coach';
import { cn } from '@/lib/utils';

const CoachCharacter: React.FC<CoachCharacterProps> = ({
  name = "Coach",
  avatar,
  mood = "neutral",
  size = "md",
  animated = false,
  animate = false, // Added for backward compatibility
  className,
  onClick
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };
  
  // Use either animated or animate prop for backwards compatibility
  const isAnimated = animated || animate;
  
  // Animation classes
  const animationClasses = isAnimated ? "transition-all duration-300 hover:scale-105" : "";
  
  // Mood color
  const getMoodColor = () => {
    switch (mood) {
      case "happy": return "bg-green-100 border-green-300";
      case "calm": return "bg-blue-100 border-blue-300";
      case "focused": return "bg-purple-100 border-purple-300";
      case "energetic": return "bg-yellow-100 border-yellow-300";
      case "reflective": return "bg-indigo-100 border-indigo-300";
      default: return "bg-blue-100 border-blue-300";
    }
  };
  
  // Pulse animation for the outer ring when animated
  const pulseClasses = isAnimated ? "animate-pulse opacity-70" : "opacity-50";

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full cursor-pointer",
        animationClasses,
        className
      )}
      onClick={onClick}
    >
      {/* Outer glow */}
      <div className={cn(
        "absolute rounded-full",
        sizeClasses[size],
        getMoodColor(),
        pulseClasses,
        "scale-125"
      )} />
      
      {/* Character circle */}
      <div className={cn(
        "relative flex items-center justify-center rounded-full border-2 z-10",
        sizeClasses[size],
        getMoodColor()
      )}>
        {avatar ? (
          <img 
            src={avatar} 
            alt={name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="text-center">
            {/* Simple face representation - can be replaced with SVG */}
            <div className={cn(
              "flex items-center justify-center",
              size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl"
            )}>
              {mood === "happy" ? "😊" : 
               mood === "calm" ? "😌" : 
               mood === "focused" ? "🧠" : 
               mood === "energetic" ? "⚡" : 
               mood === "reflective" ? "🤔" : "🤖"}
            </div>
            <div className={cn(
              "font-medium",
              size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
            )}>
              {name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachCharacter;
