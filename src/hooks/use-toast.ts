import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    return {
      toast: (props: ToastProps) => {
        console.log("Toast:", props)
      }
    }
  }
  return context
}

export const toast = (props: ToastProps) => {
  console.log("Toast:", props)
}