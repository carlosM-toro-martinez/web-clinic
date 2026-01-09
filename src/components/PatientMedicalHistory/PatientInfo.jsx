import React from "react";

const PatientInfo = ({ patient, formatDate, calculateAge, getGenderText }) => {
  if (!patient) return null;

  return (
    <div className="card mb-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Información del Paciente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-text-subtle mb-1">
                Nombre Completo
              </div>
              <div className="text-text-primary font-semibold">
                {patient.firstName} {patient.lastName}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-text-subtle mb-1">
                Fecha de Nacimiento / Edad
              </div>
              <div className="text-text-primary font-semibold">
                {formatDate(patient.birthDate)} (
                {calculateAge(patient.birthDate)})
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-text-subtle mb-1">
                Género
              </div>
              <div className="text-text-primary font-semibold">
                {getGenderText(patient.gender)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
