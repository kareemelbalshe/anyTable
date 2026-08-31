import React, { useEffect } from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm any-table-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div
          className={`mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
            type === "danger"
              ? "bg-rose-500/10 text-rose-500"
              : type === "warning"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-blue-500/10 text-blue-500"
          }`}
        >
          {type === "danger" ? "⚠️" : type === "warning" ? "⚡" : "ℹ️"}
        </div>

        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${
              type === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                : "bg-primary hover:bg-primary-soft shadow-primary/30"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
