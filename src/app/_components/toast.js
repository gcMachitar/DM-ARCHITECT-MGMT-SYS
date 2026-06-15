'use client';

import { useState, useEffect } from 'react';

export function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message: e.detail.message, type: e.detail.type || 'info' };
      
      setToasts((prev) => [...prev, newToast]);

      if (e.detail.type !== 'error') {
        setTimeout(() => {
          removeToast(id);
        }, 4000);
      }
    };

    window.addEventListener('dm-toast', handleToast);
    return () => window.removeEventListener('dm-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-4 rounded-md p-4 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-right-8 fade-in ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-900 border border-red-200'
              : toast.type === 'success'
              ? 'bg-green-50 text-green-900 border border-green-200'
              : 'bg-white text-olive-900 border border-lime-900/10'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
