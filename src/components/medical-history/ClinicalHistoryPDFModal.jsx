import React from "react";

const ClinicalHistoryPDFModal = ({
  isOpen,
  onClose,
  onPrint,
  onDownloadPdf,
  title = "Previsualización de Historia Clínica",
  subtitle = "Revise el documento antes de imprimir o exportar",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b bg-slate-50 no-print">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6">{children}</div>

        <div className="px-6 py-4 border-t bg-slate-50 no-print">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer font-semibold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="px-4 py-2.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition cursor-pointer font-semibold"
            >
              Exportar PDF
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer font-semibold"
            >
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalHistoryPDFModal;
