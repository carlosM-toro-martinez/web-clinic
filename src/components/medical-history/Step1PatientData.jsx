import { useContext, useEffect } from "react";
import { MainContext } from "../../context/MainContext";
import toTitleCase from "../../utils/toTitleCase";
import { useNavigate } from "react-router-dom";

const Step1PatientData = ({
  patient,
  onPatientUpdate,
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
  const navigate = useNavigate();
  const { patientHistory, setPatientHistory } = useContext(MainContext);

  const handleEdit = (patient) => {
    navigate("/pacientes/crear", { state: { patient } });
  };

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
              {toTitleCase(specialty?.name) || "No especificada"}
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
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-900">
            📋 Datos del Paciente
          </label>
          <button
            type="button"
            onClick={() => handleEdit(patientHistory)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar Paciente
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Nombre completo</div>
              <div className="font-medium text-gray-900">
                {patientHistory?.firstName} {patientHistory?.lastName}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">C.I.</div>
              <div className="font-medium text-gray-900">
                {patientHistory?.ciNumber || "No registrado"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Teléfono</div>
              <div className="font-medium text-gray-900">
                {patientHistory?.phone || "No registrado"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Edad</div>
              <div className="font-medium text-gray-900">
                {patientAge ? `${patientAge} años` : "No calculable"}
              </div>
            </div>
          </div>

          {patientHistory?.birthDate && (
            <div className="mt-3">
              <div className="text-sm text-gray-600">Fecha de Nacimiento</div>
              <div className="font-medium text-gray-900">
                {new Date(patientHistory?.birthDate).toLocaleDateString(
                  "es-BO",
                  {
                    timeZone: "UTC",
                  }
                )}
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
