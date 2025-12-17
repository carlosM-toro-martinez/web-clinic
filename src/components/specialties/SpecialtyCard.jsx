import React, { useState, useContext } from "react";
import useApiMutation from "../../hocks/useApiMutation";
import specialtyAddFeesService from "../../async/services/post/specialtyAddFeeService";
import specialtyAddSchedulesService from "../../async/services/post/specialtyAddScheduleService";
import FeeForm from "./FeeForm";
import ScheduleForm from "./ScheduleForm";
import AlertMessage from "../common/AlertMessage";
import { MainContext } from "../../context/MainContext";
import {
  CalendarDays,
  Clock,
  User,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function SpecialtyCard({ specialty, doctors, onUpdate }) {
  const { token } = useContext(MainContext);
  const [expanded, setExpanded] = useState(false);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [localMessage, setLocalMessage] = useState({ text: "", type: "" });

  const {
    mutate: addFees,
    isPending: isAddingFees,
    message: feeMessage,
    type: feeType,
    reset: resetFee,
    setIdEdit,
  } = useApiMutation(specialtyAddFeesService, {
    onSuccess: () => {
      setShowFeeForm(false);
      setLocalMessage({
        text: "Tarifas agregadas exitosamente",
        type: "success",
      });
      onUpdate();
    },
  });

  const {
    mutate: addSchedules,
    isPending: isAddingSchedules,
    message: scheduleMessage,
    type: scheduleType,
    reset: resetSchedule,
    setIdEdit: setScheduleIdEdit,
  } = useApiMutation(specialtyAddSchedulesService, {
    onSuccess: () => {
      setShowScheduleForm(false);
      setLocalMessage({
        text: "Horarios agregados exitosamente",
        type: "success",
      });
      onUpdate();
    },
  });

  const handleAddFees = (feesArray) => {
    setIdEdit(specialty.id);
    addFees(feesArray, token, specialty.id);
  };

  const handleAddSchedules = (schedulesArray) => {
    setScheduleIdEdit(specialty.id);
    addSchedules(schedulesArray, token, specialty.id);
  };

  const resetMessages = () => {
    resetFee();
    resetSchedule();
    setLocalMessage({ text: "", type: "" });
  };

  const currentMessage = feeMessage || scheduleMessage || localMessage.text;
  const currentType = feeType || scheduleType || localMessage.type;

  // Calcular estadísticas
  const getFeeStats = () => {
    const initialFees = specialty.fees.filter((f) => f.feeType === "INITIAL");
    const followUpFees = specialty.fees.filter(
      (f) => f.feeType === "FOLLOW_UP"
    );

    const initialTotal = initialFees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount),
      0
    );
    const followUpTotal = followUpFees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount),
      0
    );

    return {
      initialFees: initialFees.length,
      followUpFees: followUpFees.length,
      initialTotal,
      followUpTotal,
    };
  };

  const getScheduleStats = () => {
    const uniqueDoctors = [
      ...new Set(specialty.schedules.map((s) => s.doctorId)),
    ];
    const daysCount = specialty.schedules.reduce((acc, s) => {
      acc[s.dayOfWeek] = (acc[s.dayOfWeek] || 0) + 1;
      return acc;
    }, {});

    return { uniqueDoctors: uniqueDoctors.length, daysCount };
  };

  const feeStats = getFeeStats();
  const scheduleStats = getScheduleStats();
  console.log(specialty);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-4">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {specialty.name}
            </h2>
            <span className="text-blue-600 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full">
              {specialty.code}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">{specialty.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {specialty.fees.length} tarifas • {specialty.schedules.length}{" "}
              horarios
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="text-blue-600" />
          ) : (
            <ChevronDown className="text-gray-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-6 border-t pt-6 animate-fadeIn space-y-8">
          {currentMessage && (
            <AlertMessage
              message={currentMessage}
              type={currentType}
              onClose={resetMessages}
            />
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                <div>
                  <h3 className="text-gray-700 font-semibold">Tarifas</h3>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{feeStats.initialFees} iniciales</span>
                    <span>{feeStats.followUpFees} controles</span>
                  </div>
                </div>
              </div>

              {!showFeeForm && (
                <button
                  type="button"
                  onClick={() => setShowFeeForm(true)}
                  className="flex items-center bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Tarifas
                </button>
              )}
            </div>

            {specialty.fees.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {specialty.fees.map((fee) => (
                  <div
                    key={fee.id}
                    className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {fee.feeType === "INITIAL"
                            ? "Consulta inicial"
                            : fee.feeType === "FOLLOW_UP"
                            ? "Control de seguimiento"
                            : fee.feeType === "EMERGENCY"
                            ? "Emergencia"
                            : "Procedimiento"}
                        </p>
                        <p className="text-blue-700 font-semibold text-lg">
                          {fee.amount} {fee.currency || "BOB"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {fee.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No hay tarifas registradas
                </p>
              </div>
            )}

            {/* Formulario para NUEVAS tarifas (array) */}
            {showFeeForm && (
              <FeeForm
                onSubmit={handleAddFees}
                isSubmitting={isAddingFees}
                onCancel={() => setShowFeeForm(false)}
              />
            )}
          </div>

          {/* Horarios */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                <div>
                  <h3 className="text-gray-700 font-semibold">Horarios</h3>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{scheduleStats.uniqueDoctors} doctores</span>
                    <span>
                      {Object.keys(scheduleStats.daysCount).length} días
                    </span>
                  </div>
                </div>
              </div>

              {!showScheduleForm && (
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(true)}
                  className="flex items-center bg-purple-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar Horarios
                </button>
              )}
            </div>

            {specialty.schedules.length > 0 ? (
              <div className="space-y-4">
                {/* Primero, agrupamos por doctor y día */}
                {(() => {
                  // Agrupar horarios por doctor y día
                  const grouped = specialty.schedules.reduce(
                    (acc, schedule) => {
                      const key = `${schedule.doctorId}-${schedule.dayOfWeek}`;
                      if (!acc[key]) {
                        acc[key] = {
                          doctor: schedule.doctor,
                          dayOfWeek: schedule.dayOfWeek,
                          slots: [],
                        };
                      }
                      acc[key].slots.push({
                        id: schedule.id,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                      });
                      return acc;
                    },
                    {}
                  );

                  // Ordenar slots por hora de inicio y agrupar rangos continuos
                  Object.keys(grouped).forEach((key) => {
                    const group = grouped[key];
                    group.slots.sort((a, b) =>
                      a.startTime.localeCompare(b.startTime)
                    );

                    // Combinar slots consecutivos
                    const merged = [];
                    let current = { ...group.slots[0] };

                    for (let i = 1; i < group.slots.length; i++) {
                      const next = group.slots[i];

                      // Si el siguiente slot comienza donde termina el actual, extender
                      if (current.endTime === next.startTime) {
                        current.endTime = next.endTime;
                      } else {
                        merged.push(current);
                        current = { ...next };
                      }
                    }
                    merged.push(current);

                    group.ranges = merged;

                    // Calcular total de horas
                    group.totalHours = group.ranges.reduce((total, range) => {
                      const start = new Date(`1970/01/01 ${range.startTime}`);
                      const end = new Date(`1970/01/01 ${range.endTime}`);
                      return total + (end - start) / (1000 * 60 * 60);
                    }, 0);
                  });

                  return Object.values(grouped).map((group, index) => (
                    <div
                      key={`${group.doctor.id}-${group.dayOfWeek}`}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center mb-3 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              Dr(a). {group.doctor.firstName}{" "}
                              {group.doctor.lastName}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              {daysOfWeek[group.dayOfWeek] ||
                                "Día no especificado"}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                          <div className="text-sm font-medium">
                            {group.slots.length} citas •{" "}
                            {group.totalHours.toFixed(1)} horas
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          Horarios disponibles:
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {group.ranges.map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg"
                            >
                              <span className="font-medium text-blue-700">
                                {range.startTime} - {range.endTime}
                              </span>
                              <span className="mx-2 text-blue-400">•</span>
                              <span className="text-sm text-blue-600">
                                {(
                                  (new Date(`1970/01/01 ${range.endTime}`) -
                                    new Date(`1970/01/01 ${range.startTime}`)) /
                                  (1000 * 60 * 60)
                                ).toFixed(1)}
                                h
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="block font-medium text-gray-500">
                                Primera cita:
                              </span>
                              <span className="text-gray-800 font-medium">
                                {group.slots[0]?.startTime || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="block font-medium text-gray-500">
                                Última cita:
                              </span>
                              <span className="text-gray-800 font-medium">
                                {group.slots[group.slots.length - 1]?.endTime ||
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No hay horarios registrados
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Agrega horarios para que los doctores puedan atender pacientes
                </p>
              </div>
            )}

            {showScheduleForm && (
              <ScheduleForm
                onSubmit={handleAddSchedules}
                isSubmitting={isAddingSchedules}
                onCancel={() => setShowScheduleForm(false)}
                doctors={doctors}
                specialtyId={specialty.id}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
