// components/DayView.jsx
import React from "react";

const DayView = ({
  selectedDate,
  processedData,
  formatCurrency,
  formatDate,
}) => {
  return (
    <>
      {/* Estadísticas del día seleccionado */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          📊 Estadísticas del {formatDate(selectedDate)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-center">
              <div className="text-sm text-text-subtle mb-2">
                Ingresos del día
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(processedData?.selectedDateStats.income || 0)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <div className="text-sm text-text-subtle mb-2">
                Egresos del día
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(processedData?.selectedDateStats.expense || 0)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <div className="text-sm text-text-subtle mb-2">Saldo del día</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(
                  (processedData?.selectedDateStats.income || 0) -
                    (processedData?.selectedDateStats.expense || 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de movimientos del día */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">
            📝 Movimientos del {formatDate(selectedDate)}
          </h3>
          <div className="text-sm text-text-subtle">
            Total: {processedData?.selectedDateMovements.length || 0}{" "}
            movimientos
          </div>
        </div>

        {processedData?.selectedDateMovements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-variant">
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">
                    Hora
                  </th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">
                    Descripción
                  </th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">
                    Monto
                  </th>
                  <th className="text-left py-3 px-4 text-text-primary font-semibold">
                    Caja ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.selectedDateMovements.map((movement, index) => (
                  <tr
                    key={movement.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-white" : "bg-surface-variant"
                    }`}
                  >
                    <td className="py-3 px-4 text-text-secondary">
                      {new Date(movement.createdAt).toLocaleTimeString(
                        "es-ES",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          movement.type === "INCOME"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {movement.type === "INCOME"
                          ? "📥 Ingreso"
                          : "📤 Egreso"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-primary">
                      {movement.description || "Sin descripción"}
                    </td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        movement.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movement.type === "INCOME" ? "+" : "-"}{" "}
                      {formatCurrency(movement.amountNum)}
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-sm">
                      {movement.registerId.substring(0, 8)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-text-subtle">
              No hay movimientos para esta fecha
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DayView;
