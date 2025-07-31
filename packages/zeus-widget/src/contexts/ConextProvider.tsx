import { createContext, use, useMemo, useRef } from "react";

interface ContextValue {
  onError: (error: Error) => void;
  onSuccess: (message: string) => void;
}

const Context = createContext<ContextValue | null>(null);

interface ContextProviderProps extends Partial<ContextValue> {
  children: React.ReactNode;
}

export default function ContextProvider({
  children,
  onError,
  onSuccess,
}: ContextProviderProps) {
  const handlersRef = useRef({ onError, onSuccess });
  handlersRef.current = { onError, onSuccess };

  return (
    <Context
      value={useMemo(
        () => ({
          onError: (...args) => handlersRef.current.onError?.(...args),
          onSuccess: (...args) => handlersRef.current.onSuccess?.(...args),
        }),
        []
      )}
    >
      {children}
    </Context>
  );
}

export const useErrorHandler = () => {
  const context = use(Context);
  if (!context) {
    throw new Error("useErrorHandler must be used within a ContextProvider");
  }
  return context.onError;
};

export const useSuccessHandler = () => {
  const context = use(Context);
  if (!context) {
    throw new Error("useSuccessHandler must be used within a ContextProvider");
  }
  return context.onSuccess;
};
