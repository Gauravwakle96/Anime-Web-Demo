/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastProvider,
  ToastViewport,
} from "@radix-ui/react-toast";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface ShowToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  default: "bg-card text-card-foreground border-border",
  success:
    "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  error: "bg-destructive/15 text-destructive-foreground border-destructive/40",
  warning:
    "bg-amber-500/15 text-amber-200 border-amber-500/40",
  info: "bg-primary/15 text-primary-foreground border-primary/40",
};

let toastIdCounter = 0;

function generateId(): string {
  toastIdCounter += 1;
  return `toast-${toastIdCounter}-${Date.now().toString(36)}`;
}

export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (options: ShowToastOptions): string => {
      const id = generateId();
      const item: ToastItem = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "default",
        duration: options.duration,
        action: options.action,
      };
      setToasts((prev) => [...prev, item]);
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ showToast, dismissToast, dismissAll }),
    [showToast, dismissToast, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider duration={5000} swipeDirection="right">
        {children}
        <ToastViewport />
        {toasts.map((t) => (
          <Toast
            key={t.id}
            open
            onOpenChange={(open) => {
              if (!open) dismissToast(t.id);
            }}
            duration={t.duration}
            className={cnToast(t.variant)}
          >
            <div className="flex flex-col gap-1">
              {t.title && <ToastTitle className="text-sm font-semibold">{t.title}</ToastTitle>}
              {t.description && (
                <ToastDescription className="text-sm text-muted-foreground">
                  {t.description}
                </ToastDescription>
              )}
            </div>
            {t.action}
            <ToastClose
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ToastClose>
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
}

function cnToast(variant: ToastVariant = "default"): string {
  return [
    "group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all",
    variantClasses[variant],
  ].join(" ");
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function useShowToast() {
  const { showToast } = useToast();
  return showToast;
}

export { ToastViewport };