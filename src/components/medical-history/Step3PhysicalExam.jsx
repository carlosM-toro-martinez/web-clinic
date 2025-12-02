import React from "react";

const Step3PhysicalExam = ({
  vitals,
  onVitalChange,
  extendedFields,
  onExtendedFieldChange,
  subjectiveNote,
  onSubjectiveNoteChange,
  objectiveNote,
  onObjectiveNoteChange,
}) => {
  return (
    <section className="space-y-6">
      {/* Signos Vitales */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          📊 Signos Vitales y Antropometría
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="70.5"
              value={vitals.weight}
              onChange={(e) => onVitalChange("weight", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Talla (m)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="1.75"
              value={vitals.height}
              onChange={(e) => onVitalChange("height", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Per. Abdominal (cm)
            </label>
            <input
              type="number"
              placeholder="85"
              value={vitals.abdominalCircumference}
              onChange={(e) =>
                onVitalChange("abdominalCircumference", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">IMC</label>
            <input
              type="text"
              value={vitals.imc}
              readOnly
              className="w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-500 cursor-not-allowed"
              placeholder="Auto-calculado"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Temp. (°C)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="36.5"
              value={vitals.temperature}
              onChange={(e) => onVitalChange("temperature", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              T.A. Sistólica
            </label>
            <input
              type="number"
              placeholder="120"
              value={vitals.bloodPressureSystolic}
              onChange={(e) =>
                onVitalChange("bloodPressureSystolic", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              T.A. Diastólica
            </label>
            <input
              type="number"
              placeholder="80"
              value={vitals.bloodPressureDiastolic}
              onChange={(e) =>
                onVitalChange("bloodPressureDiastolic", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              F.C. (lpm)
            </label>
            <input
              type="number"
              placeholder="72"
              value={vitals.heartRate}
              onChange={(e) => onVitalChange("heartRate", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              F.R. (rpm)
            </label>
            <input
              type="number"
              placeholder="16"
              value={vitals.respiratoryRate}
              onChange={(e) => onVitalChange("respiratoryRate", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Nota Subjetiva */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🗣️ Nota Subjetiva
        </label>
        <textarea
          rows="4"
          value={subjectiveNote}
          onChange={(e) => onSubjectiveNoteChange(e.target.value)}
          placeholder="Historia de la enfermedad actual, revisión por sistemas..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
        />
      </div>

      {/* Estudios Complementarios */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🔬 Estudios Complementarios
        </label>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Laboratorios
            </label>
            <textarea
              rows="3"
              value={extendedFields.labResults || ""}
              onChange={(e) =>
                onExtendedFieldChange("labResults", e.target.value)
              }
              placeholder="Resultados de exámenes de laboratorio, valores anormales..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Imágenes</label>
            <textarea
              rows="2"
              value={extendedFields.imagingResults || ""}
              onChange={(e) =>
                onExtendedFieldChange("imagingResults", e.target.value)
              }
              placeholder="Resultados de radiografías, ecografías, TAC, RMN..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Otros Estudios
            </label>
            <textarea
              rows="2"
              value={extendedFields.otherStudies || ""}
              onChange={(e) =>
                onExtendedFieldChange("otherStudies", e.target.value)
              }
              placeholder="Electrocardiograma, espirometría, otros..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Nota Objetiva */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          👁️ Nota Objetiva / Examen Físico
        </label>
        <textarea
          rows="4"
          value={objectiveNote}
          onChange={(e) => onObjectiveNoteChange(e.target.value)}
          placeholder="Hallazgos del examen físico, sistemas afectados..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
        />
      </div>
    </section>
  );
};

export default Step3PhysicalExam;
