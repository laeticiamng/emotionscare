import { useEffect } from "react";
import { flushMetricsQueue } from "@/core/metricsQueue";

export function QueueFlusher() {
  useEffect(() => {
    const handleOnline = () => {
      flushMetricsQueue();
    };

    // Flush when coming back online
    window.addEventListener("online", handleOnline);
    
    // Periodic flush every 60 seconds
    const interval = setInterval(handleOnline, 60000);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, []);

  return null; // This component doesn't render anything
}