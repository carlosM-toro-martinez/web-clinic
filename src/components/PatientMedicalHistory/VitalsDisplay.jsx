import React from "react";

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

const VitalsDisplay = ({ vitals }) => {
  const filteredVitals = Object.entries(vitals)
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

  if (filteredVitals.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredVitals.map((vital) => (
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
  );
};

export default VitalsDisplay;
