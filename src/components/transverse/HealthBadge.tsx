// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

type HealthState = "online" | "degraded" | "offline";

export function HealthBadge() {
  const [state, setState] = useState<HealthState>("online");
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const ping = async () => {
      try {
        const response = await fetch("/healthz", { 
          method: "GET", 
          cache: "no-store",
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setState("online");
        } else {
          setState("degraded");
        }
      } catch (error) {
        setState("offline");
      }
      
      timer = setTimeout(ping, 60000);
    };

    ping();
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (state) {
      case "online": return <Wifi className="h-3 w-3" />;
      case "degraded": return <AlertTriangle className="h-3 w-3" />;
      case "offline": return <WifiOff className="h-3 w-3" />;
    }
  };

  const getLabel = () => {
    switch (state) {
      case "online": return "En ligne";
      case "degraded": return "Dégradé";
      case "offline": return "Hors ligne";
    }
  };

  const getVariant = () => {
    switch (state) {
      case "online": return "secondary" as const;
      case "degraded": return "outline" as const;
      case "offline": return "destructive" as const;
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate("/b2b/admin/api-monitoring")}
      aria-label={`Santé du système: ${getLabel()}`}
    >
      {getIcon()}
      <span className="ml-1">{getLabel()}</span>
    </Badge>
  );
}