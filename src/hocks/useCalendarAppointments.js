import { useState, useMemo } from "react";

export const useCalendarAppointments = (
  specialties = [],
  appointments = []
) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todos");

  const formattedDate = useMemo(() => {
    return selectedDate?.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const daysWithAppointments = useMemo(() => {
    const daysSet = new Set();

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.scheduledStart);
      const normalizedDate = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate()
      );
      daysSet.add(normalizedDate.getTime());
    });

    return Array.from(daysSet).map((timestamp) => new Date(timestamp));
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.scheduledStart);
      const isSameDay =
        appointmentDate?.getFullYear() === selectedDate?.getFullYear() &&
        appointmentDate?.getMonth() === selectedDate?.getMonth() &&
        appointmentDate?.getDate() === selectedDate?.getDate();

      const matchesSpecialty =
        selectedSpecialty === "Todos" ||
        appointment.specialty?.name === selectedSpecialty;

      return isSameDay && matchesSpecialty;
    });
  }, [appointments, selectedDate, selectedSpecialty]);

  const tabs = useMemo(() => {
    return ["Todos", ...specialties.map((s) => s.name)];
  }, [specialties]);

  return {
    selectedDate,
    setSelectedDate,
    selectedSpecialty,
    setSelectedSpecialty,
    filteredAppointments,
    tabs,
    formattedDate,
    daysWithAppointments,
  };
};
