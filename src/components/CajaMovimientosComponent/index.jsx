import React, { useState, useMemo } from "react";

export default function CajaMovimientosComponent({ movements }) {
  const [filter, setFilter] = useState("Todos");

  const now = new Date();
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const region = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const filteredMovements = useMemo(() => {
    if (filter === "Todos") return movements;
    if (filter === "Ingresos")
      return movements.filter((m) => m.type === "INCOME");
    if (filter === "Egresos")
      return movements.filter((m) => m.type === "EXPENSE");
    return movements;
  }, [filter, movements]);

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h3 className="text-xl font-bold">Movimientos</h3>

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
          <div className="bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-x px-4 py-2 shadow-sm">
            <p className="text-[var(--text-primary)] font-medium capitalize">
              {formattedDate}
            </p>
            <p className="text-[var(--text-muted)]">
              {formattedTime} · {region.replace("_", " ")}
            </p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="cursor-pointer text-xl px-4 py-4 rounded-lg border border-[var(--color-border)] bg-white text-[var(--text-primary)] shadow-sm hover:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
          >
            <option className="cursor-pointer" value="Todos">
              Todos
            </option>
            <option className="cursor-pointer" value="Ingresos">
              Ingresos
            </option>
            <option className="cursor-pointer" value="Egresos">
              Egresos
            </option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="table-head">
            <tr>
              <th className="p-4 text-sm font-semibold text-[var(--text-muted)]">
                Fecha y hora
              </th>
              <th className="p-4 text-sm font-semibold text-[var(--text-muted)]">
                Tipo
              </th>
              <th className="p-4 text-sm font-semibold text-[var(--text-muted)]">
                Descripción
              </th>
              <th className="p-4 text-sm font-semibold text-[var(--text-muted)] text-right">
                Monto
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.length > 0 ? (
              filteredMovements.map((m, i) => {
                const date = new Date(m.createdAt);
                const dateFormatted = date.toLocaleString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={i}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-background-soft)] transition"
                  >
                    <td className="p-4 text-[var(--text-primary)]">
                      {dateFormatted}
                    </td>
                    <td className="p-4">
                      {m.type === "INCOME" ? (
                        <span className="badge-income">Ingreso</span>
                      ) : (
                        <span className="badge-expense">Egreso</span>
                      )}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {m.description}
                    </td>
                    <td className="p-4 font-medium text-right">
                      Bs. {m.amount}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-[var(--text-muted)] italic"
                >
                  No hay movimientos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
