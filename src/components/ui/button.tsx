import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-enhanced",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-95",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-95",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: 
          "text-primary underline-offset-4 hover:underline focus-visible:ring-1",
        // Nouvelles variantes accessibles
        success:
          "bg-green-600 text-white shadow hover:bg-green-700 hover:shadow-md active:scale-95",
        warning:
          "bg-yellow-600 text-white shadow hover:bg-yellow-700 hover:shadow-md active:scale-95",
        info:
          "bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-md active:scale-95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
        xl: "h-12 rounded-lg px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Texte accessible pour les lecteurs d'écran */
  "aria-label"?: string
  /** Description accessible */
  "aria-describedby"?: string
  /** Indique si le bouton contrôle un élément développé */
  "aria-expanded"?: boolean
  /** Indique si le bouton est pressé (pour les boutons toggle) */
  "aria-pressed"?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, disabled, "aria-label": ariaLabel, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Amélioration automatique de l'accessibilité
    const enhancedProps = {
      ...props,
      // S'assurer que les boutons disabled ont un aria-label approprié
      "aria-label": disabled ? `${ariaLabel || props.title || ''} (désactivé)` : ariaLabel,
      // Ajouter type="button" par défaut pour éviter la soumission de formulaire
      type: props.type || "button",
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...enhancedProps}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }