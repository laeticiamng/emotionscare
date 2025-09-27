import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Sparkles, Star } from "lucide-react"

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  isPremium?: boolean
  premiumBadge?: string
  gradient?: 'purple' | 'blue' | 'gold' | 'rainbow'
  sparkles?: boolean
  glowEffect?: boolean
}

const gradients = {
  purple: "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600",
  blue: "bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600", 
  gold: "bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600",
  rainbow: "bg-gradient-to-br from-purple-400 via-pink-400 via-red-400 via-orange-400 via-yellow-400 to-green-400"
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    title,
    description,
    isPremium = false,
    premiumBadge = "Premium",
    gradient = "purple",
    sparkles = false,
    glowEffect = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "relative group",
          glowEffect && "before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
          className
        )}
        {...props}
      >
        {glowEffect && (
          <div className="absolute inset-[2px] bg-background rounded-lg" />
        )}
        
        <Card className={cn(
          "relative overflow-hidden border-2 transition-all duration-300",
          isPremium && "border-purple-200 dark:border-purple-800",
          isPremium && glowEffect && "hover:shadow-lg hover:shadow-purple-500/20"
        )}>
          {/* Background gradient overlay for premium cards */}
          {isPremium && (
            <div className={cn(
              "absolute inset-0 opacity-5",
              gradients[gradient]
            )} />
          )}
          
          {/* Sparkles animation */}
          {sparkles && isPremium && (
            <div className="absolute inset-0 overflow-hidden">
              <Sparkles className="absolute top-2 right-2 h-4 w-4 text-purple-400 animate-pulse" />
              <Star className="absolute top-4 left-4 h-3 w-3 text-pink-400 animate-pulse delay-100" />
              <Sparkles className="absolute bottom-4 right-8 h-3 w-3 text-purple-300 animate-pulse delay-200" />
            </div>
          )}

          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                {title && <CardTitle className="flex items-center gap-2">
                  {isPremium && <Crown className="h-5 w-5 text-purple-500" />}
                  {title}
                </CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
              {isPremium && (
                <Badge variant="secondary" className={cn(
                  "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
                  gradients[gradient].replace('bg-gradient-to-br', 'bg-gradient-to-r')
                )}>
                  {premiumBadge}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative">
            {children}
          </CardContent>
        </Card>
      </div>
    )
  }
)

PremiumCard.displayName = "PremiumCard"

export { PremiumCard }