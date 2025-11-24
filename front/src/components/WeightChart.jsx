import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WeightChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">Pas encore de mesures de poids.</div>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            dataKey="weight"
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              fontSize: "0.8rem",
            }}
            labelStyle={{ color: "#6b7280" }}
            formatter={(value) => [`${value} kg`, "Poids"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={2.2}
            dot={{ r: 3, strokeWidth: 1, stroke: "#2563eb", fill: "#ffffff" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightChart;


