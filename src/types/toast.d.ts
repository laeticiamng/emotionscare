
import * as React from "react"

export type ToastProps = {
  id?: string
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  onOpenChange?: (open: boolean) => void
}

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface ToastActionElement extends React.ReactElement {
  altText?: string
  onClick?: () => void
}
