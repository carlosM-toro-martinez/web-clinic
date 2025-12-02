// src/components/dashboard/metrics/MetricCard.jsx
import React from "react";

const MetricCard = ({ metric, delay = 0 }) => {
  const { title, value, subtitle, icon, trend, color } = metric;

  const getTrendColor = () => {
    if (!trend) return "text-[color:var(--color-text-subtle)]";
    return trend > 0 ? "text-green-500" : "text-red-500";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? "↗" : "↘";
  };

  return (
    <div
      className="card hover:shadow-lg transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
              <span className="text-lg">{icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--color-text-secondary)]">
                {title}
              </p>
              {trend && (
                <div
                  className={`text-xs ${getTrendColor()} flex items-center gap-1`}
                >
                  <span>{getTrendIcon()}</span>
                  <span>{Math.abs(trend)}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            <p className="text-2xl font-bold text-[color:var(--color-text-primary)]">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-[color:var(--color-text-subtle)] mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
