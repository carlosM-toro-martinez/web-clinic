import React, { useState } from "react";

const PatientMedicalHistory = ({ medicalHistory }) => {
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);

  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              No hay historial médico disponible
            </h2>
            <p className="text-text-subtle">
              El paciente no tiene registros médicos en el sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar por especialidad
  const specialties = medicalHistory.map((history) => history.specialty);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Historial Médico
          </h1>
          <p className="text-text-subtle">
            Registros completos de consultas y tratamientos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Especialidades */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span>🏥</span>
                Especialidades
              </h3>
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <button
                    key={specialty.id}
                    onClick={() => setActiveSpecialty(medicalHistory[index])}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSpecialty?.specialty.id === specialty.id
                        ? "sidebar-item--active"
                        : "sidebar-item hover:bg-surface-variant"
                    }`}
                  >
                    <div className="font-medium text-text-primary">
                      {specialty.name}
                    </div>
                    <div className="text-xs text-text-subtle mt-1">
                      {medicalHistory[index].entries.length} consulta
                      {medicalHistory[index].entries.length !== 1 ? "s" : ""}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {activeSpecialty ? (
              <SpecialtyHistory
                specialtyHistory={activeSpecialty}
                activeEntry={activeEntry}
                setActiveEntry={setActiveEntry}
              />
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Selecciona una especialidad
                </h3>
                <p className="text-text-subtle">
                  Elige una especialidad del menú para ver el historial de
                  consultas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecialtyHistory = ({
  specialtyHistory,
  activeEntry,
  setActiveEntry,
}) => {
  const { specialty, entries } = specialtyHistory;

  return (
    <div className="space-y-6">
      {/* Header de Especialidad */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              {specialty.name}
            </h2>
            {specialty.description && (
              <p className="text-text-subtle">{specialty.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-text-subtle">Total de consultas</div>
            <div className="text-2xl font-bold text-primary">
              {entries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Consultas */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <ConsultationEntry
            key={entry.id}
            entry={entry}
            isExpanded={activeEntry === entry.id}
            onToggle={() =>
              setActiveEntry(activeEntry === entry.id ? null : entry.id)
            }
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

const ConsultationEntry = ({ entry, isExpanded, onToggle, isLast }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Indicadores rápidos */}
          {entry.diagnoses.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-text-subtle">
              <span>🩺</span>
              <span>{entry.diagnoses.length} dx</span>
            </div>
          )}
          {entry.prescriptions.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-text-subtle">
              <span>💊</span>
              <span>{entry.prescriptions.length} rx</span>
            </div>
          )}
          <button className="text-text-subtle hover:text-text-primary transition">
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          {/* Motivo de consulta */}
          {entry.chiefComplaint && (
            <InfoSection
              title="🩺 Motivo de Consulta"
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
                title="🔍 Nota Objetiva"
                content={entry.objectiveNote}
              />
            )}
          </div>

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
                    className={`p-3 rounded-lg border ${
                      diagnosis.isPrimary
                        ? "border-primary bg-accent-blue-light"
                        : "border-border bg-surface-variant"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-text-primary">
                          {diagnosis.diagnosis.name}
                          {diagnosis.isPrimary && (
                            <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                              Principal
                            </span>
                          )}
                        </div>
                        {diagnosis.diagnosis.code && (
                          <div className="text-sm text-text-subtle mt-1">
                            Código: {diagnosis.diagnosis.code}
                          </div>
                        )}
                        {diagnosis.diagnosis.description && (
                          <div className="text-sm text-text-subtle mt-1">
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

          {/* Plan de tratamiento */}
          {entry.plan && (
            <InfoSection title="📋 Plan de Tratamiento" content={entry.plan} />
          )}

          {/* Signos vitales */}
          {entry.vitals &&
            Object.keys(entry.vitals).some(
              (key) => entry.vitals[key] !== null
            ) && (
              <div>
                <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                  ❤️ Signos Vitales
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {entry.vitals.weight && (
                    <VitalCard
                      label="Peso"
                      value={`${entry.vitals.weight} kg`}
                    />
                  )}
                  {entry.vitals.height && (
                    <VitalCard
                      label="Talla"
                      value={`${entry.vitals.height} m`}
                    />
                  )}
                  {entry.vitals.imc && (
                    <VitalCard label="IMC" value={entry.vitals.imc} />
                  )}
                  {entry.vitals.bloodPressureSystolic &&
                    entry.vitals.bloodPressureDiastolic && (
                      <VitalCard
                        label="Presión"
                        value={`${entry.vitals.bloodPressureSystolic}/${entry.vitals.bloodPressureDiastolic}`}
                      />
                    )}
                </div>
              </div>
            )}

          {/* Prescripciones */}
          {entry.prescriptions.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                💊 Prescripciones
              </h4>
              <div className="space-y-3">
                {entry.prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="text-sm text-text-subtle mb-2">
                      Fecha: {formatDate(prescription.prescriptionDate)}
                    </div>
                    <div className="space-y-2">
                      {prescription.medications.map((med) => (
                        <div
                          key={med.id}
                          className="flex justify-between items-start py-2 border-b border-border last:border-b-0"
                        >
                          <div>
                            <div className="font-medium text-text-primary">
                              {med.medicationName}
                            </div>
                            <div className="text-sm text-text-subtle">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </div>
                            {med.notes && (
                              <div className="text-sm text-text-subtle mt-1">
                                {med.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campos extendidos */}
          <ExtendedFields entry={entry} />
        </div>
      )}
    </div>
  );
};

const InfoSection = ({ title, content }) => (
  <div>
    <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
    <div className="text-text-secondary bg-surface-variant rounded-lg p-4 whitespace-pre-wrap">
      {content}
    </div>
  </div>
);

const VitalCard = ({ label, value }) => (
  <div className="bg-surface-variant rounded-lg p-3 text-center">
    <div className="text-sm text-text-subtle">{label}</div>
    <div className="font-semibold text-text-primary">{value}</div>
  </div>
);

const ExtendedFields = ({ entry }) => {
  const extendedFields = [
    {
      key: "pathologicalHistory",
      label: "🩺 Antecedentes Patológicos",
      icon: "📋",
    },
    {
      key: "surgicalHistory",
      label: "🔪 Antecedentes Quirúrgicos",
      icon: "🏥",
    },
    { key: "habitualMedication", label: "💊 Medicación Habitual", icon: "💊" },
    { key: "labResults", label: "🔬 Resultados de Laboratorio", icon: "🧪" },
    { key: "imagingResults", label: "📷 Resultados de Imágenes", icon: "🖼️" },
    {
      key: "nonPharmacologicalTreatment",
      label: "💆 Tratamiento No Farmacológico",
      icon: "🧘",
    },
    { key: "requestedStudies", label: "📋 Estudios Solicitados", icon: "🔍" },
    { key: "referrals", label: "↗️ Derivaciones", icon: "👨‍⚕️" },
    { key: "followUp", label: "🔄 Seguimiento", icon: "📅" },
  ];

  const hasExtendedFields = extendedFields.some((field) => entry[field.key]);

  if (!hasExtendedFields) return null;

  return (
    <div>
      <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
        📄 Información Adicional
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extendedFields.map((field) =>
          entry[field.key] ? (
            <InfoSection
              key={field.key}
              title={field.label}
              content={entry[field.key]}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
