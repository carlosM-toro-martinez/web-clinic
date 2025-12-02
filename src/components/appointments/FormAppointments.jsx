import React from "react";
import { useAppointmentForm } from "../../hocks/useAppointmentForm";
import PatientSelector from "./PatientSelector";
import SpecialtySelector from "./SpecialtySelector";
import DateAndScheduleSelector from "./DateAndScheduleSelector";
import FeeTypeSelector from "./FeeTypeSelector";
import ReservationAmountInput from "./ReservationAmountInput";
import PatientCreateModal from "./PatientCreateModal";
import AlertMessage from "../common/AlertMessage";
import { useLocation } from "react-router-dom";

const FormAppointments = ({ patients, specialties }) => {
  const {
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
  } = useAppointmentForm(patients, specialties);
  const location = useLocation();
  const appointments = location.state?.appointments;

  const handleSpecialtyChange = (e) => {
    const spec = specialties.find((s) => s.id === e.target.value);
    updateFormState({
      selectedSpecialty: spec,
      selectedFee: spec?.fees?.find((f) => f.feeType === "INITIAL"),
      selectedSchedule: null,
      selectedDate: null,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto mt-8 p-6 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Crear Cita Médica
        </h2>

        <PatientSelector
          formState={formState}
          updateFormState={updateFormState}
          filteredPatients={filteredPatients}
          onOpenModal={() => updateFormState({ showPatientModal: true })}
        />

        <SpecialtySelector
          specialties={specialties}
          selectedSpecialty={formState.selectedSpecialty}
          onSpecialtyChange={handleSpecialtyChange}
        />

        <DateAndScheduleSelector
          selectedSpecialty={formState.selectedSpecialty}
          selectedDate={formState.selectedDate}
          filteredSchedules={filteredSchedules}
          selectedSchedule={formState.selectedSchedule}
          onDateChange={(date) => updateFormState({ selectedDate: date })}
          onScheduleSelect={(schedule) =>
            updateFormState({ selectedSchedule: schedule })
          }
          appointments={appointments}
        />

        <FeeTypeSelector
          selectedSpecialty={formState.selectedSpecialty}
          selectedFee={formState.selectedFee}
          onFeeSelect={(fee) => updateFormState({ selectedFee: fee })}
        />

        <ReservationAmountInput
          selectedFee={formState.selectedFee}
          reservationAmount={formState.reservationAmount}
          onAmountChange={(amount) =>
            updateFormState({ reservationAmount: amount })
          }
        />

        {formState.localError && (
          <p className="text-sm text-red-500 text-center">
            {formState.localError}
          </p>
        )}

        {message && (
          <AlertMessage message={message} type={type} onClose={reset} />
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer"
          >
            {isPending ? "Guardando..." : "Guardar Cita"}
          </button>
        </div>
      </form>

      <PatientCreateModal
        isOpen={formState.showPatientModal}
        onClose={() => updateFormState({ showPatientModal: false })}
        onPatientCreated={handlePatientCreated}
      />
    </>
  );
};

export default FormAppointments;
