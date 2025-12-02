// src/components/dashboard/cash-register/CashRegisterSummary.jsx
import React from "react";

const CashRegisterSummary = ({ data }) => {
  if (!data?.data) return null;

  const { openingAmount, actualAmount, status, movements = [] } = data.data;

  const totalIncome = movements
    .filter((m) => m.type === "INCOME")
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  const totalExpenses = movements
    .filter((m) => m.type === "EXPENSE")
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  const isOpen = status === "OPEN";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          💰 Estado de Caja
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOpen ? "Abierta" : "Cerrada"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {actualAmount} BOB
            </div>
            <div className="text-sm text-blue-800 mt-1">Saldo Actual</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-700">
              {openingAmount} BOB
            </div>
            <div className="text-sm text-gray-600 mt-1">Apertura</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">Ingresos:</span>
            <span className="font-semibold text-green-600">
              +{totalIncome} BOB
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-red-600">Egresos:</span>
            <span className="font-semibold text-red-600">
              -{totalExpenses} BOB
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="pt-3 border-t border-[var(--color-border)]">
            <div className="text-center text-sm text-[color:var(--color-text-subtle)]">
              Caja abierta desde{" "}
              {new Date(data.data.openedAt).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashRegisterSummary;
