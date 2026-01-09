// components/DateSelector.jsx
import React from "react";

const DateSelector = ({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  formatDate,
}) => {
  return (
    <div className="card mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-border bg-white px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Vista Preferida
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("day")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "day"
                    ? "bg-primary text-white"
                    : "border border-border text-text-primary hover:bg-surface-variant"
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "week"
                    ? "bg-primary text-white"
                    : "border border-border text-text-primary hover:bg-surface-variant"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "month"
                    ? "bg-primary text-white"
                    : "border border-border text-text-primary hover:bg-surface-variant"
                }`}
              >
                Mes
              </button>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-text-subtle">Fecha seleccionada:</div>
          <div className="text-lg font-semibold text-text-primary">
            {formatDate(selectedDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
