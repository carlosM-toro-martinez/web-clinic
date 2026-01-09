// components/WeekView.jsx
import React from "react";

const WeekView = ({ weeklyStats, last7Weeks, formatCurrency }) => {
  return (
    <div className="card mb-8">
      <h3 className="text-lg font-bold text-text-primary mb-6">
        📅 Estadísticas por Semana
      </h3>

      <div className="mb-8">
        <h4 className="font-semibold text-text-primary mb-4">
          Últimas 7 semanas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
          {last7Weeks.map((week) => (
            <div
              key={week.weekKey}
              className="bg-surface-variant rounded-lg p-4"
            >
              <div className="text-sm font-medium text-text-primary mb-2">
                Semana {week.weekNumber}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-text-subtle">Ingresos</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatCurrency(week.income)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-subtle">Egresos</div>
                  <div className="text-sm font-semibold text-red-600">
                    {formatCurrency(week.expense)}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-text-subtle">Saldo</div>
                  <div className="text-sm font-semibold text-primary">
                    {formatCurrency(week.income - week.expense)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-text-primary mb-4">
          Detalle por semana
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-variant">
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Semana
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
              {weeklyStats.map((week, index) => (
                <tr
                  key={week.weekKey}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-white" : "bg-surface-variant"
                  }`}
                >
                  <td className="py-3 px-4 text-text-primary font-medium">
                    Semana {week.weekNumber}, {week.year}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-medium">
                    {formatCurrency(week.income)}
                  </td>
                  <td className="py-3 px-4 text-red-600 font-medium">
                    {formatCurrency(week.expense)}
                  </td>
                  <td className="py-3 px-4 text-primary font-medium">
                    {formatCurrency(week.income - week.expense)}
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {week.movements.length}
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

export default WeekView;
