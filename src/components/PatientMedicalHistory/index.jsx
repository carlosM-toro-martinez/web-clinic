import React, { useRef, useState } from "react";
import PatientInfo from "./PatientInfo";
import SpecialtyList from "./SpecialtyList";
import SpecialtyHistory from "./SpecialtyHistory";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import PrintableClinicalHistory from "../medical-history/PrintableClinicalHistory";
import ClinicalHistoryPDFModal from "../medical-history/ClinicalHistoryPDFModal";
import { withHtml2PdfColorFallback } from "../../utils/pdfSanitizer";

const PatientMedicalHistory = ({ medicalHistory }) => {
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);
  const [showHistoryPreview, setShowHistoryPreview] = useState(false);
  const historyPrintRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return `${age} años`;
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "M":
        return "Masculino";
      case "F":
        return "Femenino";
      default:
        return "No especificado";
    }
  };

  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              No hay historial médico disponible
            </h2>
            <p className="text-text-subtle">
              El paciente no tiene registros médicos en el sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const patient = medicalHistory[0]?.patient;
  const specialties = medicalHistory.map((history) => history.specialty);

  const handleHistoryPrint = useReactToPrint({
    contentRef: historyPrintRef,
    documentTitle: "",
    onAfterPrint: () => setShowHistoryPreview(false),
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  const handleHistoryPdfDownload = () => {
    if (!historyPrintRef.current) return;

    const patientName = `${patient?.firstName || "paciente"}_${patient?.lastName || ""}`
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();

    html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `historial_clinico_${patientName || "paciente"}_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: withHtml2PdfColorFallback({
          scale: 2,
          useCORS: true,
          letterRendering: true,
        }),
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(historyPrintRef.current)
      .save();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Historial Médico
            </h1>
            <p className="text-text-subtle">
              Registros completos de consultas y tratamientos
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHistoryPreview(true)}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer font-semibold shadow-sm"
          >
            🖨️ Imprimir / Exportar Todo
          </button>
        </div>
        {patient && (
          <PatientInfo
            patient={patient}
            formatDate={formatDate}
            calculateAge={calculateAge}
            getGenderText={getGenderText}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SpecialtyList
              specialties={specialties}
              medicalHistory={medicalHistory}
              activeSpecialty={activeSpecialty}
              setActiveSpecialty={setActiveSpecialty}
            />
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {activeSpecialty ? (
              <SpecialtyHistory
                specialtyHistory={activeSpecialty}
                activeEntry={activeEntry}
                setActiveEntry={setActiveEntry}
              />
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Selecciona una especialidad
                </h3>
                <p className="text-text-subtle">
                  Elige una especialidad del menú para ver el historial de
                  consultas
                </p>
              </div>
            )}
          </div>
        </div>

        <ClinicalHistoryPDFModal
          isOpen={showHistoryPreview}
          onClose={() => setShowHistoryPreview(false)}
        onDownloadPdf={handleHistoryPdfDownload}
        onPrint={handleHistoryPrint}
        title="Previsualización del Historial Clínico"
        subtitle="Documento completo del paciente listo para imprimir o exportar en PDF"
      >
          <PrintableClinicalHistory
            documentRef={historyPrintRef}
            patient={patient}
            specialtyHistories={medicalHistory}
            generatedAt={new Date().toISOString()}
            title="Historial Clínico Integral"
          />
        </ClinicalHistoryPDFModal>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
