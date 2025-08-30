import { Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AsyncState = {
  Loading: ({ message }: { message?: string } = {}) => (
    <div 
      role="status" 
      aria-live="polite" 
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-muted-foreground">
        {message || "On prépare le cocon…"}
      </p>
    </div>
  ),

  Empty: ({ children }: { children?: React.ReactNode }) => (
    <div 
      aria-live="polite" 
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">
        {children || "Rien à afficher pour l'instant."}
      </p>
    </div>
  ),

  Error: ({ onRetry, message }: { onRetry?: () => void; message?: string }) => (
    <div 
      aria-live="polite" 
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-foreground mb-4">
        {message || "Oups, ça coince — on réessaie."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      )}
    </div>
  ),

  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
};