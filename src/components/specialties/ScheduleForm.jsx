import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CalendarDays, Clock, Plus, Users, Calendar } from "lucide-react";
import ScheduleItem from "./ScheduleItem";

const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function ScheduleForm({
  onSubmit,
  isSubmitting,
  initialData = [],
  onCancel,
  doctors = [],
  specialtyId,
}) {
  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doctor) =>
        doctor.specialties?.some((spec) => spec.specialtyId === specialtyId)
      ),
    [doctors, specialtyId]
  );

  const [schedules, setSchedules] = useState(() => {
    if (initialData.length > 0) return initialData;
    if (filteredDoctors.length > 0) {
      return [
        {
          doctorId: filteredDoctors[0]?.id || "",
          dayOfWeek: 1,
          startTime: "08:00",
          endTime: "12:00",
        },
      ];
    }
    return [];
  });

  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [generatedAppointments, setGeneratedAppointments] = useState([]);

  useEffect(() => {
    if (filteredDoctors.length === 0) {
      setSchedules([]);
    }
  }, [filteredDoctors]);

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        doctorId: filteredDoctors[0]?.id || "",
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "12:00",
      },
    ]);
  };

  const handleScheduleChange = useCallback((index, field, value) => {
    setSchedules((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const handleRemoveSchedule = useCallback(
    (index) => {
      if (schedules.length > 1) {
        setSchedules((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [schedules.length]
  );

  const validateSchedule = useCallback((schedule) => {
    if (!schedule.doctorId || !schedule.startTime || !schedule.endTime) {
      return false;
    }
    const start = new Date(`1970/01/01 ${schedule.startTime}`);
    const end = new Date(`1970/01/01 ${schedule.endTime}`);
    return start < end;
  }, []);

  const generateTimeSlots = useCallback((startTime, endTime, duration) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const slotStart = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      let slotEndHour = currentHour;
      let slotEndMinute = currentMinute + duration;

      if (slotEndMinute >= 60) {
        slotEndHour += Math.floor(slotEndMinute / 60);
        slotEndMinute = slotEndMinute % 60;
      }

      const slotEnd = `${slotEndHour
        .toString()
        .padStart(2, "0")}:${slotEndMinute.toString().padStart(2, "0")}`;

      if (
        slotEndHour < endHour ||
        (slotEndHour === endHour && slotEndMinute <= endMinute)
      ) {
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }

      currentMinute += duration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  }, []);

  const getDoctorName = useCallback(
    (doctorId) => {
      const doctor = filteredDoctors.find((d) => d.id === doctorId);
      return doctor
        ? `Dr(a). ${doctor.firstName} ${doctor.lastName}`
        : "No seleccionado";
    },
    [filteredDoctors]
  );

  const calculateTotalAppointments = useCallback(() => {
    let total = 0;
    schedules.forEach((schedule) => {
      if (validateSchedule(schedule)) {
        const slots = generateTimeSlots(
          schedule.startTime,
          schedule.endTime,
          appointmentDuration
        );
        total += slots.length;
      }
    });
    return total;
  }, [schedules, appointmentDuration, validateSchedule, generateTimeSlots]);

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 1440) {
      // Máximo 24 horas (1440 minutos)
      setAppointmentDuration(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validSchedules = schedules.filter(validateSchedule);
    if (validSchedules.length === 0) {
      alert("Debes completar al menos un horario válido");
      return;
    }

    const appointmentsToSend = [];
    validSchedules.forEach((schedule) => {
      const timeSlots = generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        appointmentDuration
      );
      timeSlots.forEach((slot) => {
        appointmentsToSend.push({
          doctorId: schedule.doctorId,
          dayOfWeek: Number(schedule.dayOfWeek),
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      });
    });

    if (appointmentsToSend.length === 0) {
      alert("No se pudieron generar citas. Verifica los horarios.");
      return;
    }

    setGeneratedAppointments(appointmentsToSend);

    const confirmSend = window.confirm(
      `Se generarán ${appointmentsToSend.length} citas de ${appointmentDuration} minutos.\n¿Deseas continuar?`
    );

    if (confirmSend) {
      onSubmit(appointmentsToSend);
    }
  };

  if (filteredDoctors.length === 0) {
    return (
      <div className="mt-4 p-4 border border-yellow-200 rounded-xl bg-yellow-50">
        <div className="flex items-center mb-3">
          <Users className="w-5 h-5 mr-2 text-yellow-600" />
          <h4 className="font-semibold text-gray-700">
            No hay doctores asignados a esta especialidad
          </h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Para agregar horarios, primero debes asignar doctores a esta
          especialidad.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border border-gray-200 rounded-xl bg-white"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-700 text-sm">
                Agregar Horarios
              </h4>
              <p className="text-xs text-gray-500">
                {filteredDoctors.length} doctor(es) disponible(s)
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-bold text-blue-600">
              {calculateTotalAppointments()} citas
            </span>
          </div>
        </div>
      </div>

      {/* Configuración de duración */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">Duración por cita:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="1440"
              step="1"
              value={appointmentDuration}
              onChange={handleDurationChange}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Duración en minutos (1-1440)"
            />
            <span className="text-sm text-gray-600">minutos</span>
          </div>
        </div>
      </div>

      {/* Lista de horarios a agregar */}
      <div className="p-4">
        <div className="space-y-3 mb-4 pr-1">
          {schedules.map((schedule, index) => (
            <ScheduleItem
              key={index}
              index={index}
              schedule={schedule}
              filteredDoctors={filteredDoctors}
              appointmentDuration={appointmentDuration}
              onScheduleChange={handleScheduleChange}
              onRemoveSchedule={handleRemoveSchedule}
              showRemoveButton={schedules.length > 1}
              daysOfWeek={daysOfWeek}
              generateTimeSlots={generateTimeSlots}
              validateSchedule={validateSchedule}
              getDoctorName={getDoctorName}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSchedule}
          className="flex items-center text-blue-600 text-xs font-medium mb-4 hover:underline"
        >
          <Plus className="w-3 h-3 mr-1" />
          Agregar otro bloque horario
        </button>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-blue-600" />
              <span className="text-gray-600">Total citas:</span>
            </div>
            <span className="ml-2 font-semibold text-blue-700">
              {calculateTotalAppointments()} citas
            </span>

            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1 text-blue-600" />
              <span className="text-gray-600">Doctores únicos:</span>
            </div>
            <span className="ml-2 font-semibold text-blue-700">
              {
                [...new Set(schedules.map((s) => s.doctorId).filter(Boolean))]
                  .length
              }
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={
              isSubmitting || schedules.filter(validateSchedule).length === 0
            }
            className="btn-primary cursor-pointer text-xs px-3 py-2 flex-1"
          >
            {isSubmitting
              ? "Guardando..."
              : `Agregar ${calculateTotalAppointments()} citas`}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary text-xs px-3 py-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {generatedAppointments.length > 0 &&
        process.env.NODE_ENV === "development" && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs">
            <div className="font-semibold text-gray-700 mb-1">
              Preview de citas a enviar:
            </div>
            <div className="max-h-20 overflow-y-auto">
              {generatedAppointments.slice(0, 5).map((app, idx) => (
                <div key={idx} className="text-gray-600">
                  {daysOfWeek[app.dayOfWeek]} {app.startTime}-{app.endTime} -
                  Doctor: {getDoctorName(app.doctorId)}
                </div>
              ))}
              {generatedAppointments.length > 5 && (
                <div className="text-gray-500">
                  ... y {generatedAppointments.length - 5} más
                </div>
              )}
            </div>
          </div>
        )}
    </form>
  );
}
