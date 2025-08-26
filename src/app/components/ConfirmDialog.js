"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  // Close dialog on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  if (!message) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="relative bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-80 pt-8 text-center border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-white hover:text-zinc-300 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Message */}
        <p className="text-sm font-medium mb-4">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-zinc-700 hover:opacity-90 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:opacity-90 transition-colors text-sm font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
