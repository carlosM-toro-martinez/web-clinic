import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApiMutation from "./useApiMutation";
import historyAddService from "../async/services/post/historyAddService";
import diagnosisService from "../async/services/get/diagnosisService";
import { useQuery } from "@tanstack/react-query";

export const useMedicalHistory = (patients = [], locationState) => {
  const navigate = useNavigate();
  const {
    specialtyId,
    doctorId,
    patientId,
    patient,
    specialty,
    doctor,
    appointmentsId,
  } = locationState || {};

  const {
    data: diagnosisResponse,
    isLoading: isLoadingDiagnosis,
    isError: isErrorDiagnosis,
    error: diagnosisError,
    refetch,
  } = useQuery({
    queryKey: ["diagnosis"],
    queryFn: diagnosisService,
  });

  const { mutate, isPending, message, type, reset, data } =
    useApiMutation(historyAddService);

  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [initialNote, setInitialNote] = useState("");
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [subjectiveNote, setSubjectiveNote] = useState("");
  const [objectiveNote, setObjectiveNote] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [localError, setLocalError] = useState("");

  const [vitals, setVitals] = useState({
    weight: "",
    height: "",
    abdominalCircumference: "",
    imc: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    temperature: "",
  });

  const [extendedFields, setExtendedFields] = useState({
    // Antecedentes
    pathologicalHistory: "",
    surgicalHistory: "",
    habitualMedication: "",

    // Gineco-obstétricos
    menarcheAge: "",
    lastMenstrualPeriod: "",
    obstetricHistory: "",

    // Hábitos
    diet: "",
    physicalActivity: "",
    smokes: false,
    alcohol: false,
    drugs: false,
    drugsDetails: "",

    // Estudios complementarios
    labResults: "",
    imagingResults: "",
    otherStudies: "",

    // Conducta extendida
    nonPharmacologicalTreatment: "",
    requestedStudies: "",
    referrals: "",
    followUp: "",
  });

  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (data && data.ok) {
      navigate("/consultas");
    }
  }, [data, navigate]);

  // Calcular edad automáticamente
  const patientAge = useMemo(() => {
    if (!patient?.birthDate) return "";
    const today = new Date();
    const birth = new Date(patient.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age.toString();
  }, [patient]);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return patients.filter((p) => {
      return (
        p.firstName.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        (p.ciNumber && p.ciNumber.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, patients]);

  const updateExtendedField = (field, value) => {
    setExtendedFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const goNext = () => {
    setLocalError("");

    if (step === 1 && !patientId) {
      setLocalError("Se requiere un paciente para continuar.");
      return;
    }

    if (step === 4) {
      if (diagnoses.length === 0) {
        setLocalError("Agrega al menos un diagnóstico.");
        return;
      }
      if (!visitDate) {
        setLocalError("Selecciona la fecha de la visita.");
        return;
      }
    }

    setStep((s) => Math.min(5, s + 1));
  };

  const goBack = () => {
    setLocalError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const addDiagnosis = (diagnosisId, isPrimary = false) => {
    if (!diagnosisId) return;
    const newList = diagnoses.map((d) =>
      isPrimary ? { ...d, isPrimary: false } : d
    );
    newList.push({ diagnosisId, isPrimary });
    setDiagnoses(newList);
  };

  const removeDiagnosis = (idx) => {
    setDiagnoses((prev) => prev.filter((_, i) => i !== idx));
  };

  const togglePrimaryDiagnosis = (idx) => {
    setDiagnoses((prev) =>
      prev.map((d, i) => ({
        ...d,
        isPrimary: i === idx ? !d.isPrimary : false,
      }))
    );
  };

  const addPrescription = (pres) => {
    if (!pres?.medicationName) return;
    setPrescriptions((p) => [...p, pres]);
  };

  const removePrescription = (idx) => {
    setPrescriptions((p) => p.filter((_, i) => i !== idx));
  };

  const handleVitalChange = (name, value) => {
    setVitals((v) => {
      const next = { ...v, [name]: value };

      if (name === "weight" || name === "height") {
        const weight = parseFloat(next.weight);
        const height = parseFloat(next.height);
        if (!isNaN(weight) && !isNaN(height) && height > 0) {
          const imcVal = +(weight / (height * height)).toFixed(1);
          next.imc = imcVal;
        } else {
          next.imc = "";
        }
      }

      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    // Evitar envíos accidentales si no estamos en el paso final
    if (step !== 5) {
      // opcional: console.log para debugging
      // console.log("Submit ignorado: no estamos en el paso 5", { step });
      return;
    }

    if (!specialtyId) {
      setLocalError("Falta el id de especialidad (specialtyId).");
      return;
    }
    if (!doctorId) {
      setLocalError("Falta el id de doctor (doctorId).");
      return;
    }
    if (diagnoses.length === 0) {
      setLocalError("Agrega al menos un diagnóstico.");
      return;
    }

    // Si tu flujo requiere al menos una prescripción en el paso 5, valida también:
    if (prescriptions.length === 0) {
      setLocalError("Agrega al menos una prescripción antes de guardar.");
      return;
    }

    const payload = {
      medicalHistoryData: {
        patientId: patientId,
        specialtyId: specialtyId,
        createdById: doctorId,
        note: initialNote || "",
      },
      historyEntryData: {
        doctorId: doctorId,
        visitDate: new Date(visitDate).toISOString(),
        chiefComplaint: chiefComplaint || "",
        subjectiveNote: subjectiveNote || "",
        objectiveNote: objectiveNote || "",
        assessment: assessment || "",
        plan: plan || "",
        vitals: {
          weight: vitals.weight ? Number(vitals.weight) : null,
          height: vitals.height ? Number(vitals.height) : null,
          abdominalCircumference: vitals.abdominalCircumference
            ? Number(vitals.abdominalCircumference)
            : null,
          imc: vitals.imc ? Number(vitals.imc) : null,
          bloodPressureSystolic: vitals.bloodPressureSystolic || null,
          bloodPressureDiastolic: vitals.bloodPressureDiastolic || null,
          heartRate: vitals.heartRate || null,
          respiratoryRate: vitals.respiratoryRate || null,
          temperature: vitals.temperature || null,
        },
        extendedFields: {
          // Antecedentes
          pathologicalHistory: extendedFields.pathologicalHistory,
          surgicalHistory: extendedFields.surgicalHistory,
          habitualMedication: extendedFields.habitualMedication,

          // Gineco-obstétricos
          menarcheAge: extendedFields.menarcheAge,
          lastMenstrualPeriod: extendedFields.lastMenstrualPeriod,
          obstetricHistory: extendedFields.obstetricHistory,

          // Hábitos
          diet: extendedFields.diet,
          physicalActivity: extendedFields.physicalActivity,
          smokes: extendedFields.smokes,
          alcohol: extendedFields.alcohol,
          drugs: extendedFields.drugs,
          drugsDetails: extendedFields.drugsDetails,

          // Estudios
          labResults: extendedFields.labResults,
          imagingResults: extendedFields.imagingResults,
          otherStudies: extendedFields.otherStudies,

          // Conducta
          nonPharmacologicalTreatment:
            extendedFields.nonPharmacologicalTreatment,
          requestedStudies: extendedFields.requestedStudies,
          referrals: extendedFields.referrals,
          followUp: extendedFields.followUp,
        },
      },
      diagnoses: diagnoses.map((d) => ({
        diagnosisId: d.diagnosisId,
        isPrimary: !!d.isPrimary,
      })),
      prescriptions: prescriptions.map((p) => ({
        medicationName: p.medicationName,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
      })),
      appointmentId: appointmentsId || null,
    };

    // debugging
    console.log("Payload a enviar:", payload);
    mutate(payload);
  };

  return {
    // State
    step,
    searchTerm,
    selectedPatient,
    initialNote,
    visitDate,
    chiefComplaint,
    subjectiveNote,
    objectiveNote,
    assessment,
    plan,
    vitals,
    diagnoses,
    prescriptions,
    extendedFields,
    localError,
    isPending,
    message,
    type,
    patientAge,

    // State setters
    setSearchTerm,
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
    filteredPatients,
    specialtyId,
    doctorId,
    patientId,
    patient,
    specialty,
    doctor,
    isLoadingDiagnosis,
    isErrorDiagnosis,
    diagnosisError,
    diagnosisResponse,
    appointmentsId,
  };
};
