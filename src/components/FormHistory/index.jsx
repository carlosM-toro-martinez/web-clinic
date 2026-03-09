import { useLocation } from "react-router-dom";
import { useMedicalHistory } from "../../hocks/useMedicalHistory";
import StepIndicator from "../medical-history/StepIndicator";
import Step1PatientData from "../medical-history/Step1PatientData";
import Step2Antecedents from "../medical-history/Step2Antecedents";
import Step3PhysicalExam from "../medical-history/Step3PhysicalExam";
import Step4Diagnosis from "../medical-history/Step4Diagnosis";
import Step5Treatment from "../medical-history/Step5Treatment";
import AlertMessage from "../common/AlertMessage";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContext";
import CompleteHistoryForm from "./CompleteHistoryForm";

const FormHistory = ({ patients = [], initialContext = null }) => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState("steps"); // "steps" o "complete"

  const {
    // State
    step,
    initialNote,
    visitDate,
    vitals,
    chiefComplaint,
    subjectiveNote,
    objectiveNote,
    assessment,
    plan,
    diagnoses,
    prescriptions,
    extendedFields,
    localError,
    isPending,
    message,
    type,
    patientAge,

    // State setters
    setInitialNote,
    setVisitDate,
    setChiefComplaint,
    setSubjectiveNote,
    setObjectiveNote,
    setAssessment,
    setPlan,

    // Actions
    goNext,
    goBack,
    addDiagnosis,
    removeDiagnosis,
    togglePrimaryDiagnosis,
    addPrescription,
    removePrescription,
    handleVitalChange,
    handleSubmit,
    reset,
    updateExtendedField,

    // Data
    specialtyId,
    doctorId,
    patient,
    specialty,
    doctor,
    isLoadingDiagnosis,
    isErrorDiagnosis,
    diagnosisError,
    diagnosisResponse,
  } = useMedicalHistory(
    patients,
    initialContext ?? location.state ?? {},
    viewMode,
  );

  const { patientHistory, setPatientHistory } = useContext(MainContext);

  useEffect(() => {
    if (patient && patientHistory?.id !== patient.id) {
      setPatientHistory({ ...patient });
    }
  }, [patient, patientHistory?.id, setPatientHistory]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1PatientData
            patient={patientHistory}
            specialtyId={specialtyId}
            doctorId={doctorId}
            initialNote={initialNote}
            onInitialNoteChange={setInitialNote}
            onObjectiveNoteChange={setObjectiveNote}
            patientAge={patientAge}
            visitDate={visitDate}
            onVisitDateChange={setVisitDate}
            specialty={specialty}
            doctor={doctor}
            objectiveNote={objectiveNote}
          />
        );
      case 2:
        return (
          <Step2Antecedents
            extendedFields={extendedFields}
            onExtendedFieldChange={updateExtendedField}
            chiefComplaint={chiefComplaint}
            onChiefComplaintChange={setChiefComplaint}
          />
        );
      case 3:
        return (
          <Step3PhysicalExam
            vitals={vitals}
            onVitalChange={handleVitalChange}
            extendedFields={extendedFields}
            onExtendedFieldChange={updateExtendedField}
            subjectiveNote={subjectiveNote}
            onSubjectiveNoteChange={setSubjectiveNote}
            objectiveNote={objectiveNote}
            onObjectiveNoteChange={setObjectiveNote}
          />
        );
      case 4:
        return (
          <Step4Diagnosis
            assessment={assessment}
            onAssessmentChange={setAssessment}
            plan={plan}
            onPlanChange={setPlan}
            diagnoses={diagnoses}
            onAddDiagnosis={addDiagnosis}
            onRemoveDiagnosis={removeDiagnosis}
            onTogglePrimaryDiagnosis={togglePrimaryDiagnosis}
            diagnosisResponse={diagnosisResponse}
            isLoadingDiagnosis={isLoadingDiagnosis}
            isErrorDiagnosis={isErrorDiagnosis}
          />
        );
      case 5:
        return (
          <Step5Treatment
            prescriptions={prescriptions}
            onAddPrescription={addPrescription}
            onRemovePrescription={removePrescription}
            extendedFields={extendedFields}
            onExtendedFieldChange={updateExtendedField}
            patient={patient}
            doctor={doctor}
            specialty={specialty}
          />
        );
      default:
        return null;
    }
  };

  const handleFormKeyDown = (e) => {
    // Prevenir que se envíe el formulario si presionas Enter en un input y no estamos en paso 5
    if (e.key === "Enter" && step !== 5 && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleFormKeyDown}
      className="max-w-6xl mx-auto mt-4 p-4 sm:p-6 bg-[var(--color-background)] rounded-2xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Historia Clínica — Nueva
          </h2>
          <p className="text-[var(--color-text-subtle)] mt-1">
            Complete todos los campos para registrar la historia clínica del
            paciente
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Selector de Modo de Vista */}
          <div className="flex items-center gap-2 bg-[var(--color-surface)] px-3 py-2 rounded-xl border border-[var(--color-border)]">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Ver como:
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-1 rounded-lg bg-white border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="steps">📋 Por Pasos (Recomendado)</option>
              <option value="complete">📄 Todo en Uno</option>
            </select>
          </div>

          {/* Indicador de Paso (solo en modo pasos) */}
          {viewMode === "steps" && (
            <div className="flex items-center gap-3 bg-[var(--color-surface)] px-4 py-2 rounded-xl border border-[var(--color-border)]">
              <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                Paso {step} de 5
              </div>
            </div>
          )}
        </div>
      </div>

      {viewMode === "steps" && <StepIndicator step={step} />}

      <div className="space-y-6 mb-8">
        {viewMode === "steps" ? (
          renderStep()
        ) : (
          <CompleteHistoryForm
            patient={patient}
            patientHistory={patientHistory}
            specialtyId={specialtyId}
            doctorId={doctorId}
            initialNote={initialNote}
            onInitialNoteChange={setInitialNote}
            patientAge={patientAge}
            visitDate={visitDate}
            onVisitDateChange={setVisitDate}
            specialty={specialty}
            doctor={doctor}
            objectiveNote={objectiveNote}
            onObjectiveNoteChange={setObjectiveNote}
            extendedFields={extendedFields}
            onExtendedFieldChange={updateExtendedField}
            chiefComplaint={chiefComplaint}
            onChiefComplaintChange={setChiefComplaint}
            vitals={vitals}
            onVitalChange={handleVitalChange}
            subjectiveNote={subjectiveNote}
            onSubjectiveNoteChange={setSubjectiveNote}
            assessment={assessment}
            onAssessmentChange={setAssessment}
            plan={plan}
            onPlanChange={setPlan}
            diagnoses={diagnoses}
            onAddDiagnosis={addDiagnosis}
            onRemoveDiagnosis={removeDiagnosis}
            onTogglePrimaryDiagnosis={togglePrimaryDiagnosis}
            diagnosisResponse={diagnosisResponse}
            isLoadingDiagnosis={isLoadingDiagnosis}
            isErrorDiagnosis={isErrorDiagnosis}
            prescriptions={prescriptions}
            onAddPrescription={addPrescription}
            onRemovePrescription={removePrescription}
          />
        )}
      </div>

      <div className="mb-6">
        {localError && (
          <div className="bg-[var(--color-accent-red-light)] border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-xl">
            {localError}
          </div>
        )}
        {message && (
          <AlertMessage message={message} type={type} onClose={reset} />
        )}
      </div>
      <FormActions
        step={step}
        onBack={goBack}
        onNext={goNext}
        isPending={isPending}
        viewMode={viewMode}
      />
    </form>
  );
};

const FormActions = ({ step, onBack, onNext, isPending, viewMode }) => (
  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-[var(--color-border)]">
    <div>
      {viewMode === "steps" && step > 1 && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 cursor-pointer rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition font-medium"
        >
          ← Volver
        </button>
      )}
    </div>

    <div className="flex gap-3">
      {viewMode === "steps" ? (
        step < 5 ? (
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 cursor-pointer rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)] transition font-medium shadow-sm"
          >
            Continuar →
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={isPending}
            className="px-8 py-3 cursor-pointer rounded-xl text-white bg-[var(--color-success)] hover:bg-[#0da271] disabled:bg-[var(--color-text-subtle)] disabled:cursor-not-allowed transition font-medium shadow-sm"
          >
            {isPending ? "🔄 Guardando..." : "✅ Guardar Historia Clínica"}
          </button>
        )
      ) : (
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 cursor-pointer rounded-xl text-white bg-[var(--color-success)] hover:bg-[#0da271] disabled:bg-[var(--color-text-subtle)] disabled:cursor-not-allowed transition font-medium shadow-sm"
        >
          {isPending ? "🔄 Guardando..." : "✅ Guardar Historia Clínica"}
        </button>
      )}
    </div>
  </div>
);

export default FormHistory;
