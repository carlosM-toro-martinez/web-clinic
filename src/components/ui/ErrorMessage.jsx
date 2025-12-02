// src/components/ui/ErrorMessage.jsx
import React from "react";

const ErrorMessage = ({ error }) => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-2">
          Error al cargar los datos
        </h3>
        <p className="text-[color:var(--color-text-subtle)]">
          {error?.message || "Intenta recargar la página"}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
