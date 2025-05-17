
import * as React from "react"

export type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  className?: string
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement<{
  altText: string
  onClick?: () => void
}>

export interface Toast extends ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
