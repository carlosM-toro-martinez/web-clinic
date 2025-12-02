// src/utils/dashboardCalculations.js
export const calculateMetrics = (appointmentsData, cashRegisterData) => {
  const appointments = appointmentsData?.data || [];
  const cashRegister = cashRegisterData?.data;
  const movements = cashRegister?.movements || [];

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((apt) =>
    apt.scheduledStart.startsWith(today)
  );

  const totalIncome = movements
    .filter((m) => m.type === "INCOME")
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "PENDING"
  ).length;

  return [
    {
      id: 1,
      title: "Citas Hoy",
      value: todayAppointments.length,
      subtitle: `${pendingAppointments} pendientes`,
      icon: "📅",
      color: "text-blue-500",
      trend: 12,
    },
    {
      id: 2,
      title: "Ingresos del Día",
      value: `${totalIncome} BOB`,
      subtitle: "Total recaudado",
      icon: "💰",
      color: "text-green-500",
      trend: 8,
    },
    {
      id: 3,
      title: "Pacientes Atendidos",
      value: appointments.filter((apt) => apt.status === "COMPLETED").length,
      subtitle: "Este mes",
      icon: "👥",
      color: "text-purple-500",
      trend: 15,
    },
    {
      id: 4,
      title: "Caja Actual",
      value: `${cashRegister?.actualAmount || 0} BOB`,
      subtitle:
        cashRegister?.status === "OPEN" ? "Caja abierta" : "Caja cerrada",
      icon: "💼",
      color: "text-orange-500",
      trend: null,
    },
  ];
};

export const filterTodayAppointments = (appointmentsData) => {
  const appointments = appointmentsData?.data || [];
  const today = new Date().toISOString().split("T")[0];

  return appointments.filter((apt) => apt.scheduledStart.startsWith(today));
};
