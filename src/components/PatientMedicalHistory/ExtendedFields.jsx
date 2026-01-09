import React from "react";
import InfoSection from "./InfoSection";

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

export default ExtendedFields;
