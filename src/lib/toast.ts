import { toast } from "sonner";

interface ApiResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Global Premium Toast Messaging Utility
 * Wraps Sonner to provide a unified success/error reporting structure
 * across the entire application.
 */
export const showToast = {
  /**
   * Displays a success toast notification
   */
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 3000,
    });
  },
  
  /**
   * Displays an error toast notification.
   * Can automatically parse raw strings, Error objects, or API error payloads.
   */
  error: (message: string, error?: any) => {
    let errorDescription = "";
    if (error) {
      if (typeof error === "string") {
        errorDescription = error;
      } else if (error instanceof Error) {
        errorDescription = error.message;
      } else if (error.message) {
        errorDescription = error.message;
      } else if (error.error) {
        errorDescription = error.error;
      } else {
        errorDescription = JSON.stringify(error);
      }
    }
    
    return toast.error(message, {
      description: errorDescription || undefined,
      duration: 4000,
    });
  },
  
  /**
   * Displays an informational toast notification
   */
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Displays a persistent loading spinner toast.
   * Returns a toast ID that can be dismissed or updated later.
   */
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },

  /**
   * Dismisses any active toast notification by ID, or all toasts if no ID is passed.
   */
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },

  /**
   * Wraps an asynchronous Promise and automatically updates the toast status
   * (Loading -> Success OR Loading -> Error) as it resolves.
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  /**
   * Automatically handles standard API response payloads containing { success, message, error }
   */
  api: (result: ApiResult, successFallback = "Operation completed successfully", errorFallback = "Something went wrong") => {
    if (result.success) {
      return toast.success(result.message || successFallback, {
        duration: 3000,
      });
    } else {
      return toast.error(result.error || result.message || errorFallback, {
        duration: 4500,
      });
    }
  }
};
