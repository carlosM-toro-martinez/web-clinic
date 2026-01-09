import React from "react";

const VitalCard = ({ label, value, icon }) => (
  <div className="bg-surface-variant rounded-lg p-3 text-center hover:shadow-sm transition-shadow">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-sm font-medium text-text-primary mb-1">{label}</div>
    <div className="text-lg font-bold text-primary">{value}</div>
  </div>
);

export default VitalCard;
