// src/components/dashboard/cash-register/CashFlowChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CashFlowChart = ({ data }) => {
  if (!data?.data?.movements) return null;

  // Agrupar movimientos por hora del día
  const hourlyData = data.data.movements.reduce((acc, movement) => {
    const hour = new Date(movement.createdAt).getHours();
    const hourKey = `${hour}:00`;

    if (!acc[hourKey]) {
      acc[hourKey] = { hour: hourKey, income: 0, expense: 0 };
    }

    if (movement.type === "INCOME") {
      acc[hourKey].income += parseFloat(movement.amount);
    } else {
      acc[hourKey].expense += parseFloat(movement.amount);
    }

    return acc;
  }, {});

  const chartData = Object.values(hourlyData).sort(
    (a, b) => parseInt(a.hour) - parseInt(b.hour)
  );

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] mb-4">
        📊 Flujo de Caja (Hoy)
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="hour"
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
            <Tooltip
              formatter={(value) => [`${value} BOB`, "Monto"]}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="income"
              fill="var(--color-success)"
              name="Ingresos"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-error)"
              name="Egresos"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
