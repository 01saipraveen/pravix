import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default: return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border flex items-center justify-between shadow-2xl pointer-events-auto backdrop-blur-md ${
                toast.type === 'success' ? 'bg-slate-900/90 text-emerald-100 border-emerald-500/30' :
                toast.type === 'warning' ? 'bg-slate-900/90 text-amber-100 border-amber-500/30' :
                toast.type === 'error' ? 'bg-slate-900/90 text-rose-100 border-rose-500/30' :
                'bg-slate-900/90 text-sky-100 border-sky-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {getIcon(toast.type)}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors ml-4 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
