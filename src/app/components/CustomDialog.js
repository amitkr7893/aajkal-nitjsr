"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function CustomDialog({ message, onClose }) {
  // Close dialog on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 text-white rounded-xl shadow-lg p-6 w-80 pt-8 text-center border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-zinc-300 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Message */}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
