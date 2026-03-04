import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import LayoutComponent from "../../../components/LayoutComponent";
import pacientesService from "../../../async/services/get/pacientesService";
import FormHistory from "../../../components/FormHistory";
import BackArrow from "../../../components/common/BackArrow";
import doctorsService from "../../../async/services/get/doctorsService";
import specialtiesService from "../../../async/services/get/specialtiesService";
import toTitleCase from "../../../utils/toTitleCase";
import { MainContext } from "../../../context/MainContext";
import DateAndScheduleSelector from "../../../components/appointments/DateAndScheduleSelector";
import appointmentsService from "../../../async/services/get/appointmentsService";
import useApiMutation from "../../../hocks/useApiMutation";
import appointmentAddService from "../../../async/services/post/appointmentAddService";
import AlertMessage from "../../../components/common/AlertMessage";

function CrearConsulta() {
  const location = useLocation();
  const { user, cashRegister } = useContext(MainContext);
  const isQuickMode = location.pathname === "/consultas/rapida";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [quickContext, setQuickContext] = useState(null);
  const [quickDate, setQuickDate] = useState(null);
  const [quickSchedule, setQuickSchedule] = useState(null);
  const [localError, setLocalError] = useState("");

  const {
    mutate: createAppointment,
    isPending: isCreatingAppointment,
    message: appointmentMessage,
    type: appointmentMessageType,
    reset: resetAppointmentMessage,
  } = useApiMutation(appointmentAddService, {
    onSuccess: (data) => {
      const createdAppointment =
        data?.data || data?.appointment || data?.result || data;
      const appointmentId =
        createdAppointment?.id || createdAppointment?.data?.id;
      if (!appointmentId) {
        setLocalError(
          "La cita se creó, pero no se pudo obtener el ID para iniciar la consulta.",
        );
        return;
      }
      setQuickContext({
        patientId: selectedPatient.id,
        doctorId: selectedDoctor.id,
        specialtyId: selectedSpecialty.id,
        patient: selectedPatient,
        doctor: selectedDoctor,
        specialty: selectedSpecialty,
        appointmentsId: appointmentId,
      });
    },
  });

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pacientes"],
    queryFn: pacientesService,
  });

  const {
    data: doctorsResponse,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    error: errorDoctors,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorsService,
  });

  const {
    data: specialtiesResponse,
    isLoading: isLoadingSpecialties,
    isError: isErrorSpecialties,
    error: errorSpecialties,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: specialtiesService,
  });

  const {
    data: appointmentsResponse,
    isLoading: isLoadingAppointments,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentsService,
    enabled: isQuickMode,
  });

  const patients = response?.data || [];
  const doctors = doctorsResponse?.data || [];
  const specialties = specialtiesResponse?.data || [];
  const appointments = appointmentsResponse?.data || [];

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return patients.slice(0, 20);
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const ci = (p.ciNumber || "").toLowerCase();
      return fullName.includes(term) || ci.includes(term);
    });
  }, [patients, searchTerm]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const doctorSpecialtyIds = useMemo(() => {
    const list =
      selectedDoctor?.specialties?.map(
        (spec) => spec.specialtyId || spec.specialty?.id || spec.id,
      ) || [];
    return new Set(list.filter(Boolean));
  }, [selectedDoctor]);

  const availableSpecialties = useMemo(() => {
    if (!selectedDoctorId) return specialties;
    if (doctorSpecialtyIds.size > 0) {
      return specialties.filter((s) => doctorSpecialtyIds.has(s.id));
    }
    return specialties.filter((s) =>
      (s.schedules || []).some((sch) => sch.doctorId === selectedDoctorId),
    );
  }, [doctorSpecialtyIds, selectedDoctorId, specialties]);

  const selectedSpecialty = availableSpecialties.find(
    (s) => s.id === selectedSpecialtyId,
  );

  const selectedFee = useMemo(() => {
    if (!selectedSpecialty?.fees) return null;
    return (
      selectedSpecialty.fees.find((f) => f.feeType === "INITIAL") ||
      selectedSpecialty.fees[0] ||
      null
    );
  }, [selectedSpecialty]);

  const quickFilteredSchedules = useMemo(() => {
    if (!selectedSpecialty || !quickDate) return [];
    const day = quickDate.getDay();
    return (selectedSpecialty.schedules || []).filter((s) => {
      if (!s.isActive || s.dayOfWeek !== day) return false;
      if (selectedDoctorId && s.doctorId !== selectedDoctorId) return false;
      return true;
    });
  }, [selectedSpecialty, quickDate, selectedDoctorId]);

  const canStartQuick =
    !!selectedPatient && !!selectedDoctor && !!selectedSpecialty;

  useEffect(() => {
    if (user?.role === "DOCTOR") {
      setSelectedDoctorId(user.id);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!searchTerm) return;
    if (filteredPatients.length === 1) {
      setSelectedPatientId(filteredPatients[0].id);
    }
  }, [filteredPatients, searchTerm]);

  useEffect(() => {
    if (
      selectedSpecialtyId &&
      !availableSpecialties.some((s) => s.id === selectedSpecialtyId)
    ) {
      setSelectedSpecialtyId("");
    }
  }, [availableSpecialties, selectedSpecialtyId]);

  useEffect(() => {
    if (!selectedSpecialtyId) {
      setQuickDate(null);
      setQuickSchedule(null);
    }
  }, [selectedSpecialtyId]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setQuickSchedule(null);
    }
  }, [selectedDoctorId]);

  const handleCreateAppointment = () => {
    setLocalError("");
    if (!selectedPatient || !selectedSpecialty || !selectedDoctor) {
      setLocalError("Selecciona paciente, especialidad y médico.");
      return;
    }
    if (!quickDate || !quickSchedule) {
      setLocalError("Selecciona una fecha y horario.");
      return;
    }
    if (!selectedFee) {
      setLocalError("La especialidad no tiene tarifa configurada.");
      return;
    }

    const [startHour, startMinute] = quickSchedule.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = quickSchedule.endTime
      .split(":")
      .map(Number);

    const startDateTime = new Date(quickDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(quickDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const total = Number(selectedFee.amount || 0);
    const reserva = 0;

    createAppointment({
      patientId: selectedPatient.id,
      doctorId: quickSchedule.doctor?.id || selectedDoctor.id,
      specialtyId: selectedSpecialty.id,
      scheduleId: quickSchedule.id,
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
    });
  };

  const contextToUse = location.state ?? quickContext;

  return (
    <LayoutComponent>
      <BackArrow />
      {isLoading || isLoadingDoctors || isLoadingSpecialties ? (
        <div className="flex justify-center items-center h-64 text-[var(--color-text-secondary)]">
          Cargando datos para la consulta...
        </div>
      ) : isError || isErrorDoctors || isErrorSpecialties ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          Error:{" "}
          {error?.message ||
            errorDoctors?.message ||
            errorSpecialties?.message ||
            "Error al cargar datos necesarios"}
        </div>
      ) : isQuickMode && !contextToUse ? (
        <section className="max-w-4xl mx-auto mt-6 p-6 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Consulta rápida
            </h2>
            <p className="text-[var(--color-text-subtle)] mt-1">
              Selecciona paciente, especialidad y médico para iniciar la
              consulta con una cita rápida.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Buscar paciente
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, apellido o CI"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
            <div className="text-xs text-[var(--color-text-subtle)] mt-2">
              {searchTerm
                ? `${filteredPatients.length} resultado(s)`
                : "Escribe para buscar y seleccionar rápido"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Selección rápida
            </label>
            {selectedPatient ? (
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="text-sm text-[var(--color-text-primary)]">
                  {toTitleCase(selectedPatient.firstName)}{" "}
                  {toTitleCase(selectedPatient.lastName)}{" "}
                  {selectedPatient.ciNumber
                    ? `• ${selectedPatient.ciNumber}`
                    : ""}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatientId("")}
                  className="text-xs text-[var(--color-error)] hover:underline"
                >
                  Quitar
                </button>
              </div>
            ) : searchTerm && filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredPatients.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className="text-left px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition"
                  >
                    {toTitleCase(p.firstName)} {toTitleCase(p.lastName)}{" "}
                    {p.ciNumber ? `• ${p.ciNumber}` : ""}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[var(--color-text-subtle)]">
                Escribe para ver resultados.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Especialidad
              </label>
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              >
                <option value="">Especialidad</option>
                {availableSpecialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {toTitleCase(s.name)}
                  </option>
                ))}
              </select>
              {selectedDoctorId && availableSpecialties.length === 0 && (
                <div className="text-xs text-[var(--color-error)] mt-2">
                  Este médico no tiene especialidades configuradas.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                Médico
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={user?.role === "DOCTOR"}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              >
                <option value="">Médico</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr(a). {toTitleCase(d.firstName)} {toTitleCase(d.lastName)}
                  </option>
                ))}
              </select>
              {user?.role === "DOCTOR" && (
                <div className="text-xs text-[var(--color-text-subtle)] mt-2">
                  Médico asignado automáticamente por la sesión.
                </div>
              )}
            </div>
          </div>

          {selectedSpecialty && (
            <div className="border-t border-[var(--color-border)] pt-4">
              <DateAndScheduleSelector
                selectedSpecialty={selectedSpecialty}
                selectedDate={quickDate}
                filteredSchedules={quickFilteredSchedules}
                selectedSchedule={quickSchedule}
                onDateChange={(date) => setQuickDate(date)}
                onScheduleSelect={(schedule) => setQuickSchedule(schedule)}
                appointments={appointments}
              />
              {isLoadingAppointments && (
                <div className="text-xs text-[var(--color-text-subtle)] mt-2">
                  Cargando ocupación de horarios...
                </div>
              )}
            </div>
          )}

          {localError && (
            <div className="text-sm text-red-500">{localError}</div>
          )}
          {appointmentMessage && (
            <AlertMessage
              message={appointmentMessage}
              type={appointmentMessageType}
              onClose={resetAppointmentMessage}
            />
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateAppointment}
              disabled={
                !canStartQuick || !quickDate || !quickSchedule || !selectedFee
              }
              className="btn-primary px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingAppointment
                ? "Agendando..."
                : "Agendar y empezar consulta"}
            </button>
          </div>
        </section>
      ) : (
        <FormHistory patients={patients} initialContext={contextToUse} />
      )}
    </LayoutComponent>
  );
}

export default CrearConsulta;
