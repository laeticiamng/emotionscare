
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning:
          "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        info:
          "border-transparent bg-info-500 text-white hover:bg-info-600",
        error:
          "border-transparent bg-destructive text-white hover:bg-destructive-600",
        subtle:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        "success-subtle":
          "bg-success-50 text-success-700 border-success-100 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800/30",
        "warning-subtle":
          "bg-warning-50 text-warning-700 border-warning-100 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-800/30",
        "info-subtle":
          "bg-info-50 text-info-700 border-info-100 dark:bg-info-900/30 dark:text-info-300 dark:border-info-800/30",
        "error-subtle":
          "bg-destructive-50 text-destructive-700 border-destructive-100 dark:bg-destructive-900/30 dark:text-destructive-300 dark:border-destructive-800/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
