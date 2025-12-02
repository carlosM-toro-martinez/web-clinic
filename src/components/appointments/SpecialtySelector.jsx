import React from "react";
import toTitleCase from "../../utils/toTitleCase";

function SpecialtySelector({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
}) {
  const validSpecialties = specialties.filter(
    (specialty) =>
      specialty.schedules &&
      specialty.schedules.length > 0 &&
      specialty.fees &&
      specialty.fees.length > 0
  );
  console.log(validSpecialties);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
        Especialidad
      </label>
      <select
        className="input w-full cursor-pointer"
        value={selectedSpecialty?.id || ""}
        onChange={onSpecialtyChange}
      >
        <option value="">Seleccionar especialidad...</option>
        {validSpecialties.length > 0 ? (
          validSpecialties.map((s) => (
            <option key={s.id} value={s.id}>
              {toTitleCase(s.name)}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No hay especialidades disponibles
          </option>
        )}
      </select>

      {validSpecialties.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] mt-2">
          No hay especialidades con horarios y tarifas configuradas.
        </p>
      )}
    </div>
  );
}

export default SpecialtySelector;
