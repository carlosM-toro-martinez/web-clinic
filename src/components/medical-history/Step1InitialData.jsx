import React from "react";

const Step1InitialData = ({
  patient,
  specialtyId,
  doctorId,
  initialNote,
  onInitialNoteChange,
}) => {
  return (
    <section>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
        Paciente
      </label>

      <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
        <div>
          <div className="font-medium">
            {patient.firstName} {patient.lastName}
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            CI: {patient.ciNumber} • {patient.phone}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Nota inicial
        </label>
        <textarea
          rows="3"
          value={initialNote}
          onChange={(e) => onInitialNoteChange(e.target.value)}
          placeholder="Observaciones iniciales / motivo de derivación..."
          className="input"
        />
      </div>

      {/* <div className="mt-3 text-sm text-[var(--text-muted)]">
        <strong>Especialidad:</strong> {specialtyId || "No proporcionada"}
      </div>
      <div className="mt-1 text-sm text-[var(--text-muted)]">
        <strong>Registrado por (doctorId):</strong>{" "}
        {doctorId || "No proporcionado"}
      </div> */}
    </section>
  );
};

export default Step1InitialData;
