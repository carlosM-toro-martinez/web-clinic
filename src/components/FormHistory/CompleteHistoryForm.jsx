import React from "react";
import Step1PatientData from "../medical-history/Step1PatientData";
import Step2Antecedents from "../medical-history/Step2Antecedents";
import Step3PhysicalExam from "../medical-history/Step3PhysicalExam";
import Step4Diagnosis from "../medical-history/Step4Diagnosis";
import Step5Treatment from "../medical-history/Step5Treatment";

const CompleteHistoryForm = ({
  patient,
  patientHistory,
  specialtyId,
  doctorId,
  initialNote,
  onInitialNoteChange,
  patientAge,
  visitDate,
  onVisitDateChange,
  specialty,
  doctor,
  objectiveNote,
  onObjectiveNoteChange,
  extendedFields,
  onExtendedFieldChange,
  chiefComplaint,
  onChiefComplaintChange,
  vitals,
  onVitalChange,
  subjectiveNote,
  onSubjectiveNoteChange,
  assessment,
  onAssessmentChange,
  plan,
  onPlanChange,
  diagnoses,
  onAddDiagnosis,
  onRemoveDiagnosis,
  onTogglePrimaryDiagnosis,
  diagnosisResponse,
  isLoadingDiagnosis,
  isErrorDiagnosis,
  prescriptions,
  onAddPrescription,
  onRemovePrescription,
}) => {
  return (
    <div className="space-y-8">
      <Step1PatientData
        patient={patientHistory}
        specialtyId={specialtyId}
        doctorId={doctorId}
        initialNote={initialNote}
        onInitialNoteChange={onInitialNoteChange}
        patientAge={patientAge}
        visitDate={visitDate}
        onVisitDateChange={onVisitDateChange}
        specialty={specialty}
        doctor={doctor}
        objectiveNote={objectiveNote}
        onObjectiveNoteChange={onObjectiveNoteChange}
      />

      <Step2Antecedents
        extendedFields={extendedFields}
        onExtendedFieldChange={onExtendedFieldChange}
        chiefComplaint={chiefComplaint}
        onChiefComplaintChange={onChiefComplaintChange}
      />

      <Step3PhysicalExam
        vitals={vitals}
        onVitalChange={onVitalChange}
        extendedFields={extendedFields}
        onExtendedFieldChange={onExtendedFieldChange}
        subjectiveNote={subjectiveNote}
        onSubjectiveNoteChange={onSubjectiveNoteChange}
        objectiveNote={objectiveNote}
        onObjectiveNoteChange={onObjectiveNoteChange}
      />

      <Step4Diagnosis
        assessment={assessment}
        onAssessmentChange={onAssessmentChange}
        plan={plan}
        onPlanChange={onPlanChange}
        diagnoses={diagnoses}
        onAddDiagnosis={onAddDiagnosis}
        onRemoveDiagnosis={onRemoveDiagnosis}
        onTogglePrimaryDiagnosis={onTogglePrimaryDiagnosis}
        diagnosisResponse={diagnosisResponse}
        isLoadingDiagnosis={isLoadingDiagnosis}
        isErrorDiagnosis={isErrorDiagnosis}
      />

      <Step5Treatment
        prescriptions={prescriptions}
        onAddPrescription={onAddPrescription}
        onRemovePrescription={onRemovePrescription}
        extendedFields={extendedFields}
        onExtendedFieldChange={onExtendedFieldChange}
        patient={patient}
        doctor={doctor}
        specialty={specialty}
      />
    </div>
  );
};

export default CompleteHistoryForm;
