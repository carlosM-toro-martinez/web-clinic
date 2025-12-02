import React from "react";

const ReservationAmountInput = ({
  selectedFee,
  reservationAmount,
  onAmountChange,
}) => {
  if (!selectedFee) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
        Monto de reserva (mínimo 50%)
      </label>
      <input
        type="number"
        min={selectedFee.amount / 2}
        step="0.01"
        value={reservationAmount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="input w-full"
        placeholder={`Mínimo ${selectedFee.amount / 2} Bs`}
      />
      <p className="text-sm mt-2 text-[var(--text-muted)]">
        Monto total: {selectedFee.amount} Bs — Restante:{" "}
        {reservationAmount
          ? selectedFee.amount - Number(reservationAmount)
          : selectedFee.amount}{" "}
        Bs
      </p>
    </div>
  );
};

export default ReservationAmountInput;
