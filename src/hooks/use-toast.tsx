
import * as React from "react"
import { type Toast, type ToastContextType, type ToasterToast } from "./toast/toast-types"
import { ToastContext, ToastProvider } from "./toast/toast-context"
import { genId, dispatch } from "./toast/toast-state"

export { ToastProvider }

// Hook to use toast within React components
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}

// For backward compatibility and outside-of-component usage
export const toast = (props: Toast) => {
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
