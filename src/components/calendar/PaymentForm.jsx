import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../context/MainContext";

export default function PaymentForm({
  appointment,
  onSubmit,
  onCancel,
  isSubmitting,
  refetchAppointments,
}) {
  const { cajaResponse, user } = useContext(MainContext);

  const [reservationAmount, setReservationAmount] = useState(
    appointment.reservationAmount || ""
  );
  const [totalAmount, setTotalAmount] = useState(appointment.totalAmount || "");
  const [remainingAmount, setRemainingAmount] = useState(
    appointment.remainingAmount || ""
  );
  const [notes, setNotes] = useState(appointment.notes || "");
  const [error, setError] = useState("");

  useEffect(() => {
    const reserva = parseFloat(reservationAmount) || 0;
    const total = parseFloat(totalAmount) || 0;
    const remaining = total - reserva;
    setRemainingAmount(remaining > 0 ? remaining.toString() : "0");
  }, [reservationAmount, totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const reserva = parseFloat(reservationAmount) || 0;
    const total = parseFloat(totalAmount) || 0;

    if (reserva < 0 || total < 0) {
      setError("Los montos no pueden ser negativos");
      return;
    }

    if (reserva > total) {
      setError("El monto de reserva no puede ser mayor al total");
      return;
    }

    try {
      const updatePayload = {
        reservationAmount: reserva.toString(),
        totalAmount: total.toString(),
        remainingAmount: remainingAmount.toString(),
        notes: notes,
        id: appointment.id,
        cashRegisterId: cajaResponse?.data?.id,
        amount: reserva - (appointment.reservationAmount || 0),
        type: "INCOME",
        userId: user?.id,
      };

      await onSubmit(updatePayload);
      refetchAppointments();
      onCancel();
    } catch (err) {
      setError("Error al actualizar el pago");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
          Monto de reserva
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={reservationAmount}
          onChange={(e) => setReservationAmount(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
          placeholder="Monto de reserva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
          Monto total
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={totalAmount}
          readOnly
          onChange={(e) => setTotalAmount(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition  cursor-not-allowed"
          placeholder="Monto total"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
          Monto restante
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={remainingAmount}
          readOnly
          className="w-full rounded-lg border border-[var(--color-border)] bg-gray-100 px-4 py-2 text-[color:var(--color-text-primary)] cursor-not-allowed"
          placeholder="Monto restante"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--color-text-secondary)] mb-1">
          Notas
        </label>
        <textarea
          value={"Monto restante a pagar: " + remainingAmount}
          onChange={(e) => setNotes(e.target.value)}
          readOnly
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition"
          placeholder="Notas"
          rows="3"
        />
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 cursor-pointer rounded-lg bg-[var(--color-border)] text-[color:var(--color-text-primary)] font-semibold hover:bg-[var(--color-border)]/80 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 cursor-pointer rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 shadow-sm transition disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Actualizar pago"}
        </button>
      </div>
    </form>
  );
}
