"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type FillHandler = () => void;

type DebugInvoiceFillContextValue = {
  canFill: boolean;
  registerFillHandler: (handler: FillHandler | null) => void;
  triggerDummyFill: () => void;
};

const DebugInvoiceFillContext =
  createContext<DebugInvoiceFillContextValue | null>(null);

export function DebugInvoiceFillProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const handlerRef = useRef<FillHandler | null>(null);
  const [canFill, setCanFill] = useState(false);

  const registerFillHandler = useCallback((handler: FillHandler | null) => {
    handlerRef.current = handler;
    setCanFill(Boolean(handler));
  }, []);

  const triggerDummyFill = useCallback(() => {
    handlerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({ canFill, registerFillHandler, triggerDummyFill }),
    [canFill, registerFillHandler, triggerDummyFill],
  );

  return (
    <DebugInvoiceFillContext.Provider value={value}>
      {children}
    </DebugInvoiceFillContext.Provider>
  );
}

export function useDebugInvoiceFill() {
  const context = useContext(DebugInvoiceFillContext);
  if (!context) {
    throw new Error(
      "useDebugInvoiceFill must be used within DebugInvoiceFillProvider",
    );
  }
  return context;
}
