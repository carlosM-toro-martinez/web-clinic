import React, { useState, useContext } from "react";
import useApiMutation from "../../hocks/useApiMutation";
import specialtyAddService from "../../async/services/post/specialtyAddService";
import AlertMessage from "../common/AlertMessage";
import { MainContext } from "../../context/MainContext";

export default function FormSpecialties({ doctors }) {
  const { user } = useContext(MainContext);
  const { mutate, isPending, message, type, reset } =
    useApiMutation(specialtyAddService);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [fees, setFees] = useState([]); // Inicializar vacío
  const [schedules, setSchedules] = useState([]); // Inicializar vacío
  const [localError, setLocalError] = useState("");

  const handleAddFee = () => {
    setFees([...fees, { feeType: "INITIAL", amount: "", description: "" }]);
  };

  const handleFeeChange = (index, field, value) => {
    const updated = [...fees];
    updated[index][field] = value;
    setFees(updated);
  };

  const handleRemoveFee = (index) => {
    setFees(fees.filter((_, i) => i !== index));
  };

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        doctorId: doctors[0]?.id || "",
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "12:00",
      },
    ]);
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!name || !code || !description) {
      setLocalError("Por favor completa todos los campos de la especialidad.");
      return;
    }

    // Filtrar solo tarifas válidas (con monto y descripción)
    const validFees = fees.filter((f) => {
      const amount = parseFloat(f.amount);
      return !isNaN(amount) && amount > 0 && f.description.trim();
    });

    // Filtrar solo horarios válidos
    const validSchedules = schedules.filter(
      (s) => s.doctorId && s.startTime && s.endTime
    );

    // NO es obligatorio tener tarifas ni horarios
    // Solo enviamos los que estén completos

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      fees: validFees.map((f) => ({
        feeType: f.feeType,
        amount: parseFloat(f.amount),
        description: f.description.trim(),
      })),
      schedules: validSchedules.map((s) => ({
        doctorId: s.doctorId,
        dayOfWeek: Number(s.dayOfWeek),
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-8 p-6 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-6"
    >
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        Crear Especialidad Médica
      </h2>

      {/* Campos base */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2 text-[var(--color-text-secondary)]">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Pediatría"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-[var(--color-text-secondary)]">
            Código <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej: PEDI"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-[var(--color-text-secondary)]">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input w-full"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Atención médica para niños"
          required
        />
      </div>

      {/* Tarifas (Opcionales) */}
      <div className="border border-[var(--color-border)] rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Tarifas (Opcional)
          </h3>
          <button
            type="button"
            onClick={handleAddFee}
            className="text-[var(--color-primary)] text-sm font-medium hover:underline flex items-center gap-1"
          >
            + Agregar tarifa
          </button>
        </div>

        {fees.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No se han agregado tarifas. Puedes agregarlas después.
          </p>
        ) : (
          fees.map((fee, index) => (
            <div
              key={index}
              className="p-4 mb-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-3"
            >
              <div className="grid md:grid-cols-3 gap-3">
                <select
                  className="input"
                  value={fee.feeType}
                  onChange={(e) =>
                    handleFeeChange(index, "feeType", e.target.value)
                  }
                >
                  <option value="INITIAL">Inicial</option>
                  <option value="FOLLOW_UP">Control</option>
                </select>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="Monto"
                  value={fee.amount}
                  onChange={(e) =>
                    handleFeeChange(index, "amount", e.target.value)
                  }
                />

                <input
                  type="text"
                  className="input"
                  placeholder="Descripción"
                  value={fee.description}
                  onChange={(e) =>
                    handleFeeChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveFee(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Eliminar tarifa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Horarios (Opcionales) */}
      <div className="border border-[var(--color-border)] rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Horarios (Opcional)
          </h3>
          {doctors.length > 0 && (
            <button
              type="button"
              onClick={handleAddSchedule}
              className="text-[var(--color-primary)] text-sm font-medium hover:underline flex items-center gap-1"
            >
              + Agregar horario
            </button>
          )}
        </div>

        {doctors.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No hay doctores disponibles. Primero crea doctores para asignar
            horarios.
          </p>
        ) : schedules.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No se han agregado horarios. Puedes agregarlos después.
          </p>
        ) : (
          schedules.map((sch, index) => (
            <div
              key={index}
              className="p-4 mb-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] space-y-3"
            >
              <div className="grid md:grid-cols-5 gap-3">
                <select
                  className="input"
                  value={sch.doctorId}
                  onChange={(e) =>
                    handleScheduleChange(index, "doctorId", e.target.value)
                  }
                >
                  <option value="">Seleccionar doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.firstName} {d.lastName}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={sch.dayOfWeek}
                  onChange={(e) =>
                    handleScheduleChange(index, "dayOfWeek", e.target.value)
                  }
                >
                  <option value="1">Lunes</option>
                  <option value="2">Martes</option>
                  <option value="3">Miércoles</option>
                  <option value="4">Jueves</option>
                  <option value="5">Viernes</option>
                  <option value="6">Sábado</option>
                  <option value="0">Domingo</option>
                </select>

                <input
                  type="time"
                  className="input"
                  value={sch.startTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "startTime", e.target.value)
                  }
                />

                <input
                  type="time"
                  className="input"
                  value={sch.endTime}
                  onChange={(e) =>
                    handleScheduleChange(index, "endTime", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {localError && (
        <p className="text-sm text-red-500 text-center">{localError}</p>
      )}
      {message && (
        <AlertMessage message={message} type={type} onClose={reset} />
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary px-6 py-3 text-lg font-semibold rounded-xl"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary px-6 py-3 text-lg font-semibold rounded-xl"
        >
          {isPending ? "Guardando..." : "Crear Especialidad"}
        </button>
      </div>
    </form>
  );
}
