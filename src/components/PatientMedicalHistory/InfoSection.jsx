import React from "react";

const InfoSection = ({ title, content }) => (
  <div>
    <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
    <div className="text-text-secondary bg-surface-variant rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
      {content}
    </div>
  </div>
);

export default InfoSection;
