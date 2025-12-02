import React from "react";
import toTitleCase from "../../utils/toTitleCase";

const Step1PatientData = ({
  patient,
  specialtyId,
  doctorId,
  initialNote,
  onInitialNoteChange,
  patientAge,
  visitDate,
  onVisitDateChange,
  specialty,
  doctor,
}) => {
  console.log(specialty, doctor);

  return (
    <section className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-700 mb-2">
          Información de la Consulta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Especialidad: </span>
            <span className="font-medium">
              {specialty?.name || "No especificada"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Médico: </span>
            <span className="font-medium">
              {`${toTitleCase(doctor?.firstName)} ${toTitleCase(
                doctor?.lastName
              )}` || "No especificado"}
            </span>
          </div>
        </div>
      </div>

      {/* Datos del paciente */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          📋 Datos del Paciente
        </label>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Nombre completo</div>
              <div className="font-medium text-gray-900">
                {patient?.firstName} {patient?.lastName}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">C.I.</div>
              <div className="font-medium text-gray-900">
                {patient?.ciNumber || "No registrado"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Teléfono</div>
              <div className="font-medium text-gray-900">
                {patient?.phone || "No registrado"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Edad</div>
              <div className="font-medium text-gray-900">
                {patientAge ? `${patientAge} años` : "No calculable"}
              </div>
            </div>
          </div>

          {patient?.birthDate && (
            <div className="mt-3">
              <div className="text-sm text-gray-600">Fecha de Nacimiento</div>
              <div className="font-medium text-gray-900">
                {new Date(patient.birthDate).toLocaleDateString("es-BO")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fecha de consulta */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          📅 Fecha de Consulta
        </label>
        <input
          type="date"
          value={visitDate}
          onChange={(e) => onVisitDateChange(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>

      {/* Motivo de consulta */}
      <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          🎯 Motivo de Consulta
        </label>
        <textarea
          rows="3"
          value={initialNote}
          onChange={(e) => onInitialNoteChange(e.target.value)}
          placeholder="Describa el motivo principal de la consulta, síntomas, duración..."
          className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
        />
        <div className="text-xs text-gray-500 mt-2">
          Ej: "Paciente derivado de [especialidad] por [motivo], refiere
          [síntomas]"
        </div>
      </div>
    </section>
  );
};

export default Step1PatientData;
