import React, { useState } from "react";

const Step4Diagnosis = ({
  assessment,
  onAssessmentChange,
  plan,
  onPlanChange,
  diagnoses,
  onAddDiagnosis,
  onRemoveDiagnosis,
  onTogglePrimaryDiagnosis,
  diagnosisResponse,
  isLoadingDiagnosis,
  isErrorDiagnosis,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtrar diagnósticos basado en la búsqueda
  const filteredDiagnoses =
    diagnosisResponse?.data?.filter(
      (diagnosis) =>
        diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSelectDiagnosis = (diagnosis) => {
    // Enviar el ID del diagnóstico seleccionado
    onAddDiagnosis(diagnosis.id, diagnoses.length === 0);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleAddCustomDiagnosis = () => {
    if (searchTerm.trim()) {
      // Enviar el nombre directamente para crear nuevo diagnóstico
      onAddDiagnosis(searchTerm.trim(), diagnoses.length === 0);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      // Si hay diagnósticos filtrados, seleccionar el primero
      if (filteredDiagnoses.length > 0) {
        handleSelectDiagnosis(filteredDiagnoses[0]);
      } else {
        // Si no hay coincidencias, agregar como nuevo diagnóstico
        handleAddCustomDiagnosis();
      }
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🩺 Impresión Diagnóstica (Assessment)
        </label>
        <textarea
          rows="4"
          value={assessment}
          onChange={(e) => onAssessmentChange(e.target.value)}
          placeholder="Análisis de los hallazgos, impresiones diagnósticas, diagnósticos diferenciales..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          📋 Diagnósticos
        </label>

        {/* Buscador de diagnósticos mejorado */}
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowDropdown(true)}
                placeholder="Buscar diagnóstico existente o escribir uno nuevo..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              {/* Dropdown de diagnósticos existentes */}
              {showDropdown && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {isLoadingDiagnosis ? (
                    <div className="px-4 py-2 text-gray-500">
                      Cargando diagnósticos...
                    </div>
                  ) : filteredDiagnoses.length > 0 ? (
                    <>
                      {filteredDiagnoses.map((diagnosis) => (
                        <div
                          key={diagnosis.id}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSelectDiagnosis(diagnosis)}
                        >
                          <div className="font-medium text-gray-900">
                            {diagnosis.name}
                          </div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>Código: {diagnosis.code}</span>
                            <span className="text-blue-600">Seleccionar</span>
                          </div>
                          {diagnosis.description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {diagnosis.description}
                            </div>
                          )}
                        </div>
                      ))}
                      <div
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer border-t border-gray-200 bg-gray-50"
                        onClick={handleAddCustomDiagnosis}
                      >
                        <div className="font-medium text-gray-900">
                          Agregar nuevo: "{searchTerm}"
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="text-green-600">
                            Crear nuevo diagnóstico
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer"
                      onClick={handleAddCustomDiagnosis}
                    >
                      <div className="font-medium text-gray-900">
                        Agregar nuevo diagnóstico: "{searchTerm}"
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="text-green-600">
                          Presiona Enter o haz clic para crear
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddCustomDiagnosis}
              disabled={!searchTerm.trim()}
              className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              Agregar Nuevo
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            💡 <strong>Sugerencia:</strong> Busca en la lista desplegable para
            usar diagnósticos existentes, o escribe uno nuevo y haz clic en
            "Agregar Nuevo"
          </div>
        </div>

        {/* Lista de diagnósticos agregados */}
        <div className="mt-4 space-y-3">
          {diagnoses.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              No hay diagnósticos agregados
            </div>
          ) : (
            diagnoses.map((diagnosis, index) => (
              <DiagnosisItem
                key={index}
                diagnosis={diagnosis}
                index={index}
                diagnosisData={diagnosisResponse?.data || []}
                onTogglePrimary={onTogglePrimaryDiagnosis}
                onRemove={onRemoveDiagnosis}
              />
            ))
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          📝 Plan
        </label>
        <textarea
          rows="3"
          value={plan}
          onChange={(e) => onPlanChange(e.target.value)}
          placeholder="Plan de manejo, recomendaciones, observaciones..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>
    </section>
  );
};

const DiagnosisItem = ({
  diagnosis,
  index,
  diagnosisData,
  onTogglePrimary,
  onRemove,
}) => {
  // Buscar información completa del diagnóstico si es un UUID
  const diagnosisInfo = diagnosisData.find(
    (d) => d.id === diagnosis.diagnosisId
  ) || {
    name: diagnosis.diagnosisId,
    code: "NUEVO",
    description: "Diagnóstico personalizado",
  };

  const isCustomDiagnosis = !diagnosisData.find(
    (d) => d.id === diagnosis.diagnosisId
  );

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-xl transition ${
        isCustomDiagnosis
          ? "border-green-200 bg-green-50"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-3 h-3 rounded-full ${
            diagnosis.isPrimary ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div>
          <div className="font-medium text-gray-900">
            {diagnosisInfo.name}
            {isCustomDiagnosis && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Nuevo
              </span>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <span
              className={`${
                diagnosis.isPrimary
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {diagnosis.isPrimary
                ? "Diagnóstico Principal"
                : "Diagnóstico Secundario"}
            </span>
            <span className="text-gray-400">Código: {diagnosisInfo.code}</span>
          </div>
          {diagnosisInfo.description && (
            <div className="text-xs text-gray-500 mt-1">
              {diagnosisInfo.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onTogglePrimary(index)}
          className={`px-3 py-1 rounded-lg border transition ${
            diagnosis.isPrimary
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 hover:border-blue-500 text-gray-700"
          }`}
        >
          {diagnosis.isPrimary ? "Principal" : "Secundario"}
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="px-3 py-1 rounded-lg text-red-600 border border-gray-300 hover:border-red-500 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Step4Diagnosis;
