// src/components/dashboard/cash-register/RecentMovements.jsx
import React from "react";

const RecentMovements = ({ movements = [] }) => {
  const recentMovements = movements.slice(0, 5);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">
        🔄 Movimientos Recientes
      </h3>

      <div className="space-y-3">
        {recentMovements.length === 0 ? (
          <div className="text-center py-4 text-[color:var(--color-text-subtle)]">
            No hay movimientos recientes
          </div>
        ) : (
          recentMovements.map((movement) => (
            <MovementItem key={movement.id} movement={movement} />
          ))
        )}
      </div>
    </div>
  );
};

const MovementItem = ({ movement }) => {
  const isIncome = movement.type === "INCOME";
  const time = new Date(movement.createdAt).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-variant)] transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isIncome ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span className={isIncome ? "text-green-600" : "text-red-600"}>
            {isIncome ? "↑" : "↓"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[color:var(--color-text-primary)] truncate text-sm">
            {movement.description}
          </p>
          <p className="text-xs text-[color:var(--color-text-subtle)]">
            {time}
          </p>
        </div>
      </div>
      <div
        className={`font-semibold text-sm ${
          isIncome ? "text-green-600" : "text-red-600"
        }`}
      >
        {isIncome ? "+" : "-"}
        {movement.amount} BOB
      </div>
    </div>
  );
};

export default RecentMovements;
