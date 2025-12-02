import React, { useState } from "react";

const DiagnosisInput = ({ onAdd }) => {
  const [diagId, setDiagId] = useState("");
  const [label, setLabel] = useState("");

  const handleAdd = () => {
    if (!diagId.trim()) return;
    onAdd(diagId.trim());
    setDiagId("");
    setLabel("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Código o nombre
          </label>
          <input
            type="text"
            placeholder="Código CIE-10 o nombre diagnóstico"
            value={diagId}
            onChange={(e) => setDiagId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Descripción (opcional)
          </label>
          <input
            type="text"
            placeholder="Descripción detallada"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-3 rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition whitespace-nowrap font-medium"
      >
        Agregar Diagnóstico
      </button>
    </div>
  );
};

export default DiagnosisInput;
