import React from "react";
import ConsultationEntry from "./ConsultationEntry";

const SpecialtyHistory = ({
  specialtyHistory,
  activeEntry,
  setActiveEntry,
}) => {
  const { specialty, entries } = specialtyHistory;

  return (
    <div className="space-y-6">
      {/* Header de Especialidad */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              {specialty.name}
            </h2>
            {specialty.description && (
              <p className="text-text-subtle">{specialty.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-text-subtle">Total de consultas</div>
            <div className="text-2xl font-bold text-primary">
              {entries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Consultas */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <ConsultationEntry
            key={entry.id}
            entry={entry}
            isExpanded={activeEntry === entry.id}
            onToggle={() =>
              setActiveEntry(activeEntry === entry.id ? null : entry.id)
            }
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialtyHistory;
