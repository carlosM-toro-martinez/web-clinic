import React, { useState } from "react";

// Montos siempre con 2 decimales (evita 454.95000000000005 y pérdida de centavos)
const money = (value) => (Number(value) || 0).toFixed(2);

export default function CajaResumenComponent({ lastCash }) {
  const [activeTab, setActiveTab] = useState("caja");

  const ingresos =
    lastCash?.movements
      ?.filter((m) => m.type === "INCOME")
      ?.reduce((acc, m) => acc + parseFloat(m.amount), 0) || 0;

  const egresos =
    lastCash?.movements
      ?.filter((m) => m.type === "EXPENSE")
      ?.reduce((acc, m) => acc + parseFloat(m.amount), 0) || 0;

  const balance = ingresos - egresos;

  return (
    <>
      <div className="border-b border-[var(--color-border)] mb-8">
        <nav className="flex gap-8 -mb-px">
          <button
            onClick={() => setActiveTab("caja")}
            className={`cursor-pointer py-4 px-1 border-b-2 ${
              activeTab === "caja"
                ? "border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            Caja Actual
          </button>
          <button
            onClick={() => setActiveTab("movimientos")}
            className={`cursor-pointer py-4 px-1 border-b-2 ${
              activeTab === "movimientos"
                ? "border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            Ingresos y Egresos
          </button>
        </nav>
      </div>
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4">Resumen</h3>

        {activeTab === "caja" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">
                Monto actual
              </p>
              <p className="text-3xl font-bold text-green-500">
                Bs{money(lastCash?.actualAmount)}
              </p>
            </div>
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">
                Monto de apertura
              </p>
              <p className="text-3xl font-bold text-red-500">
                Bs{money(lastCash?.openingAmount)}
              </p>
            </div>
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">
                Diferencia
              </p>
              <p className="text-3xl font-bold">
                Bs{money(Number(lastCash?.actualAmount || 0) - Number(lastCash?.openingAmount || 0))}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">
                Ingresos
              </p>
              <p className="text-3xl font-bold text-green-500">Bs{money(ingresos)}</p>
            </div>
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">Egresos</p>
              <p className="text-3xl font-bold text-red-500">Bs{money(egresos)}</p>
            </div>
            <div className="card">
              <p className="text-base text-[var(--text-muted)] mb-2">Balance</p>
              <p
                className={`text-3xl font-bold ${
                  balance >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                Bs{money(balance)}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
