import { Loader2, AlertCircle, CheckCircle, Wifi } from "lucide-react";
import { motion } from "framer-motion";

interface AsyncStateProps {
  message?: string;
  className?: string;
}

export const AsyncState = {
  Loading: ({ message = "Chargement...", className = "" }: AsyncStateProps) => (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      </div>
    </div>
  ),

  Complete: ({ message = "Terminé", className = "" }: AsyncStateProps) => (
    <motion.div 
      className={`flex items-center justify-center min-h-[200px] ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="h-8 w-8 text-green-500" />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      </div>
    </motion.div>
  ),

  Error: ({ message = "Une erreur s'est produite", className = "" }: AsyncStateProps) => (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground" aria-live="assertive">
          {message}
        </p>
      </div>
    </div>
  ),

  Void: ({ message = "Aucun élément trouvé", className = "" }: AsyncStateProps) => (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Wifi className="h-8 w-8 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      </div>
    </div>
  )
};