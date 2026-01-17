import React, { useRef } from "react";
import PrescriptionInput from "./PrescriptionInput";
import PrintablePrescription from "./PrintablePrescription";
import { useReactToPrint } from "react-to-print";

const Step5Treatment = ({
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
  extendedFields,
  onExtendedFieldChange,
  patient,
  doctor,
  specialty,
}) => {
  const prescriptionRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: prescriptionRef,
    pageStyle: `
      @page {
        size: carta;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .prescription-item {
          page-break-inside: avoid;
        }
        .no-print {
          display: none !important;
        }

        @page {
          margin: 0;
        }
        
        @page :first {
          margin-top: 0;
        }
        
        @page :last {
          margin-bottom: 0;
        }
      }
    `,
  });

  return (
    <section className="space-y-4">
      <PrintablePrescription
        prescriptionRef={prescriptionRef}
        prescriptions={prescriptions}
        patient={patient}
        doctor={doctor}
        specialty={specialty}
      />

      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <label className="block text-lg font-bold text-gray-900">
            💊 Tratamiento Farmacológico
          </label>
          {prescriptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Imprimir Receta
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <PrescriptionInput onAdd={onAddPrescription} />
        </div>

        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-lg font-medium">
                No hay medicamentos prescritos
              </p>
              <p className="text-sm mt-1">
                Agrega medicamentos para generar una receta
              </p>
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
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200">
    <div className="flex-1">
      <div className="font-medium text-gray-900 text-lg">
        {prescription.medicationName}
      </div>
      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Dosis:</span>{" "}
          {prescription.dosage || "No especificada"}
        </div>
        <div>
          <span className="font-semibold">Frecuencia:</span>{" "}
          {prescription.frequency || "No especificada"}
        </div>
        <div>
          <span className="font-semibold">Duración:</span>{" "}
          {prescription.duration || "No especificada"}
        </div>
        {prescription.instructions && (
          <div className="w-full mt-2">
            <span className="font-semibold">Instrucciones:</span>{" "}
            {prescription.instructions}
          </div>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="mt-3 sm:mt-0 flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Eliminar
    </button>
  </div>
);

export default Step5Treatment;
