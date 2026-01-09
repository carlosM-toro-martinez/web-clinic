import React from "react";

const SpecialtyList = ({
  specialties,
  medicalHistory,
  activeSpecialty,
  setActiveSpecialty,
}) => {
  return (
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
            className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg transition-all duration-200 ${
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
  );
};

export default SpecialtyList;
