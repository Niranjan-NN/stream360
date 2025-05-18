import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const getIconByVariant = (variant: ToastVariant) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-error-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary-500" />;
    default:
      return <Info className="h-5 w-5 text-primary-500" />;
  }
};

const getClassesByVariant = (variant: ToastVariant) => {
  switch (variant) {
    case 'success':
      return 'border-l-4 border-success-500 bg-success-50';
    case 'error':
      return 'border-l-4 border-error-500 bg-error-50';
    case 'info':
      return 'border-l-4 border-primary-500 bg-primary-50';
    default:
      return 'border-l-4 border-primary-500 bg-primary-50';
  }
};

const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
  title,
  description,
  variant = 'info',
  onClose,
}) => {
  return (
    <div
      className={`${getClassesByVariant(
        variant
      )} rounded-md shadow-lg p-4 flex items-start animate-fade-in transition-all duration-300 ease-in-out`}
    >
      <div className="flex-shrink-0 mr-3 pt-0.5">{getIconByVariant(variant)}</div>
      <div className="flex-1 ml-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 h-5 w-5 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ToastProvider;