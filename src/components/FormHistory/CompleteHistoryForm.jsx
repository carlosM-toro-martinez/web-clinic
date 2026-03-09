import React, { useState, useRef } from "react";
import toTitleCase from "../../utils/toTitleCase";
import PrescriptionInput from "../medical-history/PrescriptionInput";
import PrintablePrescription from "../medical-history/PrintablePrescription";
import { useReactToPrint } from "react-to-print";

const CompleteHistoryForm = ({
  patient,
  patientHistory,
  specialtyId,
  doctorId,
  initialNote,
  onInitialNoteChange,
  patientAge,
  visitDate,
  onVisitDateChange,
  specialty,
  doctor,
  objectiveNote,
  onObjectiveNoteChange,
  extendedFields,
  onExtendedFieldChange,
  chiefComplaint,
  onChiefComplaintChange,
  vitals,
  onVitalChange,
  subjectiveNote,
  onSubjectiveNoteChange,
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
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
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

  // Filtrar diagnósticos basado en la búsqueda
  const filteredDiagnoses =
    diagnosisResponse?.data?.filter(
      (diagnosis) =>
        diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()),
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
      e.preventDefault();
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
    <div className="space-y-8">
      {/* PASO 1: Información del Paciente */}
      <section className="bg-white p-6 rounded-2xl border-2 border-blue-200">
        <h3 className="text-lg font-bold text-blue-700 mb-6 pb-3 border-b-2 border-blue-200">
          📋 Paso 1: Información del Paciente y Consulta
        </h3>

        {/* Información de Consulta */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-blue-700 mb-2">
            Información de la Consulta
          </h4>
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
                  doctor?.lastName,
                )}` || "No especificado"}
              </span>
            </div>
          </div>
        </div>

        {/* Información del Paciente */}
        {patientHistory && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">
              Datos del Paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre: </span>
                <span className="font-medium">
                  {toTitleCase(patientHistory.firstName)}{" "}
                  {toTitleCase(patientHistory.lastName)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Edad: </span>
                <span className="font-medium">{patientAge} años</span>
              </div>
              <div>
                <span className="text-gray-600">Cédula: </span>
                <span className="font-medium">
                  {patientHistory.identification}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Fecha de Visita */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📅 Fecha de la Consulta
          </label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => onVisitDateChange(e.target.value)}
            className="w-full md:w-64 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Nota Inicial */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📝 Nota Inicial / Motivo de Consulta
          </label>
          <textarea
            rows="3"
            value={initialNote}
            onChange={(e) => onInitialNoteChange(e.target.value)}
            placeholder="Describa brevemente el motivo de la consulta..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Nota Objetiva de Paso 1 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔍 Observaciones del Paciente (Evaluación Inicial)
          </label>
          <textarea
            rows="3"
            value={objectiveNote}
            onChange={(e) => onObjectiveNoteChange(e.target.value)}
            placeholder="Observaciones iniciales sobre el estado del paciente..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>
      </section>

      {/* PASO 2: Antecedentes */}
      <section className="bg-white p-6 rounded-2xl border-2 border-amber-200">
        <h3 className="text-lg font-bold text-amber-700 mb-6 pb-3 border-b-2 border-amber-200">
          🏥 Paso 2: Antecedentes Médicos
        </h3>

        {/* Queja Principal */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            💬 Detalles del motivo de consulta
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🏥 Antecedentes patológicos y medicación habitual
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔪 Antecedentes Quirúrgicos
          </label>
          <textarea
            rows="2"
            value={extendedFields.surgicalHistory || ""}
            onChange={(e) =>
              onExtendedFieldChange("surgicalHistory", e.target.value)
            }
            placeholder="Procedimientos quirúrgicos realizados..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Medicación Habitual */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            💊 Medicación Habitual
          </label>
          <textarea
            rows="2"
            value={extendedFields.habitualMedication || ""}
            onChange={(e) =>
              onExtendedFieldChange("habitualMedication", e.target.value)
            }
            placeholder="Medicamentos que toma actualmente..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Antecedentes Gineco-obstétricos */}
        <div className="bg-pink-50 p-4 rounded-xl mb-6 border-l-4 border-pink-300">
          <h4 className="font-semibold text-pink-700 mb-4">
            👩‍🔬 Antecedentes Gineco-obstétricos (si aplica)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad de Menarquia
              </label>
              <input
                type="number"
                value={extendedFields.menarcheAge || ""}
                onChange={(e) =>
                  onExtendedFieldChange("menarcheAge", e.target.value)
                }
                placeholder="Ej: 12"
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última Menstruación
              </label>
              <input
                type="date"
                value={extendedFields.lastMenstrualPeriod || ""}
                onChange={(e) =>
                  onExtendedFieldChange("lastMenstrualPeriod", e.target.value)
                }
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antecedentes Obstétricos
            </label>
            <textarea
              rows="2"
              value={extendedFields.obstetricHistory || ""}
              onChange={(e) =>
                onExtendedFieldChange("obstetricHistory", e.target.value)
              }
              placeholder="Hijos, partos, abortos, complicaciones..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
            />
          </div>
        </div>

        {/* Hábitos */}
        <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-300">
          <h4 className="font-semibold text-green-700 mb-4">🍎 Hábitos</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dieta
              </label>
              <textarea
                rows="2"
                value={extendedFields.diet || ""}
                onChange={(e) => onExtendedFieldChange("diet", e.target.value)}
                placeholder="Describa los hábitos alimenticios..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actividad Física
              </label>
              <textarea
                rows="2"
                value={extendedFields.physicalActivity || ""}
                onChange={(e) =>
                  onExtendedFieldChange("physicalActivity", e.target.value)
                }
                placeholder="Describa nivel de actividad física..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extendedFields.smokes || false}
                  onChange={(e) =>
                    onExtendedFieldChange("smokes", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Fuma</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extendedFields.alcohol || false}
                  onChange={(e) =>
                    onExtendedFieldChange("alcohol", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Alcohol
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extendedFields.drugs || false}
                  onChange={(e) =>
                    onExtendedFieldChange("drugs", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Drogas
                </span>
              </label>
            </div>
            {extendedFields.drugs && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especifique el tipo de droga
                </label>
                <textarea
                  rows="2"
                  value={extendedFields.drugsDetails || ""}
                  onChange={(e) =>
                    onExtendedFieldChange("drugsDetails", e.target.value)
                  }
                  placeholder="Tipo y frecuencia de consumo..."
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PASO 3: Examen Físico */}
      <section className="bg-white p-6 rounded-2xl border-2 border-purple-200">
        <h3 className="text-lg font-bold text-purple-700 mb-6 pb-3 border-b-2 border-purple-200">
          🩺 Paso 3: Examen Físico y Signos Vitales
        </h3>

        {/* Signos Vitales y Antropometría */}
        <div className="bg-purple-50 p-6 rounded-xl mb-6 border-l-4 border-purple-300">
          <label className="block text-sm font-semibold text-purple-700 mb-4">
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
                Circunferencia Abdominal (cm)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="85.0"
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
                type="number"
                step="0.1"
                placeholder="22.9"
                value={vitals.imc}
                onChange={(e) => onVitalChange("imc", e.target.value)}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                PA Sistólica (mmHg)
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
                PA Diastólica (mmHg)
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
                FC (lpm)
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
                FR (rpm)
              </label>
              <input
                type="number"
                placeholder="16"
                value={vitals.respiratoryRate}
                onChange={(e) =>
                  onVitalChange("respiratoryRate", e.target.value)
                }
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Nota Subjetiva */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            💬 Nota Subjetiva
          </label>
          <textarea
            rows="3"
            value={subjectiveNote}
            onChange={(e) => onSubjectiveNoteChange(e.target.value)}
            placeholder="Información reportada por el paciente..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Nota Objetiva */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔍 Nota Objetiva (Hallazgos del Examen Físico)
          </label>
          <textarea
            rows="3"
            value={objectiveNote}
            onChange={(e) => onObjectiveNoteChange(e.target.value)}
            placeholder="Hallazgos encontrados durante el examen físico..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Estudios Complementarios */}
        <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-300">
          <h4 className="font-semibold text-indigo-700 mb-4">
            🔬 Estudios Complementarios
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados de Laboratorio
              </label>
              <textarea
                rows="2"
                value={extendedFields.labResults || ""}
                onChange={(e) =>
                  onExtendedFieldChange("labResults", e.target.value)
                }
                placeholder="Exámenes de laboratorio realizados y resultados..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados de Imágenes
              </label>
              <textarea
                rows="2"
                value={extendedFields.imagingResults || ""}
                onChange={(e) =>
                  onExtendedFieldChange("imagingResults", e.target.value)
                }
                placeholder="Radiografías, tomografías, resonancias, ecografías..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otros Estudios
              </label>
              <textarea
                rows="2"
                value={extendedFields.otherStudies || ""}
                onChange={(e) =>
                  onExtendedFieldChange("otherStudies", e.target.value)
                }
                placeholder="Otros exámenes realizados..."
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[60px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PASO 4: Diagnóstico */}
      <section className="bg-white p-6 rounded-2xl border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-700 mb-6 pb-3 border-b-2 border-red-200">
          🩹 Paso 4: Diagnóstico y Evaluación
        </h3>

        {/* Evaluación */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📋 Evaluación / Impresión Diagnóstica
          </label>
          <textarea
            rows="4"
            value={assessment}
            onChange={(e) => onAssessmentChange(e.target.value)}
            placeholder="Descripción de la evaluación y conclusiones clínicas..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
          />
        </div>

        {/* Diagnósticos */}
        <div className="mb-6 p-4 bg-red-50 rounded-xl border-l-4 border-red-300">
          <h4 className="font-semibold text-red-700 mb-4">🏷️ Diagnósticos</h4>

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
              diagnoses.map((diagnosis, index) => {
                // Buscar información completa del diagnóstico si es un UUID
                const diagnosisData = diagnosisResponse?.data || [];
                const diagnosisInfo = diagnosisData.find(
                  (d) => d.id === diagnosis.diagnosisId,
                ) || {
                  name: diagnosis.diagnosisId,
                  code: "NUEVO",
                  description: "Diagnóstico personalizado",
                };

                const isCustomDiagnosis = !diagnosisData.find(
                  (d) => d.id === diagnosis.diagnosisId,
                );

                return (
                  <div
                    key={index}
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
                          <span className="text-gray-400">
                            Código: {diagnosisInfo.code}
                          </span>
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
                        onClick={() => onTogglePrimaryDiagnosis(index)}
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
                        onClick={() => onRemoveDiagnosis(index)}
                        className="px-3 py-1 rounded-lg text-red-600 border border-gray-300 hover:border-red-500 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📌 Plan de Manejo / Conducta
          </label>
          <textarea
            rows="4"
            value={plan}
            onChange={(e) => onPlanChange(e.target.value)}
            placeholder="Descripción del plan de tratamiento y seguimiento..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[100px]"
          />
        </div>
      </section>

      {/* PASO 5: Tratamiento y Prescripción */}
      <section className="bg-white p-6 rounded-2xl border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-700 mb-6 pb-3 border-b-2 border-green-200">
          💊 Paso 5: Tratamiento y Prescripciones
        </h3>

        {/* Tratamiento no farmacológico */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🏃 Tratamiento No Farmacológico
          </label>
          <textarea
            rows="3"
            value={extendedFields.nonPharmacologicalTreatment || ""}
            onChange={(e) =>
              onExtendedFieldChange(
                "nonPharmacologicalTreatment",
                e.target.value,
              )
            }
            placeholder="Recomendaciones: descanso, dieta, ejercicio, fisioterapia, etc..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Prescripciones */}
        <div className="mb-6 p-4 bg-green-50 rounded-xl border-l-4 border-green-300">
          <PrintablePrescription
            prescriptionRef={prescriptionRef}
            prescriptions={prescriptions}
            patient={patientHistory}
            doctor={doctor}
            specialty={specialty}
            date={visitDate}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h4 className="font-semibold text-green-700">
              💊 Medicamentos Prescritos
            </h4>
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
              <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-white">
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
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                >
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
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemovePrescription(index)}
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
              ))
            )}
          </div>
        </div>

        {/* Estudios Solicitados */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🔬 Estudios Solicitados
          </label>
          <textarea
            rows="3"
            value={extendedFields.requestedStudies || ""}
            onChange={(e) =>
              onExtendedFieldChange("requestedStudies", e.target.value)
            }
            placeholder="Exámenes de laboratorio, imágenes, estudios especializados..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Remisiones */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            🏥 Remisiones a Especialistas
          </label>
          <textarea
            rows="3"
            value={extendedFields.referrals || ""}
            onChange={(e) => onExtendedFieldChange("referrals", e.target.value)}
            placeholder="Especialistas a los que se refiere al paciente..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>

        {/* Seguimiento */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            📅 Seguimiento
          </label>
          <textarea
            rows="3"
            value={extendedFields.followUp || ""}
            onChange={(e) => onExtendedFieldChange("followUp", e.target.value)}
            placeholder="Instrucciones de seguimiento y citas de control..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none min-h-[80px]"
          />
        </div>
      </section>
    </div>
  );
};

export default CompleteHistoryForm;
