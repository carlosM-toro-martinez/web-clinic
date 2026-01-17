import React from "react";
import InfoSection from "./InfoSection";
import { formatDate, formatBoolean } from "../../utils/consultationFormatter";

const AdditionalInfo = ({ entry }) => {
  // Antecedentes patológicos y medicación habitual
  const hasPathologicalHistory =
    entry.pathologicalHistory && entry.pathologicalHistory.trim() !== "";

  // Antecedentes quirúrgicos
  const hasSurgicalHistory =
    entry.surgicalHistory && entry.surgicalHistory.trim() !== "";

  // Antecedentes familiares (habitualMedication)
  const hasFamilyHistory =
    entry.habitualMedication && entry.habitualMedication.trim() !== "";

  // Antecedentes gineco-obstétricos
  const getGynecologicalHistory = () => {
    const fields = [];
    if (entry.menarcheAge && entry.menarcheAge.trim() !== "")
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
    if (entry.obstetricHistory && entry.obstetricHistory.trim() !== "")
      fields.push({
        label: "Gestas/Partos",
        value: entry.obstetricHistory,
        icon: "🤰",
      });
    return fields;
  };

  // Hábitos de vida
  const getHabits = () => {
    const habits = [];

    if (entry.diet && entry.diet.trim() !== "")
      habits.push({ label: "Alimentación", value: entry.diet, icon: "🍽️" });

    if (entry.physicalActivity && entry.physicalActivity.trim() !== "")
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

    if (entry.drugs && entry.drugsDetails && entry.drugsDetails.trim() !== "") {
      habits.push({
        label: "Detalles sobre drogas",
        value: entry.drugsDetails,
        icon: "💊",
      });
    }

    return habits;
  };

  // Estudios complementarios
  const getComplementaryStudies = () => {
    const studies = [];
    if (entry.labResults && entry.labResults.trim() !== "")
      studies.push({
        label: "Laboratorios",
        value: entry.labResults,
        icon: "🧪",
      });
    if (entry.imagingResults && entry.imagingResults.trim() !== "")
      studies.push({
        label: "Imágenes",
        value: entry.imagingResults,
        icon: "🖼️",
      });
    if (entry.otherStudies && entry.otherStudies.trim() !== "")
      studies.push({
        label: "Otros Estudios",
        value: entry.otherStudies,
        icon: "📄",
      });
    return studies;
  };

  const gynecologicalHistory = getGynecologicalHistory();
  const habits = getHabits();
  const complementaryStudies = getComplementaryStudies();

  const hasAnyInfo =
    hasPathologicalHistory ||
    hasSurgicalHistory ||
    hasFamilyHistory ||
    gynecologicalHistory.length > 0 ||
    habits.length > 0 ||
    complementaryStudies.length > 0 ||
    (entry.nonPharmacologicalTreatment &&
      entry.nonPharmacologicalTreatment.trim() !== "") ||
    (entry.requestedStudies && entry.requestedStudies.trim() !== "") ||
    (entry.referrals && entry.referrals.trim() !== "") ||
    (entry.followUp && entry.followUp.trim() !== "");

  if (!hasAnyInfo) return null;

  return (
    <div className="space-y-6">
      {/* Antecedentes patológicos y medicación habitual */}
      {hasPathologicalHistory && (
        <InfoSection
          title="📋 Antecedentes Patológicos y Medicación Habitual"
          content={entry.pathologicalHistory}
        />
      )}

      {/* Antecedentes quirúrgicos */}
      {hasSurgicalHistory && (
        <InfoSection
          title="🏥 Antecedentes Quirúrgicos"
          content={entry.surgicalHistory}
        />
      )}

      {/* Antecedentes familiares */}
      {hasFamilyHistory && (
        <InfoSection
          title="👨‍👩‍👧‍👦 Antecedentes Familiares"
          content={entry.habitualMedication}
        />
      )}

      {/* Antecedentes gineco-obstétricos (si aplica) */}
      {gynecologicalHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            👩 Antecedentes Gineco-Obstétricos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {gynecologicalHistory.map((field, index) => (
              <div key={index} className="bg-surface-variant rounded-lg p-3">
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

      {/* Hábitos de vida */}
      {habits.length > 0 && (
        <div>
          <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            🍽️ Hábitos de Vida
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit, index) => (
              <div key={index} className="bg-surface-variant rounded-lg p-4">
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

      {/* Estudios complementarios */}
      {complementaryStudies.length > 0 && (
        <div>
          <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            🔬 Estudios Complementarios
          </h4>
          <div className="space-y-4">
            {complementaryStudies.map((study, index) => (
              <InfoSection
                key={index}
                title={`${study.icon} ${study.label}`}
                content={study.value}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tratamiento no farmacológico */}
      {entry.nonPharmacologicalTreatment &&
        entry.nonPharmacologicalTreatment.trim() !== "" && (
          <InfoSection
            title="💆 Tratamiento No Farmacológico"
            content={entry.nonPharmacologicalTreatment}
          />
        )}

      {/* Estudios solicitados */}
      {entry.requestedStudies && entry.requestedStudies.trim() !== "" && (
        <InfoSection
          title="🔍 Estudios Solicitados"
          content={entry.requestedStudies}
        />
      )}

      {/* Interconsultas / Derivaciones */}
      {entry.referrals && entry.referrals.trim() !== "" && (
        <InfoSection
          title="↗️ Interconsultas / Derivaciones"
          content={entry.referrals}
        />
      )}

      {/* Control y seguimiento */}
      {entry.followUp && entry.followUp.trim() !== "" && (
        <InfoSection
          title="🔄 Control y Seguimiento"
          content={entry.followUp}
        />
      )}
    </div>
  );
};

export default AdditionalInfo;
