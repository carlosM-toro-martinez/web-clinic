import React from "react";
import PatientCreateForm from "../PatientCreateFormComponent";

const PatientCreateModal = ({ isOpen, onClose, onPatientCreated }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-background)] shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--color-border)]">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-[var(--color-text-primary)]"></p>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer text-lg"
            >
              ✕
            </button>
          </div>
          <PatientCreateForm onSuccess={onPatientCreated} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

export default PatientCreateModal;
