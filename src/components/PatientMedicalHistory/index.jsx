import React, { useState } from "react";
import PatientInfo from "./PatientInfo";
import SpecialtyList from "./SpecialtyList";
import SpecialtyHistory from "./SpecialtyHistory";

const PatientMedicalHistory = ({ medicalHistory }) => {
  console.log("Medical History:", medicalHistory);
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return `${age} años`;
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "M":
        return "Masculino";
      case "F":
        return "Femenino";
      default:
        return "No especificado";
    }
  };

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

  const patient = medicalHistory[0]?.patient;
  const specialties = medicalHistory.map((history) => history.specialty);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Historial Médico
          </h1>
          <p className="text-text-subtle">
            Registros completos de consultas y tratamientos
          </p>
        </div>
        {patient && (
          <PatientInfo
            patient={patient}
            formatDate={formatDate}
            calculateAge={calculateAge}
            getGenderText={getGenderText}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SpecialtyList
              specialties={specialties}
              medicalHistory={medicalHistory}
              activeSpecialty={activeSpecialty}
              setActiveSpecialty={setActiveSpecialty}
            />
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

export default PatientMedicalHistory;
