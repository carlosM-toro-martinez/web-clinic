// src/components/dashboard/metrics/MetricsGrid.jsx
import React from "react";
import MetricCard from "./MetricCard";

const MetricsGrid = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          delay={index * 100} // Para animaciones escalonadas
        />
      ))}
    </div>
  );
};

export default MetricsGrid;
