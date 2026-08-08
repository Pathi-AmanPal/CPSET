"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error";
  message: string;
}

let toastListener: ((toast: ToastData) => void) | null = null;

export function showToast(type: "success" | "error", message: string) {
  const toast: ToastData = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    type,
    message,
  };
  toastListener?.(toast);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`glass-strong rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg ${
              toast.type === "success"
                ? "border-l-2 border-l-green-500"
                : "border-l-2 border-l-alert"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-alert shrink-0" />
            )}
            <p className="text-sm text-body flex-1">{toast.message}</p>
            <button
              onClick={() =>
                setToasts((prev) =>
                  prev.filter((t) => t.id !== toast.id)
                )
              }
              className="text-body/40 hover:text-body transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
