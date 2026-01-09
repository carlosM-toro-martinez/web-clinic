// utils/cashDataProcessor.js
export const processCashData = (cashData, selectedDate) => {
  if (!cashData?.data) return null;

  const allMovements = [];
  const cashRegisters = cashData.data;

  // Extraer todos los movimientos
  cashRegisters.forEach((register) => {
    if (register.movements && register.movements.length > 0) {
      register.movements.forEach((movement) => {
        const movementDate = new Date(movement.createdAt);
        // Ajustar para zona horaria local
        const localDate = new Date(
          movementDate.getTime() + movementDate.getTimezoneOffset() * 60000
        );

        allMovements.push({
          ...movement,
          registerId: register.id,
          registerStatus: register.status,
          date: localDate,
          dateString: localDate.toISOString().split("T")[0],
          monthYear: `${localDate.getFullYear()}-${String(
            localDate.getMonth() + 1
          ).padStart(2, "0")}`,
          amountNum: parseFloat(movement.amount) || 0,
        });
      });
    }
  });

  // Calcular estadísticas por día
  const dailyStats = processDailyStats(allMovements);

  // Calcular estadísticas por semana
  const weeklyStats = processWeeklyStats(allMovements);

  // Calcular estadísticas por mes
  const monthlyStats = processMonthlyStats(allMovements);

  // Calcular totales generales
  const { totalIncome, totalExpense } = calculateTotals(allMovements);

  // Filtrar por fecha seleccionada
  const selectedDateMovements = allMovements.filter(
    (m) => m.dateString === selectedDate
  );

  const selectedDateStats = dailyStats[selectedDate] || {
    income: 0,
    expense: 0,
    movements: [],
  };

  // Obtener últimas 7 semanas
  const last7Weeks = Object.values(weeklyStats)
    .sort((a, b) => b.weekKey.localeCompare(a.weekKey))
    .slice(0, 7);

  // Obtener últimos 6 meses
  const last6Months = Object.values(monthlyStats)
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
    .slice(0, 6);

  return {
    allMovements,
    dailyStats: Object.values(dailyStats).sort((a, b) =>
      b.date.localeCompare(a.date)
    ),
    weeklyStats: Object.values(weeklyStats).sort((a, b) =>
      b.weekKey.localeCompare(a.weekKey)
    ),
    monthlyStats: Object.values(monthlyStats).sort((a, b) =>
      b.monthKey.localeCompare(a.monthKey)
    ),
    selectedDateMovements,
    selectedDateStats,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    last7Weeks,
    last6Months,
    cashRegistersCount: cashRegisters.length,
    openRegisters: cashRegisters.filter((r) => r.status === "OPEN").length,
    closedRegisters: cashRegisters.filter((r) => r.status === "CLOSED").length,
  };
};

const processDailyStats = (movements) => {
  const stats = {};
  movements.forEach((movement) => {
    if (!stats[movement.dateString]) {
      stats[movement.dateString] = {
        date: movement.dateString,
        income: 0,
        expense: 0,
        movements: [],
      };
    }
    if (movement.type === "INCOME") {
      stats[movement.dateString].income += movement.amountNum;
    } else if (movement.type === "EXPENSE") {
      stats[movement.dateString].expense += movement.amountNum;
    }
    stats[movement.dateString].movements.push(movement);
  });
  return stats;
};

const processWeeklyStats = (movements) => {
  const stats = {};
  movements.forEach((movement) => {
    const weekNumber = getWeekNumber(movement.date);
    const weekKey = `${movement.date.getFullYear()}-W${weekNumber}`;

    if (!stats[weekKey]) {
      stats[weekKey] = {
        weekKey,
        weekNumber,
        year: movement.date.getFullYear(),
        income: 0,
        expense: 0,
        movements: [],
      };
    }
    if (movement.type === "INCOME") {
      stats[weekKey].income += movement.amountNum;
    } else if (movement.type === "EXPENSE") {
      stats[weekKey].expense += movement.amountNum;
    }
    stats[weekKey].movements.push(movement);
  });
  return stats;
};

const processMonthlyStats = (movements) => {
  const stats = {};
  movements.forEach((movement) => {
    if (!stats[movement.monthYear]) {
      const monthName = movement.date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
      stats[movement.monthYear] = {
        monthKey: movement.monthYear,
        monthName,
        income: 0,
        expense: 0,
        movements: [],
      };
    }
    if (movement.type === "INCOME") {
      stats[movement.monthYear].income += movement.amountNum;
    } else if (movement.type === "EXPENSE") {
      stats[movement.monthYear].expense += movement.amountNum;
    }
    stats[movement.monthYear].movements.push(movement);
  });
  return stats;
};

const calculateTotals = (movements) => {
  const totalIncome = movements
    .filter((m) => m.type === "INCOME")
    .reduce((sum, m) => sum + m.amountNum, 0);

  const totalExpense = movements
    .filter((m) => m.type === "EXPENSE")
    .reduce((sum, m) => sum + m.amountNum, 0);

  return { totalIncome, totalExpense };
};

const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
};
