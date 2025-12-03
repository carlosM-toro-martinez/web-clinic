import React, { useState } from "react";
import { DollarSign, Plus, X, Trash2 } from "lucide-react";

export default function FeeForm({
  onSubmit,
  isSubmitting,
  initialData = [],
  onCancel,
}) {
  // Inicializar con array de fees
  const [fees, setFees] = useState(
    initialData.length > 0
      ? initialData
      : [{ feeType: "INITIAL", amount: "", description: "" }]
  );

  const handleAddFee = () => {
    setFees([...fees, { feeType: "INITIAL", amount: "", description: "" }]);
  };

  const handleFeeChange = (index, field, value) => {
    const updated = [...fees];

    if (field === "amount") {
      // Validación de número
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      if (parts.length > 2) return;
      updated[index][field] = numericValue;
    } else {
      updated[index][field] = value;
    }

    setFees(updated);
  };

  const handleRemoveFee = (index) => {
    if (fees.length > 1) {
      setFees(fees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los fees
    const validFees = fees.filter((f) => {
      const amount = parseFloat(f.amount);
      return !isNaN(amount) && amount > 0 && f.description.trim();
    });

    if (validFees.length === 0) {
      alert("Debes completar al menos una tarifa válida");
      return;
    }

    // Preparar array para enviar
    const feesToSend = validFees.map((f) => ({
      feeType: f.feeType,
      amount: parseFloat(f.amount),
      description: f.description.trim(),
    }));
    console.log(feesToSend);

    onSubmit(feesToSend); // Enviamos ARRAY
  };

  const getTotalAmount = () => {
    return fees.reduce((total, fee) => {
      const amount = parseFloat(fee.amount) || 0;
      return total + amount;
    }, 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
          <h4 className="font-semibold text-gray-700">
            Agregar Tarifas ({fees.length})
          </h4>
        </div>
        <div className="text-sm text-gray-600">
          Total:{" "}
          <span className="font-bold text-green-600">
            BOB {getTotalAmount().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Lista de tarifas a agregar */}
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-2">
        {fees.map((fee, index) => (
          <div
            key={index}
            className="p-3 border border-gray-300 rounded-lg bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Tarifa #{index + 1}
              </span>
              {fees.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFee(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                className="input text-sm"
                value={fee.feeType}
                onChange={(e) =>
                  handleFeeChange(index, "feeType", e.target.value)
                }
              >
                <option value="INITIAL">Consulta Inicial</option>
                <option value="FOLLOW_UP">Control</option>
                <option value="EMERGENCY">Emergencia</option>
                <option value="PROCEDURE">Procedimiento</option>
              </select>

              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Bs.</span>
                <input
                  type="text"
                  className="input text-sm pl-10"
                  placeholder="0.00"
                  value={fee.amount}
                  onChange={(e) =>
                    handleFeeChange(index, "amount", e.target.value)
                  }
                />
              </div>

              <input
                type="text"
                className="input text-sm"
                placeholder="Descripción"
                value={fee.description}
                onChange={(e) =>
                  handleFeeChange(index, "description", e.target.value)
                }
              />
            </div>

            {/* Validación en tiempo real */}
            <div className="mt-2 text-xs">
              {fee.amount &&
                (!parseFloat(fee.amount) || parseFloat(fee.amount) <= 0) && (
                  <span className="text-red-500">Monto inválido</span>
                )}
              {fee.description && !fee.description.trim() && (
                <span className="text-red-500">Descripción requerida</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para agregar más tarifas */}
      <button
        type="button"
        onClick={handleAddFee}
        className="flex items-center text-blue-600 text-sm font-medium mb-4 hover:underline"
      >
        <Plus className="w-4 h-4 mr-1" />
        Agregar otra tarifa
      </button>

      {/* Resumen */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tarifas válidas:</span>
          <span className="font-semibold text-blue-700">
            {
              fees.filter(
                (f) => parseFloat(f.amount) > 0 && f.description.trim()
              ).length
            }{" "}
            de {fees.length}
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            fees.filter((f) => parseFloat(f.amount) > 0 && f.description.trim())
              .length === 0
          }
          className="btn-primary text-sm px-4 py-2 flex-1"
        >
          {isSubmitting
            ? "Guardando..."
            : `Agregar ${
                fees.filter(
                  (f) => parseFloat(f.amount) > 0 && f.description.trim()
                ).length
              } tarifa(s)`}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
