import React, { useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function AlertMessage({ message, type = "info", onClose }) {
  if (!message) return null;

  // Cierra automáticamente a los 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const styles = {
    success: "bg-green-100 border border-green-300 text-green-800 shadow-sm",
    error: "bg-red-100 border border-red-300 text-red-800 shadow-sm",
    info: "bg-blue-100 border border-blue-300 text-blue-800 shadow-sm",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${styles[type]}`}
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition"
      >
        ✕
      </button>
    </div>
  );
}
