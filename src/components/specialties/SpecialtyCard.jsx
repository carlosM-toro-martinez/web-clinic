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

            {/* Lista de horarios existentes */}
            {specialty.schedules.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {specialty.schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex flex-col bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {daysOfWeek[sch.dayOfWeek]}
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        {sch.startTime} - {sch.endTime}
                      </span>
                    </div>
                    {sch.doctor && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <User className="w-4 h-4 mr-1 text-blue-500" />
                        Dr(a). {sch.doctor.firstName} {sch.doctor.lastName}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Duración:{" "}
                      {(
                        (new Date(`1970/01/01 ${sch.endTime}`) -
                          new Date(`1970/01/01 ${sch.startTime}`)) /
                        (1000 * 60 * 60)
                      ).toFixed(1)}{" "}
                      horas
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                <CalendarDays className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No hay horarios registrados
                </p>
              </div>
            )}

            {/* Formulario para NUEVOS horarios (array) */}
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
