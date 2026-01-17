import React from "react";

const PrescriptionPreview = ({ prescriptions }) => {
  return (
    <div className="bg-white p-6 md:p-8 max-w-4xl mx-auto border rounded-xl shadow-sm">
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">RECETA MÉDICA</h1>
        <p className="text-gray-600 mt-2">
          Fecha:{" "}
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay medicamentos prescritos
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <div
              key={index}
              className="prescription-item p-4 border border-gray-200 rounded-lg"
            >
              <div className="font-bold text-lg text-gray-800 mb-2">
                {index + 1}. {prescription.medicationName}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold block text-gray-700">
                    Dosis:
                  </span>
                  <p className="mt-1 text-gray-900">
                    {prescription.dosage || "No especificada"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold block text-gray-700">
                    Frecuencia:
                  </span>
                  <p className="mt-1 text-gray-900">
                    {prescription.frequency || "No especificada"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold block text-gray-700">
                    Duración:
                  </span>
                  <p className="mt-1 text-gray-900">
                    {prescription.duration || "No especificada"}
                  </p>
                </div>
              </div>
              {prescription.instructions && (
                <div className="mt-3 pt-3 border-t">
                  <span className="font-semibold text-gray-700">
                    Instrucciones especiales:
                  </span>
                  <p className="mt-1 text-gray-900">
                    {prescription.instructions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Firma y sello */}
      <div className="mt-12 pt-6 border-t">
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="h-20 w-48 border-t border-gray-800 mt-8 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Firma del Médico</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-48 border-t border-gray-800 mt-8 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              Sello y Registro Profesional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;
