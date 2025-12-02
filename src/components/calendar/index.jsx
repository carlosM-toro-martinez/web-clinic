import React from "react";
import { useNavigate } from "react-router-dom";
import { useCalendarAppointments } from "../../hocks/useCalendarAppointments";
import CalendarHeader from "./CalendarHeader";
import SpecialtyTabs from "./SpecialtyTabs";
import CalendarView from "./CalendarView";
import AppointmentList from "./AppointmentList";
import ActionButtons from "./ActionButtons";

function CalendarAppointments({
  specialties = [],
  appointments = [],
  refetchAppointments,
}) {
  const navigate = useNavigate();

  const {
    selectedDate,
    setSelectedDate,
    selectedSpecialty,
    setSelectedSpecialty,
    filteredAppointments,
    tabs,
    formattedDate,
    daysWithAppointments,
  } = useCalendarAppointments(specialties, appointments);

  const handleCreateAppointment = () => {
    navigate("/citas/crear", { state: { appointments } });
  };

  return (
    <div className="container">
      <div className="card shadow-sm">
        <CalendarHeader onCreateAppointment={handleCreateAppointment} />

        <SpecialtyTabs
          tabs={tabs}
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={setSelectedSpecialty}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              daysWithAppointments={daysWithAppointments}
            />
          </div>

          <AppointmentList
            filteredAppointments={filteredAppointments}
            formattedDate={formattedDate}
            refetchAppointments={refetchAppointments}
          />
        </div>

        <ActionButtons />
      </div>
    </div>
  );
}

export default CalendarAppointments;
