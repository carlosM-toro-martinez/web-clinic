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
        Monto de reserva
      </label>
      <input
        type="number"
        step="0.01"
        value={reservationAmount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="input w-full"
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
