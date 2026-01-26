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
      {/* <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          👁️ Nota Objetiva / Examen Físico
        </label>
        <textarea
          rows="4"
          value={objectiveNote}
          onChange={(e) => onObjectiveNoteChange(e.target.value)}
          placeholder="Hallazgos del examen físico, sistemas afectados..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
        />
      </div> */}

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
