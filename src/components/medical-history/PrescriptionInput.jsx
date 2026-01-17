import React, { useState } from "react";

const PrescriptionInput = ({ onAdd }) => {
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  const handleAdd = () => {
    if (!medicationName.trim()) return;
    onAdd({
      medicationName: medicationName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim() || "Indefinido",
    });
    setMedicationName("");
    setDosage("");
    setFrequency("");
    setDuration("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && medicationName.trim()) {
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Medicamento
          </label>
          <input
            placeholder="Nombre del medicamento"
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Dosis</label>
          <input
            placeholder="500 mg, 1 tableta..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Frecuencia</label>
          <input
            placeholder="Cada 8 horas, 1 vez al día..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Duración</label>
          <input
            placeholder="7 días, indefinido..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!medicationName.trim()}
          className="px-6 py-3 cursor-pointer rounded-xl text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          Añadir Medicamento
        </button>
      </div>
    </div>
  );
};

export default PrescriptionInput;
