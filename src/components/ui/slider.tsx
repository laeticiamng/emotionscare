
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showTooltip?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showTooltip, ...props }, ref) => {
  const [tooltipValue, setTooltipValue] = React.useState<number | null>(null);
  
  const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
    if (showTooltip && props.value && Array.isArray(props.value)) {
      setTooltipValue(props.value[0]);
    }
  }, [showTooltip, props.value]);
  
  const handlePointerLeave = React.useCallback(() => {
    setTooltipValue(null);
  }, []);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {props.value && Array.isArray(props.value) && props.value.map((_, index) => (
        <SliderPrimitive.Thumb 
          key={index}
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" 
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />
      ))}
      
      {showTooltip && tooltipValue !== null && (
        <div className="absolute -top-8 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
          {tooltipValue}
        </div>
      )}
    </SliderPrimitive.Root>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
