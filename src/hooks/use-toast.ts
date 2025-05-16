
import * as React from 'react';
import { toast as sonnerToast } from 'sonner';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      const existingToastId = state.toasts.findIndex((toast) => toast.id === action.toast.id);
      
      if (existingToastId !== -1) {
        // Clone the current state
        const newState = {
          ...state,
          toasts: [...state.toasts],
        };
        
        // Update the existing toast
        newState.toasts[existingToastId] = {
          ...newState.toasts[existingToastId],
          ...action.toast,
        };
        
        return newState;
      }

      // Add a new toast
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    }
    case actionTypes.UPDATE_TOAST: {
      // Clone the state
      const newState = {
        ...state,
        toasts: [...state.toasts],
      };
      
      const { id, ...updatedToast } = action.toast;
      const index = state.toasts.findIndex((toast) => toast.id === id);
      
      if (index !== -1) {
        newState.toasts[index] = {
          ...newState.toasts[index],
          ...updatedToast,
        };
      }
      
      return newState;
    }
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      const existingId = toastId || state.toasts[0]?.id;
      
      // Create a timeout to remove the toast
      if (existingId) {
        if (toastTimeouts.has(existingId)) {
          clearTimeout(toastTimeouts.get(existingId));
        }
        
        toastTimeouts.set(
          existingId,
          setTimeout(() => {
            // Dispatch remove toast
          }, TOAST_REMOVE_DELAY)
        );
        
        return {
          ...state,
          toasts: state.toasts.map((toast) =>
            toast.id === existingId
              ? {
                  ...toast,
                  // dismissed: true,
                }
              : toast
          ),
        };
      }
      return state;
    }
    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;
      
      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          clearTimeout(toastTimeouts.get(toastId));
          toastTimeouts.delete(toastId);
        }
        
        return {
          ...state,
          toasts: state.toasts.filter((toast) => toast.id !== toastId),
        };
      }
      return {
        ...state,
        toasts: [],
      };
    }
    default:
      return state;
  }
};

export const useToast = () => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toast = React.useMemo(
    () => ({
      ...state,
      toast: (props: Omit<ToasterToast, "id">) => {
        const id = genId();

        // Utilisons sonner pour afficher le toast
        sonnerToast[props.variant || "default"](props.title, {
          description: props.description,
          id,
        });

        // Pour la compatibilité avec les implémentations existantes
        dispatch({
          type: actionTypes.ADD_TOAST,
          toast: {
            ...props,
            id,
          },
        });

        return id;
      },
      dismiss: (toastId: string) => {
        dispatch({
          type: actionTypes.DISMISS_TOAST,
          toastId,
        });
      },
      remove: (toastId: string) => {
        dispatch({
          type: actionTypes.REMOVE_TOAST,
          toastId,
        });
      },
      error: (props: Omit<ToasterToast, "id" | "variant">) => {
        toast.toast({ ...props, variant: "destructive" });
      },
      success: (props: Omit<ToasterToast, "id" | "variant">) => {
        toast.toast({ ...props, variant: "success" });
      },
      warning: (props: Omit<ToasterToast, "id" | "variant">) => {
        toast.toast({ ...props, variant: "warning" });
      },
      info: (props: Omit<ToasterToast, "id" | "variant">) => {
        toast.toast({ ...props, variant: "info" });
      },
    }),
    [state, dispatch]
  );

  return toast;
};

// Version plus simple pour des appels directs
export const toast = (props: Omit<ToasterToast, "id">) => {
  // Utiliser directement sonner pour les toasts
  return sonnerToast[props.variant || "default"](props.title, {
    description: props.description,
  });
};

// Ajout des méthodes pour les différents types de toasts
toast.error = (props: ToasterToast | string) => {
  if (typeof props === 'string') {
    return sonnerToast.error(props);
  }
  return sonnerToast.error(props.title, {
    description: props.description,
    id: props.id
  });
};

toast.success = (props: ToasterToast | string) => {
  if (typeof props === 'string') {
    return sonnerToast.success(props);
  }
  return sonnerToast.success(props.title, {
    description: props.description,
    id: props.id
  });
};

toast.info = (props: ToasterToast | string) => {
  if (typeof props === 'string') {
    return sonnerToast.info(props);
  }
  return sonnerToast.info(props.title, {
    description: props.description,
    id: props.id
  });
};

toast.warning = (props: ToasterToast | string) => {
  if (typeof props === 'string') {
    return sonnerToast.warning(props);
  }
  return sonnerToast.warning(props.title, {
    description: props.description,
    id: props.id
  });
};

toast.dismiss = sonnerToast.dismiss;
toast.toast = sonnerToast;

// Type de retour pour la fonction de toast
export type Toast = typeof toast;
