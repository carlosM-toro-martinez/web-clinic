import React from "react";
import { formatDate, formatDateTime } from "../../utils/consultationFormatter";

const ConsultationHeader = ({
  entry,
  isExpanded,
  onToggle,
  hasExtendedInfo,
  diagnosesCount,
  prescriptionsCount,
}) => {
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent-blue-light rounded-xl flex items-center justify-center">
          <span className="text-primary text-lg">📅</span>
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">
            Consulta del {formatDate(entry.visitDate)}
          </h3>
          <p className="text-sm text-text-subtle">
            Dr. {entry.doctor.firstName} {entry.doctor.lastName}
          </p>
          <p className="text-xs text-text-subtle mt-1">
            ID: {entry.id.substring(0, 8)}... • Creado:{" "}
            {formatDateTime(entry.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Indicadores rápidos */}
        {diagnosesCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-text-subtle bg-blue-50 px-3 py-1 rounded-full">
            <span>🩺</span>
            <span className="font-medium">{diagnosesCount} dx</span>
          </div>
        )}
        {prescriptionsCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-text-subtle bg-green-50 px-3 py-1 rounded-full">
            <span>💊</span>
            <span className="font-medium">{prescriptionsCount} rx</span>
          </div>
        )}
        {hasExtendedInfo && (
          <div className="flex items-center gap-1 text-sm text-text-subtle bg-purple-50 px-3 py-1 rounded-full">
            <span>📋</span>
            <span className="font-medium">Más info</span>
          </div>
        )}
        <button className="text-text-subtle hover:text-text-primary transition p-2">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>
    </div>
  );
};

export default ConsultationHeader;
