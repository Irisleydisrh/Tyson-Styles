import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

let toasts: Toast[] = [];
let setToastsFn: ((t: Toast[]) => void) | null = null;

export function toastContainer() {
  const [toastList, setToasts] = useState<Toast[]>([]);
  
  useEffect(() => {
    setToastsFn = setToasts;
    return () => { setToastsFn = null; };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/15 border-green-500/30",
          icon: "text-green-500",
          title: "text-green-400",
          desc: "text-green-300/80"
        };
      case "error":
        return {
          bg: "bg-red-500/15 border-red-500/30",
          icon: "text-red-500", 
          title: "text-red-400",
          desc: "text-red-300/80"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/15 border-yellow-500/30",
          icon: "text-yellow-500",
          title: "text-yellow-400", 
          desc: "text-yellow-300/80"
        };
      default:
        return {
          bg: "bg-primary/15 border-primary/30",
          icon: "text-primary",
          title: "text-primary",
          desc: "text-foreground/70"
        };
    }
  };

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5" />;
      case "error": return <XCircle className="w-5 h-5" />;
      case "warning": return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toastList.map((toast) => {
          const styles = getStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm shadow-xl max-w-sm ${styles.bg}`}
            >
              <span className={styles.icon}>{getIcon(toast.type)}</span>
              <div className="flex-1">
                <p className={`font-semibold ${styles.title}`}>{toast.title}</p>
                {toast.description && (
                  <p className={`text-sm mt-0.5 ${styles.desc}`}>{toast.description}</p>
                )}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export const toast = {
  success: (title: string, description?: string) => {
    const id = Date.now().toString();
    if (setToastsFn) {
      setToastsFn(prev => [...prev, { id, type: "success", title, description }]);
      setTimeout(() => setToastsFn?.(prev => prev.filter(t => t.id !== id)), 4000);
    }
  },
  error: (title: string, description?: string) => {
    const id = Date.now().toString();
    if (setToastsFn) {
      setToastsFn(prev => [...prev, { id, type: "error", title, description }]);
      setTimeout(() => setToastsFn?.(prev => prev.filter(t => t.id !== id)), 5000);
    }
  },
  warning: (title: string, description?: string) => {
    const id = Date.now().toString();
    if (setToastsFn) {
      setToastsFn(prev => [...prev, { id, type: "warning", title, description }]);
      setTimeout(() => setToastsFn?.(prev => prev.filter(t => t.id !== id)), 4000);
    }
  },
  info: (title: string, description?: string) => {
    const id = Date.now().toString();
    if (setToastsFn) {
      setToastsFn(prev => [...prev, { id, type: "info", title, description }]);
      setTimeout(() => setToastsFn?.(prev => prev.filter(t => t.id !== id)), 4000);
    }
  }
};