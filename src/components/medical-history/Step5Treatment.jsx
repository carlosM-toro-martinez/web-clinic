import React from "react";
import PrescriptionInput from "./PrescriptionInput";

const Step5Treatment = ({
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
  extendedFields,
  onExtendedFieldChange,
}) => {
  return (
    <section className="space-y-6">
      {/* Tratamiento Farmacológico */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          💊 Tratamiento Farmacológico
        </label>

        <PrescriptionInput onAdd={onAddPrescription} />

        <div className="mt-4 space-y-3">
          {prescriptions.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              No hay medicamentos prescritos
            </div>
          ) : (
            prescriptions.map((prescription, index) => (
              <PrescriptionItem
                key={index}
                prescription={prescription}
                onRemove={() => onRemovePrescription(index)}
              />
            ))
          )}
        </div>
      </div>

      {/* Tratamiento No Farmacológico */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🥗 Tratamiento No Farmacológico
        </label>
        <textarea
          rows="3"
          value={extendedFields.nonPharmacologicalTreatment || ""}
          onChange={(e) =>
            onExtendedFieldChange("nonPharmacologicalTreatment", e.target.value)
          }
          placeholder="Recomendaciones de dieta, ejercicio, cambios de estilo de vida, terapia..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Estudios Solicitados */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🔬 Estudios Solicitados
        </label>
        <textarea
          rows="3"
          value={extendedFields.requestedStudies || ""}
          onChange={(e) =>
            onExtendedFieldChange("requestedStudies", e.target.value)
          }
          placeholder="Laboratorios, imágenes, estudios especiales a solicitar..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Interconsultas */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          👥 Interconsultas / Derivaciones
        </label>
        <textarea
          rows="2"
          value={extendedFields.referrals || ""}
          onChange={(e) => onExtendedFieldChange("referrals", e.target.value)}
          placeholder="Especialistas a los que se deriva, motivo de la derivación..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>

      {/* Control y Seguimiento */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          📅 Control y Seguimiento
        </label>
        <textarea
          rows="2"
          value={extendedFields.followUp || ""}
          onChange={(e) => onExtendedFieldChange("followUp", e.target.value)}
          placeholder="Fecha de control próximo, condiciones para el seguimiento..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
      </div>
    </section>
  );
};

const PrescriptionItem = ({ prescription, onRemove }) => (
  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition">
    <div className="flex-1">
      <div className="font-medium text-gray-900">
        {prescription.medicationName}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Dosis:</span> {prescription.dosage} •
        <span className="font-medium"> Frecuencia:</span>{" "}
        {prescription.frequency} •
        <span className="font-medium"> Duración:</span> {prescription.duration}
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
    >
      Eliminar
    </button>
  </div>
);

export default Step5Treatment;
