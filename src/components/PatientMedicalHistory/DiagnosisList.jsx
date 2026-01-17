import React from "react";

const DiagnosisList = ({ diagnoses }) => {
  return (
    <div>
      <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
        🩺 Diagnósticos
      </h4>
      <div className="space-y-2">
        {diagnoses.map((diagnosis) => (
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
                      <div className="text-xs text-text-subtle">Código</div>
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
  );
};

export default DiagnosisList;
