import { toast as sonnerToast } from 'sonner'
import { useCallback } from 'react'

export interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

export interface UseToastReturn {
  toast: (options: ToastOptions) => string
  success: (options: ToastOptions) => string
  error: (options: ToastOptions) => string
  warning: (options: ToastOptions) => string
  info: (options: ToastOptions) => string
  dismiss: (id?: string) => void
}

export function useToast(): UseToastReturn {
  const toast = useCallback((options: ToastOptions) => {
    const { variant = 'default', ...rest } = options
    
    switch (variant) {
      case 'success':
        return sonnerToast.success(options.title || options.description, rest)
      case 'destructive':
        return sonnerToast.error(options.title || options.description, rest)
      case 'warning':
        return sonnerToast.warning(options.title || options.description, rest)
      case 'info':
        return sonnerToast.info(options.title || options.description, rest)
      default:
        return sonnerToast(options.title || options.description, rest)
    }
  }, [])

  const success = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'success' })
  }, [toast])

  const error = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'destructive' })
  }, [toast])

  const warning = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'warning' })
  }, [toast])

  const info = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'info' })
  }, [toast])

  const dismiss = useCallback((id?: string) => {
    sonnerToast.dismiss(id)
  }, [])

  return { toast, success, error, warning, info, dismiss }
}

export const toast = (options: ToastOptions) => {
  const { variant = 'default', ...rest } = options
  
  switch (variant) {
    case 'success':
      return sonnerToast.success(options.title || options.description, rest)
    case 'destructive':
      return sonnerToast.error(options.title || options.description, rest)
    case 'warning':
      return sonnerToast.warning(options.title || options.description, rest)
    case 'info':
      return sonnerToast.info(options.title || options.description, rest)
    default:
      return sonnerToast(options.title || options.description, rest)
  }
}

export default useToast