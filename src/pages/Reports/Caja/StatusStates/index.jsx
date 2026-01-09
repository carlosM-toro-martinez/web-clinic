// components/StatusStates.jsx
import React from "react";

export const LoadingState = () => (
  <div className="min-h-screen bg-background py-8">
    <div className="container">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Cargando datos de caja...
        </h2>
        <p className="text-text-subtle">Por favor, espera un momento.</p>
      </div>
    </div>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-background py-8">
    <div className="container">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Error al cargar los datos
        </h2>
        <p className="text-text-subtle mb-4">
          {error?.message || "Ocurrió un error inesperado"}
        </p>
        <button onClick={onRetry} className="btn-primary px-4 py-2 rounded-lg">
          Reintentar
        </button>
      </div>
    </div>
  </div>
);
