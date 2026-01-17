import React from "react";
import PrescriptionPreview from "./PrescriptionPreview";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

const PrescriptionPDFModal = ({
  showPreview,
  setShowPreview,
  prescriptions,
  prescriptionRef,
}) => {
  const handlePrint = useReactToPrint({
    contentRef: prescriptionRef,
    documentTitle: "Hola",
    pageStyle: `
      @page {
        size: A5;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .prescription-item {
          page-break-inside: avoid;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        resolve();
      });
    },
  });

  const handleSavePDF = () => {
    if (!prescriptionRef.current) return;

    const element = prescriptionRef.current;
    const opt = {
      margin: [15, 15],
      filename: `receta_medica_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a5",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!showPreview) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Previsualización de Receta
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {prescriptions.length} medicamento(s) prescrito(s)
            </p>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 cursor-pointer hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Cerrar previsualización"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <PrescriptionPreview prescriptions={prescriptions} />
        </div>

        <div className="border-t p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-3 cursor-pointer border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                setTimeout(() => handlePrint(), 100);
              }}
              className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPDFModal;
