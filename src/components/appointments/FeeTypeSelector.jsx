import React from "react";

const FeeTypeSelector = ({ selectedSpecialty, selectedFee, onFeeSelect }) => {
  if (!selectedSpecialty) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
        Tipo de consulta
      </label>
      <div className="flex gap-3 flex-wrap">
        {selectedSpecialty.fees.map((fee) => (
          <button
            key={fee.id}
            type="button"
            onClick={() => onFeeSelect(fee)}
            className={`px-4 py-2 rounded-xl border transition cursor-pointer ${
              selectedFee?.id === fee.id
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]"
            }`}
          >
            {fee.feeType === "INITIAL" ? "Inicial" : "Control"} — {fee.amount}{" "}
            Bs
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeeTypeSelector;
