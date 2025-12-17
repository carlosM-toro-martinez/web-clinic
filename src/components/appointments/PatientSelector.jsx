import React from "react";

const PatientSelector = ({
  formState,
  updateFormState,
  filteredPatients,
  onOpenModal,
}) => {
  const { selectedPatient, searchTerm } = formState;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Paciente
        </label>
        {!selectedPatient && (
          <button
            type="button"
            onClick={onOpenModal}
            className="text-sm cursor-pointer bg-[var(--color-primary)] text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            + Nuevo Paciente
          </button>
        )}
      </div>

      {!selectedPatient ? (
        <PatientSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => updateFormState({ searchTerm: value })}
          filteredPatients={filteredPatients}
          onSelectPatient={(patient) =>
            updateFormState({ selectedPatient: patient })
          }
        />
      ) : (
        <SelectedPatient
          patient={selectedPatient}
          onClear={() => updateFormState({ selectedPatient: null })}
        />
      )}
    </div>
  );
};

const PatientSearch = ({
  searchTerm,
  onSearchChange,
  filteredPatients,
  onSelectPatient,
}) => (
  <>
    <input
      type="text"
      placeholder="Buscar por nombre o CI..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="input w-full"
    />
    {searchTerm.length > 0 && (
      <div className="border border-[var(--color-border)] mt-2 rounded-xl bg-[var(--color-surface)] max-h-48 overflow-y-auto">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className="px-4 py-2 cursor-pointer hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition"
            >
              {p.firstName} {p.lastName} — CI: {p.ciNumber}
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-[var(--text-muted)] py-2">
            No se encontraron pacientes.
          </p>
        )}
      </div>
    )}
  </>
);

const SelectedPatient = ({ patient, onClear }) => (
  <div className="flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
    <span>
      {patient.firstName} {patient.lastName} — CI: {patient.ciNumber}
    </span>
    <button
      type="button"
      onClick={onClear}
      className="text-[var(--color-primary)] text-sm font-medium hover:underline cursor-pointer"
    >
      Cambiar
    </button>
  </div>
);

export default PatientSelector;
