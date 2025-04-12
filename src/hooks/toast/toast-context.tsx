
import * as React from "react"
import { 
  type ToastContextType, 
  type ToastState, 
  type Toast, 
  type ToasterToast 
} from "./toast-types"
import { 
  memoryState, 
  listeners, 
  genId, 
  dispatch 
} from "./toast-state"

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  const toast = (props: Toast) => {
    const id = genId()

    const update = (props: ToasterToast) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss()
        },
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  const dismiss = (toastId?: string) => 
    dispatch({ type: "DISMISS_TOAST", toastId })

  const contextValue = {
    toasts: state.toasts,
    toast,
    dismiss,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}
