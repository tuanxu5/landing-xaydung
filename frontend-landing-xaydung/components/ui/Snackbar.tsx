'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarMessage {
  id: string;
  type: SnackbarType;
  message: string;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (type: SnackbarType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = useCallback((type: SnackbarType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newSnackbar: SnackbarMessage = { id, type, message, duration };
    
    setSnackbars((prev) => [...prev, newSnackbar]);

    if (duration > 0) {
      setTimeout(() => {
        removeSnackbar(id);
      }, duration);
    }
  }, []);

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showSnackbar('success', message, duration);
  }, [showSnackbar]);

  const error = useCallback((message: string, duration?: number) => {
    showSnackbar('error', message, duration);
  }, [showSnackbar]);

  const warning = useCallback((message: string, duration?: number) => {
    showSnackbar('warning', message, duration);
  }, [showSnackbar]);

  const info = useCallback((message: string, duration?: number) => {
    showSnackbar('info', message, duration);
  }, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, success, error, warning, info }}>
      {children}
      <SnackbarContainer snackbars={snackbars} onRemove={removeSnackbar} />
    </SnackbarContext.Provider>
  );
};

interface SnackbarContainerProps {
  snackbars: SnackbarMessage[];
  onRemove: (id: string) => void;
}

const SnackbarContainer: React.FC<SnackbarContainerProps> = ({ snackbars, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {snackbars.map((snackbar) => (
        <SnackbarItem key={snackbar.id} snackbar={snackbar} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface SnackbarItemProps {
  snackbar: SnackbarMessage;
  onRemove: (id: string) => void;
}

const SnackbarItem: React.FC<SnackbarItemProps> = ({ snackbar, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(snackbar.id);
    }, 300);
  };

  const config = {
    success: {
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    error: {
      icon: XCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
  };

  const { icon: Icon, iconBg, iconColor, borderColor } = config[snackbar.type];

  return (
    <div
      className={`
        pointer-events-auto
        min-w-[360px] max-w-md
        bg-white
        border-2 ${borderColor}
        rounded-2xl shadow-xl
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-[120%] opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
        hover:shadow-2xl
      `}
      style={{
        animation: isExiting ? undefined : 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Icon with colored background */}
        <div className={`flex-shrink-0 ${iconBg} rounded-xl p-2.5`}>
          <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 break-words">
            {snackbar.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-200"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(120%) scale(0.8);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SnackbarProvider;
