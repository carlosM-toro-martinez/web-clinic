import normalizeText from "../utils/normalizeText";
import { useState, useMemo, useContext } from "react";
import { MainContext } from "../context/MainContext";
import useApiMutation from "./useApiMutation";
import appointmentAddService from "../async/services/post/appointmentAddService";

export const useAppointmentForm = (patients, specialties) => {
  const { user, cashRegister } = useContext(MainContext);
  const { mutate, isPending, message, type, reset } = useApiMutation(
    appointmentAddService,
  );

  const [formState, setFormState] = useState({
    searchTerm: "",
    selectedPatient: null,
    selectedSpecialty: null,
    selectedFee: null,
    selectedSchedule: null,
    selectedDate: null,
    reservationAmount: "",
    localError: "",
    showPatientModal: false,
  });

  const updateFormState = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const filteredPatients = useMemo(() => {
    return patients?.filter((p) => {
      const term = normalizeText(formState.searchTerm).trim();
      return (
        normalizeText(p.firstName).includes(term) ||
        normalizeText(p.lastName).includes(term) ||
        normalizeText(`${p.firstName ?? ""} ${p.lastName ?? ""}`).includes(term) ||
        (p.ciNumber && normalizeText(p.ciNumber).includes(term))
      );
    });
  }, [formState.searchTerm, patients]);

  const getDayOfWeek = (date) => date.getDay();

  const filteredSchedules = useMemo(() => {
    if (!formState.selectedSpecialty || !formState.selectedDate) return [];

    return formState.selectedSpecialty.schedules.filter(
      (s) => s.isActive && s.dayOfWeek === getDayOfWeek(formState.selectedDate),
    );
  }, [formState.selectedSpecialty, formState.selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormState({ localError: "" });

    const {
      selectedPatient,
      selectedSpecialty,
      selectedSchedule,
      selectedFee,
      selectedDate,
      reservationAmount,
    } = formState;

    if (
      !selectedPatient ||
      !selectedSpecialty ||
      !selectedSchedule ||
      !selectedFee ||
      !selectedDate
    ) {
      updateFormState({
        localError: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    const total = Number(selectedFee.amount);
    const reserva = Number(reservationAmount || 0);

    if (Number.isNaN(reserva) || reserva < 0) {
      updateFormState({ localError: "El monto de reserva debe ser un número válido." });
      return;
    }
    if (reserva > total) {
      updateFormState({ localError: "El monto de reserva no puede ser mayor al total." });
      return;
    }
    if (reserva > 0 && !cashRegister?.data?.id) {
      updateFormState({
        localError: "No hay una caja abierta. Abre la caja antes de registrar un cobro.",
      });
      return;
    }

    const [startHour, startMinute] = selectedSchedule.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = selectedSchedule.endTime
      .split(":")
      .map(Number);

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const payload = {
      patientId: selectedPatient.id,
      doctorId: selectedSchedule.doctor.id,
      specialtyId: selectedSpecialty.id,
      scheduleId: selectedSchedule.id,
      scheduledStart: startDateTime.toISOString(),
      scheduledEnd: endDateTime.toISOString(),
      createdById: user.id,
      reservationAmount: reserva,
      totalAmount: total,
      remainingAmount: total - reserva,
      notes: `Monto restante a pagar: ${total - reserva} BOB`,
      status: "PENDING",
      source: "reception",
      userId: user.id,
      cashRegisterId: cashRegister?.data?.id,
      type: "INCOME",
      amount: reserva,
      description: "Pago por consulta",
    };

    mutate(payload);
  };

  const handlePatientCreated = (newPatient) => {
    updateFormState({
      selectedPatient: newPatient,
      showPatientModal: false,
      searchTerm: "",
    });
  };

  return {
    formState,
    updateFormState,
    filteredPatients,
    filteredSchedules,
    handleSubmit,
    handlePatientCreated,
    isPending,
    message,
    type,
    reset,
  };
};
