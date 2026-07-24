import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

function WeightChart({ data, targetWeight }) {
  const yDomain = useMemo(() => {
    const weights = (data || []).map((d) => d.weight).filter((w) => !Number.isNaN(w));
    if (weights.length === 0) return ["auto", "auto"];

    const min = Math.min(...weights);
    const max = Math.max(...weights);
    // Marge proportionnelle à l'amplitude réelle (mini 2 kg) pour donner
    // plus d'air autour de la courbe.
    const padding = Math.max(2, (max - min) * 0.6);

    let lower = min - padding;
    let upper = max + padding;

    const current = weights[weights.length - 1];

    // La ligne d'objectif doit toujours rester visible, avec au moins autant
    // d'espace sous l'objectif qu'entre le poids actuel et l'objectif.
    if (targetWeight != null) {
      const target = Number(targetWeight);
      const gapToTarget = Math.max(Math.abs(current - target), 1);

      lower = Math.min(lower, target - gapToTarget);
      upper = Math.max(upper, target + gapToTarget);
    }

    // Marge supplémentaire au-dessus du poids actuel pour laisser de la
    // place à une éventuelle reprise de poids.
    upper = Math.max(upper, current + 8);

    return [Math.floor(lower * 10) / 10, Math.ceil(upper * 10) / 10];
  }, [data, targetWeight]);

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
            domain={yDomain}
            allowDecimals={true}
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => `${value} kg`}
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
          {targetWeight != null && (
            <ReferenceLine
              y={targetWeight}
              stroke="#16a34a"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Objectif : ${targetWeight} kg`,
                position: "insideTopRight",
                fill: "#16a34a",
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightChart;


