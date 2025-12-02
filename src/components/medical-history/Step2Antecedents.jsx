import React from "react";

const Step2Antecedents = ({
  extendedFields,
  onExtendedFieldChange,
  chiefComplaint,
  onChiefComplaintChange,
}) => {
  return (
    <section className="space-y-6">
      {/* Queja principal */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          💬 Queja Principal en Detalle
        </label>
        <textarea
          rows="3"
          value={chiefComplaint}
          onChange={(e) => onChiefComplaintChange(e.target.value)}
          placeholder="Describa en detalle la queja principal del paciente..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Antecedentes Patológicos */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🏥 Antecedentes Patológicos
        </label>
        <textarea
          rows="3"
          value={extendedFields.pathologicalHistory || ""}
          onChange={(e) =>
            onExtendedFieldChange("pathologicalHistory", e.target.value)
          }
          placeholder="Enfermedades crónicas, condiciones médicas previas, alergias..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Antecedentes Quirúrgicos */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🔪 Antecedentes Quirúrgicos
        </label>
        <textarea
          rows="2"
          value={extendedFields.surgicalHistory || ""}
          onChange={(e) =>
            onExtendedFieldChange("surgicalHistory", e.target.value)
          }
          placeholder="Cirugías previas, fechas, complicaciones..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Medicación Habitual */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          💊 Medicación Habitual
        </label>
        <textarea
          rows="2"
          value={extendedFields.habitualMedication || ""}
          onChange={(e) =>
            onExtendedFieldChange("habitualMedication", e.target.value)
          }
          placeholder="Medicamentos de uso regular, dosis, frecuencia..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Antecedentes Gineco-Obstétricos */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          👩 Gineco-Obstétricos (si aplica)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Menarca (años)
            </label>
            <input
              type="text"
              placeholder="Edad"
              value={extendedFields.menarcheAge || ""}
              onChange={(e) =>
                onExtendedFieldChange("menarcheAge", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">FUM</label>
            <input
              type="date"
              value={extendedFields.lastMenstrualPeriod || ""}
              onChange={(e) =>
                onExtendedFieldChange("lastMenstrualPeriod", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Gestas/Partos
            </label>
            <input
              type="text"
              placeholder="G2P2"
              value={extendedFields.obstetricHistory || ""}
              onChange={(e) =>
                onExtendedFieldChange("obstetricHistory", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Hábitos */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🍽️ Hábitos de Vida
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Alimentación
            </label>
            <input
              type="text"
              placeholder="Tipo de dieta, restricciones..."
              value={extendedFields.diet || ""}
              onChange={(e) => onExtendedFieldChange("diet", e.target.value)}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Actividad Física
            </label>
            <input
              type="text"
              placeholder="Frecuencia, tipo de ejercicio..."
              value={extendedFields.physicalActivity || ""}
              onChange={(e) =>
                onExtendedFieldChange("physicalActivity", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              type="checkbox"
              checked={extendedFields.smokes || false}
              onChange={(e) =>
                onExtendedFieldChange("smokes", e.target.checked)
              }
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Fuma</span>
          </label>

          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              type="checkbox"
              checked={extendedFields.alcohol || false}
              onChange={(e) =>
                onExtendedFieldChange("alcohol", e.target.checked)
              }
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Alcohol</span>
          </label>

          <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <input
              type="checkbox"
              checked={extendedFields.drugs || false}
              onChange={(e) => onExtendedFieldChange("drugs", e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Drogas</span>
          </label>
        </div>

        {extendedFields.drugs && (
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Detalles sobre drogas
            </label>
            <input
              type="text"
              placeholder="Tipo, frecuencia, cantidad..."
              value={extendedFields.drugsDetails || ""}
              onChange={(e) =>
                onExtendedFieldChange("drugsDetails", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Step2Antecedents;
