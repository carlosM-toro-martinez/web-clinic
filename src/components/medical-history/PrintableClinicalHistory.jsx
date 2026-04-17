import React from "react";
import { formatBoolean, formatDate, formatDateTime } from "../../utils/consultationFormatter";

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

const getGenderText = (gender) => {
  if (gender === "M") return "Masculino";
  if (gender === "F") return "Femenino";
  return "No especificado";
};

const calculateAge = (birthDate) => {
  if (!birthDate) return "No especificada";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return `${age} años`;
};

const PrintableClinicalHistory = ({
  documentRef,
  patient,
  specialtyHistories = [],
  generatedAt = new Date().toISOString(),
  title = "Historia Clínica",
}) => {
  const patientFullName = patient
    ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
    : "Paciente no especificado";

  return (
    <div
      ref={documentRef}
      className="bg-white text-slate-900 p-8 md:p-10"
      style={{
        width: "210mm",
        maxWidth: "100%",
        margin: "0 auto",
        minHeight: "297mm",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <header className="border-b-2 border-slate-800 pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Documento Clínico
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Generado: {formatDateTime(generatedAt)}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-700">Paciente</p>
            <p className="text-slate-900 font-bold">{patientFullName}</p>
          </div>
        </div>
      </header>

      <section className="mb-7">
        <h2 className="text-lg font-bold mb-3 text-slate-800">
          Datos del Paciente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <InfoRow label="Nombre completo" value={patientFullName} />
          <InfoRow label="CI" value={patient?.ciNumber || "No especificado"} />
          <InfoRow
            label="Fecha de nacimiento"
            value={formatDate(patient?.birthDate)}
          />
          <InfoRow label="Edad" value={calculateAge(patient?.birthDate)} />
          <InfoRow label="Género" value={getGenderText(patient?.gender)} />
          <InfoRow label="Teléfono" value={patient?.phone || "No especificado"} />
        </div>
      </section>

      {specialtyHistories.map((history, specialtyIndex) => (
        <section
          key={`${history?.specialty?.id || "specialty"}-${specialtyIndex}`}
          className="mb-8"
        >
          <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Especialidad: {history?.specialty?.name || "No especificada"}
            </h3>
            {isFilled(history?.specialty?.description) && (
              <p className="text-sm text-slate-600 mt-1">
                {history.specialty.description}
              </p>
            )}
            <p className="text-sm text-slate-600 mt-1">
              Consultas registradas: {history?.entries?.length || 0}
            </p>
          </div>

          <div className="space-y-6">
            {(history?.entries || []).map((entry, entryIndex) => (
              <article
                key={entry?.id || `${specialtyIndex}-${entryIndex}`}
                className="border border-slate-200 rounded-xl p-4 break-inside-avoid"
              >
                <div className="flex flex-wrap justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
                  <h4 className="font-bold text-slate-800">
                    Consulta #{entryIndex + 1}
                  </h4>
                  <div className="text-sm text-slate-600">
                    <p>
                      Fecha de visita:{" "}
                      <span className="font-semibold text-slate-800">
                        {formatDate(entry?.visitDate)}
                      </span>
                    </p>
                    <p>
                      Médico:{" "}
                      <span className="font-semibold text-slate-800">
                        Dr. {entry?.doctor?.firstName || ""} {entry?.doctor?.lastName || ""}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  <InfoRow label="ID Consulta" value={entry?.id || "Temporal"} />
                  <InfoRow label="Creado" value={formatDateTime(entry?.createdAt || generatedAt)} />
                  <InfoRow label="Actualizado" value={formatDateTime(entry?.updatedAt || entry?.createdAt || generatedAt)} />
                </div>

                <SectionField title="Nota inicial" value={entry?.note} />
                <SectionField title="Motivo de consulta" value={entry?.chiefComplaint} />
                <SectionField title="Nota subjetiva" value={entry?.subjectiveNote} />
                <SectionField title="Nota objetiva" value={entry?.objectiveNote} />
                <SectionField title="Impresión diagnóstica" value={entry?.assessment} />
                <SectionField title="Plan de tratamiento" value={entry?.plan} />

                <VitalsSection vitals={entry?.vitals} />
                <DiagnosesSection diagnoses={entry?.diagnoses} />
                <PrescriptionsSection prescriptions={entry?.prescriptions} />
                <ExtendedFieldsSection entry={entry} />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    <div className="font-semibold text-slate-800">{value || "No especificado"}</div>
  </div>
);

const SectionField = ({ title, value }) => {
  if (!isFilled(value)) return null;
  return (
    <div className="mb-3">
      <h5 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-1">
        {title}
      </h5>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
};

const VitalsSection = ({ vitals }) => {
  if (!vitals) return null;

  const rows = [
    { label: "Peso", value: isFilled(vitals.weight) ? `${vitals.weight} kg` : null },
    { label: "Talla", value: isFilled(vitals.height) ? `${vitals.height} m` : null },
    {
      label: "Circunferencia abdominal",
      value: isFilled(vitals.abdominalCircumference)
        ? `${vitals.abdominalCircumference} cm`
        : null,
    },
    { label: "IMC", value: vitals.imc },
    {
      label: "Presión arterial",
      value:
        isFilled(vitals.bloodPressureSystolic) || isFilled(vitals.bloodPressureDiastolic)
          ? `${vitals.bloodPressureSystolic || "--"}/${vitals.bloodPressureDiastolic || "--"}`
          : null,
    },
    { label: "Frecuencia cardíaca", value: vitals.heartRate },
    { label: "Frecuencia respiratoria", value: vitals.respiratoryRate },
    { label: "Temperatura", value: vitals.temperature },
  ].filter((item) => isFilled(item.value));

  if (rows.length === 0) return null;

  return (
    <div className="mb-4">
      <h5 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
        Signos vitales y antropometría
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {rows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </div>
  );
};

const DiagnosesSection = ({ diagnoses = [] }) => {
  if (!diagnoses.length) return null;

  return (
    <div className="mb-4">
      <h5 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
        Diagnósticos
      </h5>
      <div className="space-y-2">
        {diagnoses.map((item, index) => (
          <div key={item?.id || index} className="border border-slate-200 rounded-lg px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-800">
                {item?.diagnosis?.name || item?.diagnosisId || "Diagnóstico"}
              </p>
              {item?.isPrimary && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  Principal
                </span>
              )}
            </div>
            {isFilled(item?.diagnosis?.code) && (
              <p className="text-xs text-slate-600 mt-1">Código: {item.diagnosis.code}</p>
            )}
            {isFilled(item?.diagnosis?.description) && (
              <p className="text-sm mt-1">{item.diagnosis.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PrescriptionsSection = ({ prescriptions = [] }) => {
  if (!prescriptions.length) return null;

  const medications = prescriptions.flatMap((prescription) => prescription?.medications || []);
  if (!medications.length) return null;

  return (
    <div className="mb-4">
      <h5 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
        Tratamiento farmacológico
      </h5>
      <div className="space-y-2">
        {medications.map((med, index) => (
          <div key={med?.id || index} className="border border-slate-200 rounded-lg px-3 py-2">
            <p className="font-semibold text-slate-800">{med?.medicationName || "Medicamento"}</p>
            <p className="text-sm text-slate-700">
              {med?.dosage || "Dosis no especificada"} | {med?.frequency || "Frecuencia no especificada"} |{" "}
              {med?.duration || "Duración no especificada"}
            </p>
            {isFilled(med?.instructions) && (
              <p className="text-sm mt-1">Instrucciones: {med.instructions}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ExtendedFieldsSection = ({ entry }) => {
  const extendedFields = [
    { label: "Antecedentes patológicos", value: entry?.pathologicalHistory },
    { label: "Antecedentes quirúrgicos", value: entry?.surgicalHistory },
    { label: "Medicación habitual / Antecedentes familiares", value: entry?.habitualMedication },
    { label: "Menarca", value: entry?.menarcheAge },
    { label: "FUM", value: isFilled(entry?.lastMenstrualPeriod) ? formatDate(entry.lastMenstrualPeriod) : null },
    { label: "Antecedentes obstétricos", value: entry?.obstetricHistory },
    { label: "Alimentación", value: entry?.diet },
    { label: "Actividad física", value: entry?.physicalActivity },
    {
      label: "Hábitos tóxicos",
      value:
        entry?.smokes !== null || entry?.alcohol !== null || entry?.drugs !== null
          ? `Fuma: ${formatBoolean(entry?.smokes)} | Alcohol: ${formatBoolean(entry?.alcohol)} | Drogas: ${formatBoolean(entry?.drugs)}`
          : null,
    },
    { label: "Detalle de drogas", value: entry?.drugsDetails },
    { label: "Laboratorios", value: entry?.labResults },
    { label: "Imágenes", value: entry?.imagingResults },
    { label: "Otros estudios", value: entry?.otherStudies },
    { label: "Tratamiento no farmacológico", value: entry?.nonPharmacologicalTreatment },
    { label: "Estudios solicitados", value: entry?.requestedStudies },
    { label: "Interconsultas / Derivaciones", value: entry?.referrals },
    { label: "Control y seguimiento", value: entry?.followUp },
  ].filter((field) => isFilled(field.value));

  if (!extendedFields.length) return null;

  return (
    <div className="mb-2">
      <h5 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
        Campos complementarios
      </h5>
      <div className="space-y-2">
        {extendedFields.map((field) => (
          <div key={field.label} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">{field.label}</p>
            <p className="text-sm mt-0.5 whitespace-pre-wrap">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintableClinicalHistory;
