import React from "react";
import { formatDate } from "../../utils/consultationFormatter";

const ConsultationBasicInfo = ({ entry }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-surface-variant rounded-lg p-3">
        <div className="text-xs text-text-subtle mb-1">Fecha de visita</div>
        <div className="font-medium text-text-primary">
          {formatDate(entry.visitDate)}
        </div>
      </div>
      <div className="bg-surface-variant rounded-lg p-3">
        <div className="text-xs text-text-subtle mb-1">Médico tratante</div>
        <div className="font-medium text-text-primary">
          Dr. {entry.doctor.firstName} {entry.doctor.lastName}
        </div>
      </div>
      <div className="bg-surface-variant rounded-lg p-3">
        <div className="text-xs text-text-subtle mb-1">ID de consulta</div>
        <div className="font-medium text-text-primary font-mono text-sm">
          {entry.id.substring(0, 8)}...
        </div>
      </div>
    </div>
  );
};

export default ConsultationBasicInfo;
