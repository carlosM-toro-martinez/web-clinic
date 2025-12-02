// src/components/ui/Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[var(--color-border)] p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
