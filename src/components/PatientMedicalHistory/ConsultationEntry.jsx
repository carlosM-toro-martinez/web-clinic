import React from "react";
import ConsultationHeader from "./ConsultationHeader";
import ConsultationBasicInfo from "./ConsultationBasicInfo";
import DiagnosisList from "./DiagnosisList";
import VitalsDisplay from "./VitalsDisplay";
import PrescriptionList from "./PrescriptionList";
import AdditionalInfo from "./AdditionalInfo";
import InfoSection from "./InfoSection";
import { formatDateTime } from "../../utils/consultationFormatter";

const ConsultationEntry = ({ entry, isExpanded, onToggle, isLast }) => {
  // Obtener signos vitales
  const vitals = entry.vitals || {};

  // Comprobar si hay información adicional para mostrar
  const hasExtendedInfo = () => {
    const extendedFields = [
      "pathologicalHistory",
      "surgicalHistory",
      "habitualMedication",
      "menarcheAge",
      "lastMenstrualPeriod",
      "obstetricHistory",
      "diet",
      "physicalActivity",
      "smokes",
      "alcohol",
      "drugs",
      "drugsDetails",
      "labResults",
      "imagingResults",
      "otherStudies",
      "nonPharmacologicalTreatment",
      "requestedStudies",
      "referrals",
      "followUp",
    ];

    return (
      extendedFields.some(
        (field) =>
          entry[field] &&
          (typeof entry[field] === "string"
            ? entry[field].trim() !== ""
            : entry[field] !== null && entry[field] !== undefined)
      ) ||
      Object.keys(vitals).some(
        (key) =>
          vitals[key] !== null &&
          vitals[key] !== undefined &&
          vitals[key] !== ""
      )
    );
  };

  return (
    <div className={`card ${!isLast ? "mb-4" : ""}`}>
      {/* Header de la consulta */}
      <ConsultationHeader
        entry={entry}
        isExpanded={isExpanded}
        onToggle={onToggle}
        hasExtendedInfo={hasExtendedInfo()}
        diagnosesCount={entry.diagnoses?.length || 0}
        prescriptionsCount={entry.prescriptions?.length || 0}
      />

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          {/* Información básica de la consulta */}
          <ConsultationBasicInfo entry={entry} />

          {/* 1. Motivo de consulta */}
          {entry.chiefComplaint && entry.chiefComplaint.trim() !== "" && (
            <InfoSection
              title="🩺 Motivo de Consulta"
              content={entry.chiefComplaint}
            />
          )}

          {/* 2-5: Información adicional (antecedentes, hábitos, etc.) */}
          <AdditionalInfo entry={entry} />

          {/* 6. Signos vitales y antropometría */}
          {Object.keys(vitals).length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                📊 Signos Vitales y Antropometría
              </h4>
              <VitalsDisplay vitals={vitals} />
            </div>
          )}

          {/* 7. Examen Fisico */}
          {entry.subjectiveNote && entry.subjectiveNote.trim() !== "" && (
            <InfoSection
              title="📝 Examen Fisico"
              content={entry.subjectiveNote}
            />
          )}

          {/* 8-9 ya están en AdditionalInfo (Estudios complementarios) */}

          {/* 10. Nota objetiva / Examen físico */}
          {entry.objectiveNote && entry.objectiveNote.trim() !== "" && (
            <InfoSection
              title="🔍 Nota Objetiva / Examen Físico"
              content={entry.objectiveNote}
            />
          )}

          {/* Impresión diagnóstica - Mantengo esto aunque no esté en el orden especificado */}
          {entry.assessment && entry.assessment.trim() !== "" && (
            <InfoSection
              title="🩺 Impresión Diagnóstica"
              content={entry.assessment}
            />
          )}

          {/* Diagnósticos - Mantengo esto aunque no esté en el orden especificado */}
          {entry.diagnoses?.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                🏷️ Diagnósticos
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
                        {diagnosis.diagnosis.code && (
                          <div className="text-sm text-text-subtle">
                            Código: {diagnosis.diagnosis.code}
                          </div>
                        )}
                        {diagnosis.diagnosis.description && (
                          <div className="text-sm text-text-primary mt-1">
                            {diagnosis.diagnosis.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. Plan */}
          {entry.plan && entry.plan.trim() !== "" && (
            <InfoSection title="📋 Plan de Tratamiento" content={entry.plan} />
          )}

          {/* 12. Tratamiento farmacológico */}
          {entry.prescriptions?.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                💊 Tratamiento Farmacológico
              </h4>
              <PrescriptionList prescriptions={entry.prescriptions} />
            </div>
          )}

          {/* Los campos 13-16 (Tratamiento no farmacológico, Estudios solicitados, 
              Interconsultas, Control y seguimiento) ya están en AdditionalInfo */}

          {/* Información de sistema */}
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-text-subtle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <span className="font-medium">Creado el:</span>{" "}
                  {formatDateTime(entry.createdAt)}
                </div>
                {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                  <div>
                    <span className="font-medium">Actualizado el:</span>{" "}
                    {formatDateTime(entry.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationEntry;
