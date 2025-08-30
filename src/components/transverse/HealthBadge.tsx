import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HealthState = "online" | "degraded" | "offline";

export function HealthBadge() {
  const [state, setState] = useState<HealthState>("online");
  const navigate = useNavigate();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/healthz', { 
          signal: AbortSignal.timeout(5000) 
        });
        
        if (response.ok) {
          const data = await response.json();
          setState(data.degraded ? "degraded" : "online");
        } else {
          setState("degraded");
        }
      } catch (error) {
        setState("offline");
      }
    };

    // Check immediately and then every 60 seconds
    checkHealth();
    const interval = setInterval(checkHealth, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    navigate('/system/api-monitoring');
  };

  const config = {
    online: {
      icon: Wifi,
      text: "En ligne",
      variant: "secondary" as const,
      className: "text-green-600 border-green-200"
    },
    degraded: {
      icon: AlertTriangle,
      text: "Dégradé",
      variant: "outline" as const,
      className: "text-yellow-600 border-yellow-200"
    },
    offline: {
      icon: WifiOff,
      text: "Hors ligne",
      variant: "destructive" as const,
      className: "text-red-600"
    }
  };

  const current = config[state];
  const Icon = current.icon;

  return (
    <Badge
      variant={current.variant}
      className={`cursor-pointer hover:opacity-80 transition-opacity ${current.className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`État du système: ${current.text}. Cliquer pour voir les détails.`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {current.text}
    </Badge>
  );
}