"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import GlowButton from "./GlowButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function Modal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-full p-6"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-alert" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-royal text-lg">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mt-2">{message}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <GlowButton variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </GlowButton>
                <GlowButton
                  variant="primary"
                  size="sm"
                  onClick={onConfirm}
                  disabled={loading}
                  className="!bg-alert hover:!bg-red-600 text-white shadow-none"
                >
                  {loading ? "Deleting…" : "Delete"}
                </GlowButton>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
