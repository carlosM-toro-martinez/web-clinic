import React from "react";
import toTitleCase from "../../utils/toTitleCase";

const SpecialtyTabs = ({ tabs, selectedSpecialty, onSpecialtyChange }) => {
  return (
    <div className="flex border-b border-[var(--color-border)] mb-6 overflow-x-auto">
      {tabs.map((tab, index) => (
        <TabButton
          key={index}
          tab={tab}
          isSelected={selectedSpecialty === tab}
          onClick={() => onSpecialtyChange(tab)}
        />
      ))}
    </div>
  );
};

const TabButton = ({ tab, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 cursor-pointer text-sm font-medium whitespace-nowrap transition ${
      isSelected
        ? "tab-active"
        : "text-[color:var(--color-text-subtle)] hover:text-[color:var(--color-text-primary)]"
    }`}
  >
    {toTitleCase(tab)}
  </button>
);

export default SpecialtyTabs;
