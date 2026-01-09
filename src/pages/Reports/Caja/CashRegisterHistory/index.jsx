// components/CashRegisterHistory.jsx
import React from "react";

const CashRegisterHistory = ({ cashRegisters, formatCurrency }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-text-primary mb-6">
        🏦 Historial de Cierres de Caja
      </h3>

      {cashRegisters.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-variant">
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Estado
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Apertura
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Cierre
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Monto Apertura
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Monto Cierre
                </th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold">
                  Diferencia
                </th>
              </tr>
            </thead>
            <tbody>
              {cashRegisters.map((register, index) => (
                <tr
                  key={register.id}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-white" : "bg-surface-variant"
                  }`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        register.status === "OPEN"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {register.status === "OPEN" ? "🔓 Abierta" : "🔐 Cerrada"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-primary">
                    {new Date(register.openedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="py-3 px-4 text-text-primary">
                    {register.closedAt
                      ? new Date(register.closedAt).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-text-primary font-medium">
                    {formatCurrency(parseFloat(register.openingAmount) || 0)}
                  </td>
                  <td className="py-3 px-4 text-text-primary font-medium">
                    {register.closingAmount
                      ? formatCurrency(parseFloat(register.closingAmount) || 0)
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-medium ${
                        parseFloat(register.difference || 0) === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(
                        parseFloat(
                          register.closingAmount - register.openingAmount || 0
                        )
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-text-subtle">No hay registros de caja</p>
        </div>
      )}
    </div>
  );
};

export default CashRegisterHistory;
