import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApiMutation from "../../hocks/useApiMutation";
import cashMovementAddService from "../../async/services/post/cashMovementAddService";
import AlertMessage from "../common/AlertMessage";
import { MainContext } from "../../context/MainContext";

export default function FormMovementComponent({ cashRegisterId }) {
  const navigate = useNavigate();
  const { user, refetchCaja } = useContext(MainContext);
  const [localError, setLocalError] = useState("");

  const [form, setForm] = useState({
    type: "",
    amount: "",
    description: "",
  });

  const {
    mutate,
    isPending,
    message,
    type: messageType,
    reset,
    data,
  } = useApiMutation(cashMovementAddService, {
    onSuccess: (data) => {
      refetchCaja();
    },
  });

  useEffect(() => {
    if (data && data.ok) {
      navigate(`/caja`);
    }
  }, [data]);

  const validateForm = () => {
    if (!form.type || !form.amount || !form.description) {
      setLocalError("Por favor completa todos los campos obligatorios.");
      return false;
    }

    if (form.description.trim().length < 5) {
      setLocalError("La descripción debe tener al menos 5 caracteres.");
      return false;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setLocalError("El monto debe ser un número positivo mayor a cero.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validateForm()) return;

    mutate({
      userId: user?.id,
      cashRegisterId,
      type: form.type,
      amount: form.amount,
      description: form.description.trim(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-8 flex justify-center">
      <div className="w-full max-w-xl card">
        <header className="mb-6">
          <h2 className="text-3xl font-bold">Registrar Movimiento de Caja</h2>
          <p className="text-[var(--text-muted)] mt-1">
            Ingresa los detalles del ingreso o egreso.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[var(--text-secondary)] mb-2">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ej: Pago en efectivo por consulta"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-2">
              Monto (Bs)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                Bs
              </span>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-10 rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] mb-2">
              Tipo de Movimiento
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="INCOME">Ingreso</option>
              <option value="EXPENSE">Egreso</option>
            </select>
          </div>
          {message && (
            <AlertMessage
              message={message}
              type={messageType}
              onClose={reset}
            />
          )}
          {localError && (
            <p className="text-sm text-red-500 text-center mt-2">
              {localError}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer btn-primary w-full py-3 text-lg"
            >
              {isPending ? "Guardando..." : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
