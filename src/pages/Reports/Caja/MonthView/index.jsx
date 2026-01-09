// components/MonthView.jsx
import React from "react";

const MonthView = ({ monthlyStats, last6Months, formatCurrency }) => {
  return (
    <div className="card mb-8">
      <h3 className="text-lg font-bold text-text-primary mb-6">
        📅 Estadísticas por Mes
      </h3>

      <div className="mb-8">
        <h4 className="font-semibold text-text-primary mb-4">
          Últimos 6 meses
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {last6Months.map((month) => (
            <div
              key={month.monthKey}
              className="bg-surface-variant rounded-lg p-4"
            >
              <div className="text-sm font-medium text-text-primary mb-2">
                {month.monthName}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-text-subtle">Ingresos</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(month.income)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle">Egresos</div>
                  <div className="text-sm font-semibold text-red-600">
                    {formatCurrency(month.expense)}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-text-subtle">Saldo</div>
                  <div className="text-sm font-semibold text-primary">
                    {formatCurrency(month.income - month.expense)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-text-primary mb-4">
          Detalle por mes
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-variant">
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Mes
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Ingresos
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Egresos
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Saldo
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Movimientos
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((month, index) => (
                <tr
                  key={month.monthKey}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-white" : "bg-surface-variant"
                  }`}
                >
                  <td className="py-3 px-4 text-text-primary font-medium">
                    {month.monthName}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-medium">
                    {formatCurrency(month.income)}
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">
                    {formatCurrency(month.expense)}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium">
                    {formatCurrency(month.income - month.expense)}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {month.movements.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthView;
