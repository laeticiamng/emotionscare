// @ts-nocheck
import { usePrivacy } from "@/core/privacy";
import { NoCamVariant } from "./NoCamVariant";
import { NoMicVariant } from "./NoMicVariant";
import { SimHRVariant } from "./SimHRVariant";

interface PrivacyGateProps {
  sensor: "cam" | "mic" | "hr" | "push";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PrivacyGate({ sensor, children, fallback }: PrivacyGateProps) {
  const privacy = usePrivacy();
  
  const allowed = privacy[sensor];
  
  if (!allowed) {
    if (fallback) return <>{fallback}</>;
    
    // Default fallbacks based on sensor type
    if (sensor === "cam") return <NoCamVariant />;
    if (sensor === "mic") return <NoMicVariant />;
    if (sensor === "hr") return <SimHRVariant />;
    
    return (
      <div className="flex items-center justify-center min-h-[200px]" data-testid="page-root">
        <p className="text-muted-foreground">Capteur désactivé</p>
      </div>
    );
  }
  
  return <>{children}</>;
}