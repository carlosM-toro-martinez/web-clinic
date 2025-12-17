import { useState, useMemo, useContext } from "react";
import { MainContext } from "../context/MainContext";
import useApiMutation from "./useApiMutation";
import appointmentAddService from "../async/services/post/appointmentAddService";

export const useAppointmentForm = (patients, specialties) => {
  const { user, cashRegister } = useContext(MainContext);
  const { mutate, isPending, message, type, reset } = useApiMutation(
    appointmentAddService
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
      const term = formState.searchTerm?.toLowerCase();
      return (
        p.firstName?.toLowerCase().includes(term) ||
        p.lastName?.toLowerCase().includes(term) ||
        (p.ciNumber && p.ciNumber?.toLowerCase().includes(term))
      );
    });
  }, [formState.searchTerm, patients]);

  const getDayOfWeek = (date) => date.getDay();

  const filteredSchedules = useMemo(() => {
    if (!formState.selectedSpecialty || !formState.selectedDate) return [];

    return formState.selectedSpecialty.schedules.filter(
      (s) => s.isActive && s.dayOfWeek === getDayOfWeek(formState.selectedDate)
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
    const reserva = Number(reservationAmount);

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
    console.log("Submitting appointment with payload:", payload);

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
