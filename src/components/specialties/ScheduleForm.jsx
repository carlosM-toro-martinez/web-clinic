import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, Plus, X, Users, Calendar } from "lucide-react";

export default function ScheduleForm({
  onSubmit,
  isSubmitting,
  initialData = [],
  onCancel,
  doctors = [],
  specialtyId, // Nueva prop: ID de la especialidad actual
}) {
  // Filtrar doctores que pertenecen a esta especialidad
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialties?.some((spec) => spec.specialtyId === specialtyId)
  );

  const [schedules, setSchedules] = useState(
    initialData.length > 0
      ? initialData
      : filteredDoctors.length > 0
      ? [
          {
            doctorId: filteredDoctors[0]?.id || "",
            dayOfWeek: 1,
            startTime: "08:00",
            endTime: "12:00",
          },
        ]
      : []
  );

  const [appointmentDuration, setAppointmentDuration] = useState(30); // Duración en minutos
  const [generatedAppointments, setGeneratedAppointments] = useState([]);

  useEffect(() => {
    // Si no hay doctores para esta especialidad, mostramos mensaje
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

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleRemoveSchedule = (index) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  const validateSchedule = (schedule) => {
    if (!schedule.doctorId || !schedule.startTime || !schedule.endTime) {
      return false;
    }

    // Validar horas
    const start = new Date(`1970/01/01 ${schedule.startTime}`);
    const end = new Date(`1970/01/01 ${schedule.endTime}`);
    return start < end;
  };

  // Función para generar citas de 30 minutos
  const generateTimeSlots = (startTime, endTime, duration = 30) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      // Formatear hora actual
      const slotStart = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      // Calcular fin de la cita
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
        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
        });
      }

      // Avanzar en la duración de la cita
      currentMinute += duration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    return slots;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los schedules
    const validSchedules = schedules.filter(validateSchedule);

    if (validSchedules.length === 0) {
      alert("Debes completar al menos un horario válido");
      return;
    }

    // Generar array de citas individuales (slots de 30 minutos)
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

    // Mostrar preview de citas generadas
    setGeneratedAppointments(appointmentsToSend);

    // Confirmar antes de enviar
    const confirmSend = window.confirm(
      `Se generarán ${appointmentsToSend.length} citas de ${appointmentDuration} minutos.\n¿Deseas continuar?`
    );

    if (confirmSend) {
      onSubmit(appointmentsToSend); // Enviamos ARRAY de citas individuales
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = filteredDoctors.find((d) => d.id === doctorId);
    return doctor
      ? `Dr(a). ${doctor.firstName} ${doctor.lastName}`
      : "No seleccionado";
  };

  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const calculateTotalAppointments = () => {
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
  };

  // Si no hay doctores para esta especialidad
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
            {[30, 45, 60].map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => setAppointmentDuration(duration)}
                className={`px-3 py-1 text-xs rounded-lg transition ${
                  appointmentDuration === duration
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de horarios a agregar */}
      <div className="p-4">
        <div className="space-y-3 mb-4 pr-1">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="p-3 border border-gray-300 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Horario #{index + 1}
                </span>
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-7 h-7" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-1">
                  <div className="relative">
                    <select
                      className="input text-xs py-1 h-12"
                      value={schedule.doctorId}
                      onChange={(e) =>
                        handleScheduleChange(index, "doctorId", e.target.value)
                      }
                    >
                      <option value="">Doctor</option>
                      {filteredDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Día de la semana */}
                <div>
                  <select
                    className="input text-xs py-1 h-12"
                    value={schedule.dayOfWeek}
                    onChange={(e) =>
                      handleScheduleChange(index, "dayOfWeek", e.target.value)
                    }
                  >
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                    <option value="6">Sábado</option>
                    <option value="0">Domingo</option>
                  </select>
                </div>

                {/* Horas */}
                <div className="flex gap-1">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      className="input text-xs pl-7 py-1 h-12"
                      value={schedule.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <span className="self-center text-gray-400 text-xs">-</span>
                  <div className="relative flex-1">
                    <input
                      type="time"
                      className="input text-xs pl-7 py-1 h-12"
                      value={schedule.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Vista previa de citas generadas */}
              {validateSchedule(schedule) && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-600">
                      {daysOfWeek[schedule.dayOfWeek] || "Lunes"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                  </div>

                  {/* Mostrar citas generadas para este horario */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generateTimeSlots(
                      schedule.startTime,
                      schedule.endTime,
                      appointmentDuration
                    )
                      .slice(0, 6) // Mostrar solo las primeras 6 para no saturar
                      .map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {slot.startTime}
                        </span>
                      ))}
                    {generateTimeSlots(
                      schedule.startTime,
                      schedule.endTime,
                      appointmentDuration
                    ).length > 6 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +
                        {generateTimeSlots(
                          schedule.startTime,
                          schedule.endTime,
                          appointmentDuration
                        ).length - 6}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {
                      generateTimeSlots(
                        schedule.startTime,
                        schedule.endTime,
                        appointmentDuration
                      ).length
                    }{" "}
                    citas de {appointmentDuration} min
                  </div>
                </div>
              )}

              {/* Validación */}
              {!validateSchedule(schedule) &&
                schedule.doctorId &&
                schedule.startTime &&
                schedule.endTime && (
                  <div className="text-red-500 text-xs mt-1">
                    La hora de inicio debe ser anterior a la hora de fin
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Botón para agregar más horarios */}
        <button
          type="button"
          onClick={handleAddSchedule}
          className="flex items-center text-blue-600 text-xs font-medium mb-4 hover:underline"
        >
          <Plus className="w-3 h-3 mr-1" />
          Agregar otro bloque horario
        </button>

        {/* Resumen */}
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

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={
              isSubmitting || schedules.filter(validateSchedule).length === 0
            }
            className="btn-primary text-xs px-3 py-2 flex-1"
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

      {/* Preview de citas generadas (solo para debugging) */}
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
