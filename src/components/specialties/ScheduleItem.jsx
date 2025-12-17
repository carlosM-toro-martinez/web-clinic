import React, { memo } from "react";
import { X } from "lucide-react";

const ScheduleItem = ({
  index,
  schedule,
  filteredDoctors,
  appointmentDuration,
  onScheduleChange,
  onRemoveSchedule,
  showRemoveButton,
  daysOfWeek,
  generateTimeSlots,
  validateSchedule,
  getDoctorName,
}) => {
  const isValid = validateSchedule(schedule);
  const timeSlots = isValid
    ? generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        appointmentDuration
      )
    : [];

  return (
    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700">
          Horario #{index + 1}
        </span>
        {showRemoveButton && (
          <button
            type="button"
            onClick={() => onRemoveSchedule(index)}
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
                onScheduleChange(index, "doctorId", e.target.value)
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

        <div>
          <select
            className="input text-xs py-1 h-12"
            value={schedule.dayOfWeek}
            onChange={(e) =>
              onScheduleChange(index, "dayOfWeek", e.target.value)
            }
          >
            <option value="1">Lunes</option>
            <option value="2">Martes</option>
            <option value="3">Miércoles</option>
            <option value="4">Jueves</option>
            <option value="5">Viercoles</option>
            <option value="6">Sábado</option>
            <option value="0">Domingo</option>
          </select>
        </div>

        <div className="flex gap-1">
          <div className="relative flex-1">
            <input
              type="time"
              className="input text-xs pl-7 py-1 h-12"
              value={schedule.startTime}
              onChange={(e) =>
                onScheduleChange(index, "startTime", e.target.value)
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
                onScheduleChange(index, "endTime", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {isValid && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-600">
              {daysOfWeek[schedule.dayOfWeek] || "Lunes"}
            </div>
            <div className="text-xs text-gray-500">
              {schedule.startTime} - {schedule.endTime}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {timeSlots.slice(0, 6).map((slot, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {slot.startTime}
              </span>
            ))}
            {timeSlots.length > 6 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{timeSlots.length - 6}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {timeSlots.length} citas de {appointmentDuration} min
          </div>
        </div>
      )}

      {!isValid &&
        schedule.doctorId &&
        schedule.startTime &&
        schedule.endTime && (
          <div className="text-red-500 text-xs mt-1">
            La hora de inicio debe ser anterior a la hora de fin
          </div>
        )}
    </div>
  );
};
export default ScheduleItem;
