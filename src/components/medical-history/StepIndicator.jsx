import React from "react";

const StepIndicator = ({ step }) => {
  const steps = [
    { number: 1, label: "Datos Paciente", shortLabel: "Paciente" },
    { number: 2, label: "Antecedentes", shortLabel: "Antecedentes" },
    { number: 3, label: "Examen Físico", shortLabel: "Examen" },
    { number: 4, label: "Diagnóstico", shortLabel: "Diagnóstico" },
    { number: 5, label: "Tratamiento", shortLabel: "Tratamiento" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-8">
      {steps.map((s) => (
        <div
          key={s.number}
          className={`flex-1 py-3 px-4 rounded-xl text-center font-medium transition-all ${
            step === s.number
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-300"
          }`}
        >
          <div className="hidden sm:block">{s.label}</div>
          <div className="sm:hidden text-sm">{s.shortLabel}</div>
          <div
            className={`text-xs mt-1 ${
              step === s.number ? "text-blue-100" : "text-gray-500"
            }`}
          >
            Paso {s.number}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
