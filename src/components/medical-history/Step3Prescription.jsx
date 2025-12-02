import React from "react";
import PrescriptionInput from "./PrescriptionInput";

const Step3Prescription = ({
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
}) => {
  return (
    <section>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Prescripciones / Receta
        </label>

        <PrescriptionInput onAdd={onAddPrescription} />

        <div className="mt-4 space-y-3">
          {prescriptions.map((prescription, index) => (
            <PrescriptionItem
              key={index}
              prescription={prescription}
              onRemove={() => onRemovePrescription(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const PrescriptionItem = ({ prescription, onRemove }) => (
  <div className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3">
    <div>
      <div className="font-medium">{prescription.medicationName}</div>
      <div className="text-sm text-[var(--text-muted)]">
        {prescription.dosage} • {prescription.frequency} •{" "}
        {prescription.duration}
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-[var(--color-error)]"
    >
      Eliminar
    </button>
  </div>
);

export default Step3Prescription;
