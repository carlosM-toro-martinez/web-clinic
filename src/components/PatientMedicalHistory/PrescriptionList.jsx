import React from "react";
import { formatDate } from "../../utils/consultationFormatter";

const PrescriptionList = ({ prescriptions }) => {
  return (
    <div>
      <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
        💊 Prescripciones
      </h4>
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
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
                          {med.dosage} • {med.frequency} • {med.duration}
                        </div>
                      </div>
                    </div>
                    {med.notes && (
                      <div className="text-sm text-text-secondary bg-surface-variant p-3 rounded-lg mt-2">
                        <span className="font-medium">Notas:</span> {med.notes}
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
  );
};

export default PrescriptionList;
