import React from "react";

const SummaryCards = ({ processedData, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-subtle mb-1">
              Ingresos Totales
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(processedData?.totalIncome || 0)}
            </div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <span className="text-green-600 text-xl">📈</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-subtle mb-1">Egresos Totales</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(processedData?.totalExpense || 0)}
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <span className="text-red-600 text-xl">📉</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-subtle mb-1">Saldo Neto</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(processedData?.netBalance || 0)}
            </div>
          </div>
          <div className="w-12 h-12 bg-accent-blue-light rounded-xl flex items-center justify-center">
            <span className="text-primary text-xl">💰</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-subtle mb-1">Cajas Activas</div>
            <div className="text-2xl font-bold text-amber-600">
              {processedData?.openRegisters || 0}
              <span className="text-sm text-text-subtle ml-2">
                / {processedData?.cashRegistersCount || 0}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <span className="text-amber-600 text-xl">🏦</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
