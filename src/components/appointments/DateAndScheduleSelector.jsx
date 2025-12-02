import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";

const DateAndScheduleSelector = ({
  selectedSpecialty,
  selectedDate,
  filteredSchedules,
  selectedSchedule,
  onDateChange,
  onScheduleSelect,
  appointments,
}) => {
  if (!selectedSpecialty) return null;

  const availableDays = useMemo(() => {
    if (!selectedSpecialty?.schedules) return [];

    const daysWithSchedules = selectedSpecialty.schedules
      .filter((schedule) => schedule.isActive)
      .map((schedule) => schedule.dayOfWeek);

    return [...new Set(daysWithSchedules)];
  }, [selectedSpecialty]);

  const isDayAvailable = (date) => {
    return availableDays.includes(date.getDay());
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || !isDayAvailable(date);
  };

  return (
    <>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
        Selecciona una fecha
      </label>

      <div className="flex justify-around">
        <div className="flex flex-col items-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={es}
            disabled={isDateDisabled}
            modifiers={{
              available: isDayAvailable,
            }}
            modifiersClassNames={{
              selected: "bg-[var(--color-primary)] text-white font-bold",
              available:
                "bg-[var(--color-accent-blue-light)] text-[var(--color-primary)] font-medium border border-[var(--color-primary)]",
              today:
                "bg-[var(--color-surface-variant)] text-[var(--color-text-primary)] border border-[var(--color-border)]",
            }}
            modifiersStyles={{
              available: { fontWeight: "bold" },
            }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            styles={{
              caption: {
                color: "var(--color-text-primary)",
                fontWeight: "bold",
                fontSize: "1.1rem",
              },
              head: {
                color: "var(--color-text-secondary)",
                fontWeight: "600",
              },
              day: {
                transition: "all 0.2s ease-in-out",
                borderRadius: "8px",
                margin: "2px",
                fontSize: "0.9rem",
              },
            }}
          />

          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[var(--color-accent-blue-light)] border border-[var(--color-primary)] rounded"></div>
              <span className="text-[var(--color-text-secondary)]">
                Disponible
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[var(--color-primary)] rounded"></div>
              <span className="text-[var(--color-text-secondary)]">
                Seleccionado
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[var(--color-surface-variant)] border border-[var(--color-border)] rounded"></div>
              <span className="text-[var(--color-text-secondary)]">Hoy</span>
            </div>
          </div>
        </div>

        {selectedDate && filteredSchedules.length > 0 ? (
          <ScheduleList
            selectedDate={selectedDate}
            filteredSchedules={filteredSchedules}
            selectedSchedule={selectedSchedule}
            onScheduleSelect={onScheduleSelect}
            appointments={appointments}
          />
        ) : selectedDate ? (
          <div className="flex items-center justify-center p-8 min-w-[300px]">
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] mb-2">
                No hay horarios disponibles para esta fecha.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Selecciona otro día de la semana.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 min-w-[300px]">
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] mb-2">
                Selecciona una fecha en el calendario
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Los días marcados en azul tienen horarios disponibles.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ScheduleList = ({
  selectedDate,
  filteredSchedules,
  selectedSchedule,
  onScheduleSelect,
  appointments,
}) => {
  // Función para verificar si un horario está ocupado
  const isScheduleOccupied = useMemo(() => {
    return (schedule) => {
      if (!appointments || !selectedDate) return false;

      const selectedDateString = selectedDate.toISOString().split("T")[0];

      return appointments.some((appointment) => {
        // Verificar si la cita es para el mismo schedule y misma fecha
        if (appointment.scheduleId !== schedule.id) return false;

        const appointmentDate = new Date(appointment.scheduledStart);
        const appointmentDateString = appointmentDate
          .toISOString()
          .split("T")[0];

        return appointmentDateString === selectedDateString;
      });
    };
  }, [appointments, selectedDate]);

  // Filtrar horarios disponibles (no ocupados)
  const availableSchedules = useMemo(() => {
    return filteredSchedules.filter(
      (schedule) => !isScheduleOccupied(schedule)
    );
  }, [filteredSchedules, isScheduleOccupied]);

  // Horarios ocupados
  const occupiedSchedules = useMemo(() => {
    return filteredSchedules.filter((schedule) => isScheduleOccupied(schedule));
  }, [filteredSchedules, isScheduleOccupied]);

  return (
    <div className="min-w-[300px]">
      <p className="font-medium mb-4 text-[var(--color-text-secondary)]">
        Horarios disponibles para{" "}
        <span className="text-[var(--color-primary)] font-semibold">
          {selectedDate.toLocaleDateString("es-BO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </p>

      {/* Horarios disponibles */}
      {availableSchedules.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            Horarios disponibles ({availableSchedules.length})
          </p>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
            {availableSchedules.map((sch) => (
              <button
                key={sch.id}
                type="button"
                onClick={() => onScheduleSelect(sch)}
                className={`rounded-xl p-4 border-2 transition text-left cursor-pointer w-full ${
                  selectedSchedule?.id === sch.id
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-blue-light)]"
                }`}
              >
                <p className="font-semibold text-sm">
                  Dr. {sch.doctor.firstName} {sch.doctor.lastName}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{
                    color:
                      selectedSchedule?.id === sch.id
                        ? "rgba(255,255,255,0.9)"
                        : "var(--text-muted)",
                  }}
                >
                  {sch.startTime} - {sch.endTime}
                </p>
                {selectedSchedule?.id === sch.id && (
                  <p className="text-xs mt-2 text-white/90">✓ Seleccionado</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Horarios ocupados */}
      {occupiedSchedules.length > 0 && (
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            Horarios ocupados ({occupiedSchedules.length})
          </p>
          <div className="grid grid-cols-1 gap-3">
            {occupiedSchedules.map((sch) => (
              <div
                key={sch.id}
                className="rounded-xl p-4 border-2 border-[var(--color-border)] bg-[var(--color-surface-variant)] text-left w-full opacity-60"
              >
                <p className="font-semibold text-sm text-[var(--color-text-secondary)]">
                  Dr. {sch.doctor.firstName} {sch.doctor.lastName}
                </p>
                <p className="text-sm mt-1 text-[var(--text-muted)]">
                  {sch.startTime} - {sch.endTime}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-[var(--color-error)] rounded-full"></div>
                  <p className="text-xs text-[var(--color-error)] font-medium">
                    Ocupado
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay horarios disponibles */}
      {availableSchedules.length === 0 && occupiedSchedules.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[var(--color-text-secondary)]">
            No hay horarios para esta fecha
          </p>
        </div>
      )}
    </div>
  );
};

export default DateAndScheduleSelector;
