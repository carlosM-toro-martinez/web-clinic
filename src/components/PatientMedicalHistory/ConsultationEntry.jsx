import React from "react";
import InfoSection from "./InfoSection";

const ConsultationEntry = ({ entry, isExpanded, onToggle, isLast }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para formatear valores booleanos
  const formatBoolean = (value) => {
    if (value === null || value === undefined) return "No especificado";
    return value ? "Sí" : "No";
  };

  // Función para agrupar y filtrar campos extendidos que tienen valor
  const getExtendedFields = () => {
    const fields = [
      { key: "assessment", label: "🩺 Impresión Diagnóstica", icon: "🩺" },
      {
        key: "pathologicalHistory",
        label: "📋 Antecedentes Patológicos",
        icon: "📋",
      },
      {
        key: "surgicalHistory",
        label: "🔪 Antecedentes Quirúrgicos",
        icon: "🏥",
      },
      {
        key: "habitualMedication",
        label: "💊 Medicación Habitual",
        icon: "💊",
      },
      { key: "labResults", label: "🧪 Resultados de Laboratorio", icon: "🔬" },
      { key: "imagingResults", label: "🖼️ Resultados de Imágenes", icon: "📷" },
      { key: "otherStudies", label: "📄 Otros Estudios", icon: "📋" },
      {
        key: "nonPharmacologicalTreatment",
        label: "💆 Tratamiento No Farmacológico",
        icon: "🧘",
      },
      { key: "requestedStudies", label: "🔍 Estudios Solicitados", icon: "🔍" },
      { key: "referrals", label: "↗️ Derivaciones", icon: "👨‍⚕️" },
      { key: "followUp", label: "🔄 Seguimiento", icon: "📅" },
    ];

    return fields.filter(
      (field) => entry[field.key] && entry[field.key].toString().trim() !== ""
    );
  };

  // Función para obtener todos los campos de signos vitales
  const getAllVitals = () => {
    if (!entry.vitals) return [];

    const vitalsMap = {
      weight: { label: "Peso", unit: "kg", icon: "⚖️" },
      height: { label: "Talla", unit: "m", icon: "📏" },
      imc: { label: "IMC", unit: "", icon: "📊" },
      heartRate: { label: "Frecuencia Cardíaca", unit: "lpm", icon: "❤️" },
      temperature: { label: "Temperatura", unit: "°C", icon: "🌡️" },
      respiratoryRate: {
        label: "Frecuencia Respiratoria",
        unit: "rpm",
        icon: "🌬️",
      },
      bloodPressureSystolic: {
        label: "Presión Sistólica",
        unit: "mmHg",
        icon: "🩸",
      },
      bloodPressureDiastolic: {
        label: "Presión Diastólica",
        unit: "mmHg",
        icon: "🩸",
      },
      abdominalCircumference: {
        label: "Circunferencia Abdominal",
        unit: "cm",
        icon: "📐",
      },
    };

    return Object.entries(entry.vitals)
      .filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      )
      .map(([key, value]) => ({
        key,
        label: vitalsMap[key]?.label || key,
        value: value,
        unit: vitalsMap[key]?.unit || "",
        icon: vitalsMap[key]?.icon || "📊",
      }));
  };

  // Obtener antecedentes gineco-obstétricos si existen
  const getGynecologicalHistory = () => {
    const fields = [];
    if (entry.menarcheAge)
      fields.push({
        label: "Menarca",
        value: `${entry.menarcheAge} años`,
        icon: "👧",
      });
    if (entry.lastMenstrualPeriod)
      fields.push({
        label: "FUM",
        value: formatDate(entry.lastMenstrualPeriod),
        icon: "📅",
      });
    if (entry.obstetricHistory)
      fields.push({
        label: "Gestas/Partos",
        value: entry.obstetricHistory,
        icon: "🤰",
      });
    return fields;
  };

  // Obtener hábitos
  const getHabits = () => {
    const habits = [];

    if (entry.diet)
      habits.push({ label: "Alimentación", value: entry.diet, icon: "🍽️" });
    if (entry.physicalActivity)
      habits.push({
        label: "Actividad Física",
        value: entry.physicalActivity,
        icon: "🏃",
      });

    // Hábitos tóxicos
    const toxicHabits = [];
    if (entry.smokes !== null)
      toxicHabits.push({ label: "Fuma", value: formatBoolean(entry.smokes) });
    if (entry.alcohol !== null)
      toxicHabits.push({
        label: "Alcohol",
        value: formatBoolean(entry.alcohol),
      });
    if (entry.drugs !== null)
      toxicHabits.push({ label: "Drogas", value: formatBoolean(entry.drugs) });

    if (toxicHabits.length > 0) {
      habits.push({
        label: "Hábitos Tóxicos",
        value: toxicHabits.map((h) => `${h.label}: ${h.value}`).join(", "),
        icon: "🚬",
      });
    }

    if (entry.drugs && entry.drugsDetails) {
      habits.push({
        label: "Detalles sobre drogas",
        value: entry.drugsDetails,
        icon: "💊",
      });
    }

    return habits;
  };

  // Comprobar si hay información adicional para mostrar
  const hasExtendedInfo = () => {
    return (
      getExtendedFields().length > 0 ||
      getAllVitals().length > 0 ||
      getGynecologicalHistory().length > 0 ||
      getHabits().length > 0
    );
  };

  return (
    <div className={`card ${!isLast ? "mb-4" : ""}`}>
      {/* Header de la consulta */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent-blue-light rounded-xl flex items-center justify-center">
            <span className="text-primary text-lg">📅</span>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Consulta del {formatDate(entry.visitDate)}
            </h3>
            <p className="text-sm text-text-subtle">
              Dr. {entry.doctor.firstName} {entry.doctor.lastName}
            </p>
            <p className="text-xs text-text-subtle mt-1">
              ID: {entry.id.substring(0, 8)}... • Creado:{" "}
              {formatDateTime(entry.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Indicadores rápidos */}
          {entry.diagnoses.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-text-subtle bg-blue-50 px-3 py-1 rounded-full">
              <span>🩺</span>
              <span className="font-medium">{entry.diagnoses.length} dx</span>
            </div>
          )}
          {entry.prescriptions.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-text-subtle bg-green-50 px-3 py-1 rounded-full">
              <span>💊</span>
              <span className="font-medium">
                {entry.prescriptions.length} rx
              </span>
            </div>
          )}
          {hasExtendedInfo() && (
            <div className="flex items-center gap-1 text-sm text-text-subtle bg-purple-50 px-3 py-1 rounded-full">
              <span>📋</span>
              <span className="font-medium">Más info</span>
            </div>
          )}
          <button className="text-text-subtle hover:text-text-primary transition p-2">
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          {/* Información básica de la consulta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-surface-variant rounded-lg p-3">
              <div className="text-xs text-text-subtle mb-1">
                Fecha de visita
              </div>
              <div className="font-medium text-text-primary">
                {formatDate(entry.visitDate)}
              </div>
            </div>
            <div className="bg-surface-variant rounded-lg p-3">
              <div className="text-xs text-text-subtle mb-1">
                Médico tratante
              </div>
              <div className="font-medium text-text-primary">
                Dr. {entry.doctor.firstName} {entry.doctor.lastName}
              </div>
            </div>
            <div className="bg-surface-variant rounded-lg p-3">
              <div className="text-xs text-text-subtle mb-1">
                ID de consulta
              </div>
              <div className="font-medium text-text-primary font-mono text-sm">
                {entry.id.substring(0, 8)}...
              </div>
            </div>
          </div>

          {/* Motivo de consulta */}
          {entry.chiefComplaint && (
            <InfoSection
              title="🩺 Detalles del motivo de consulta"
              content={entry.chiefComplaint}
            />
          )}

          {/* Notas subjetivas y objetivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entry.subjectiveNote && (
              <InfoSection
                title="📝 Nota Subjetiva"
                content={entry.subjectiveNote}
              />
            )}
            {entry.objectiveNote && (
              <InfoSection
                title="🔍 Nota Objetiva / Examen Físico"
                content={entry.objectiveNote}
              />
            )}
          </div>

          {/* Impresión diagnóstica */}
          {entry.assessment && (
            <InfoSection
              title="🩺 Impresión Diagnóstica (Assessment)"
              content={entry.assessment}
            />
          )}

          {/* Diagnósticos */}
          {entry.diagnoses.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                🩺 Diagnósticos
              </h4>
              <div className="space-y-2">
                {entry.diagnoses.map((diagnosis, index) => (
                  <div
                    key={diagnosis.id}
                    className={`p-4 rounded-lg border ${
                      diagnosis.isPrimary
                        ? "border-primary bg-accent-blue-light"
                        : "border-border bg-surface-variant"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-medium text-text-primary text-lg">
                            {diagnosis.diagnosis.name}
                          </div>
                          {diagnosis.isPrimary && (
                            <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">
                              Principal
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {diagnosis.diagnosis.code && (
                            <div>
                              <div className="text-xs text-text-subtle">
                                Código
                              </div>
                              <div className="text-sm font-medium text-text-primary">
                                {diagnosis.diagnosis.code}
                              </div>
                            </div>
                          )}
                          {diagnosis.diagnosis.description && (
                            <div>
                              <div className="text-xs text-text-subtle">
                                Descripción
                              </div>
                              <div className="text-sm text-text-primary">
                                {diagnosis.diagnosis.description}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan de tratamiento */}
          {entry.plan && (
            <InfoSection title="📋 Plan de Tratamiento" content={entry.plan} />
          )}

          {/* Signos vitales - Todos los campos disponibles */}
          {getAllVitals().length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                ❤️ Signos Vitales
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getAllVitals().map((vital) => (
                  <div
                    key={vital.key}
                    className="bg-surface-variant rounded-lg p-4 text-center hover:shadow-sm transition-shadow"
                  >
                    <div className="text-2xl mb-2">{vital.icon}</div>
                    <div className="text-sm font-medium text-text-primary mb-1">
                      {vital.label}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {vital.value} {vital.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prescripciones */}
          {entry.prescriptions.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                💊 Prescripciones
              </h4>
              <div className="space-y-4">
                {entry.prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="border border-border rounded-xl p-5 bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-sm text-text-subtle mb-1">
                          Fecha de prescripción
                        </div>
                        <div className="font-medium text-text-primary">
                          {formatDate(prescription.prescriptionDate)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-subtle mb-1">
                          Prescrito por
                        </div>
                        <div className="font-medium text-text-primary">
                          Dr. {prescription.doctor.firstName}{" "}
                          {prescription.doctor.lastName}
                        </div>
                      </div>
                    </div>

                    {prescription.instructions && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-text-primary mb-1">
                          Instrucciones:
                        </div>
                        <div className="text-sm text-text-secondary">
                          {prescription.instructions}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {prescription.medications.map((med) => (
                        <div
                          key={med.id}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border last:border-b-0"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <span className="text-green-600">💊</span>
                              </div>
                              <div>
                                <div className="font-bold text-text-primary">
                                  {med.medicationName}
                                </div>
                                <div className="text-sm text-text-subtle">
                                  {med.dosage} • {med.frequency} •{" "}
                                  {med.duration}
                                </div>
                              </div>
                            </div>
                            {med.notes && (
                              <div className="text-sm text-text-secondary bg-surface-variant p-3 rounded-lg mt-2">
                                <span className="font-medium">Notas:</span>{" "}
                                {med.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {prescription.notes && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="text-sm text-text-secondary">
                          <span className="font-medium">Observaciones:</span>{" "}
                          {prescription.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Antecedentes gineco-obstétricos (si aplica) */}
          {getGynecologicalHistory().length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                👩 Antecedentes Gineco-Obstétricos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {getGynecologicalHistory().map((field, index) => (
                  <div
                    key={index}
                    className="bg-surface-variant rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>{field.icon}</span>
                      <div className="text-sm font-medium text-text-primary">
                        {field.label}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hábitos */}
          {getHabits().length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                🍽️ Hábitos de Vida
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getHabits().map((habit, index) => (
                  <div
                    key={index}
                    className="bg-surface-variant rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{habit.icon}</span>
                      <div className="font-medium text-text-primary">
                        {habit.label}
                      </div>
                    </div>
                    <div className="text-text-primary">{habit.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campos extendidos */}
          {getExtendedFields().length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                📄 Información Adicional
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getExtendedFields().map((field) => (
                  <InfoSection
                    key={field.key}
                    title={`${field.icon} ${field.label}`}
                    content={entry[field.key]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Información de sistema */}
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-text-subtle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Creado el:</span>{" "}
                  {formatDateTime(entry.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationEntry;
