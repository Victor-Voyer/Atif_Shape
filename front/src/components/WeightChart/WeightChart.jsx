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
import "./WeightChart.css";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="weight-chart-tooltip">
      <p className="weight-chart-tooltip-label">{label}</p>
      <p className="weight-chart-tooltip-value">{payload[0].value} kg</p>
    </div>
  );
}

function WeightChart({ data, targetWeight }) {
  const yDomain = useMemo(() => {
    const weights = (data || []).map((d) => d.weight).filter((w) => !Number.isNaN(w));
    if (weights.length === 0) return ["auto", "auto"];

    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = Math.max(2, (max - min) * 0.6);

    let lower = min - padding;
    let upper = max + padding;

    const current = weights[weights.length - 1];

    if (targetWeight != null) {
      const target = Number(targetWeight);
      const gapToTarget = Math.max(Math.abs(current - target), 1);

      lower = Math.min(lower, target - gapToTarget);
      upper = Math.max(upper, target + gapToTarget);
    }

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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
          />
          <YAxis
            dataKey="weight"
            domain={yDomain}
            allowDecimals={true}
            tickMargin={8}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
            tickFormatter={(value) => `${value} kg`}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--color-primary)"
            strokeWidth={2.2}
            dot={{
              r: 3,
              strokeWidth: 1,
              stroke: "var(--color-primary)",
              fill: "var(--color-surface)",
            }}
            activeDot={{ r: 5 }}
          />
          {targetWeight != null && (
            <ReferenceLine
              y={targetWeight}
              stroke="var(--color-success)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Objectif : ${targetWeight} kg`,
                position: "insideTopRight",
                fill: "var(--color-success)",
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
