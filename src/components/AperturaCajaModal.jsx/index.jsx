import React, { useContext, useState } from "react";
import { X } from "lucide-react";
import { MainContext } from "../../context/MainContext";

const AperturaCajaModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  refetch,
}) => {
  const { user } = useContext(MainContext);

  const [formData, setFormData] = useState({
    openingAmount: "",
    notes: "Apertura de caja",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = user.id;
    const payload = {
      userId,
      openingAmount: formData.openingAmount,
      actualAmount: formData.openingAmount,
      notes: formData.notes,
    };
    onSubmit(payload);
    refetch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-background)] rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Apertura de Caja
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-hover)]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="openingAmount"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Monto de Apertura
              </label>
              <input
                type="number"
                id="openingAmount"
                name="openingAmount"
                step="0.01"
                min="0"
                required
                value={formData.openingAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Ej: 100.00"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Notas
              </label>
              <textarea
                id="notes"
                name="notes"
                required
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-transparent text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 cursor-pointer py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 cursor-pointer py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Abriendo..." : "Abrir Caja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AperturaCajaModal;
