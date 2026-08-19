"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export default function ActivityPatterns({
  hourly,
  weekday,
}: {
  hourly: number[];
  weekday: number[];
}) {
  const hourlyData = hourly.map((value, hour) => ({
    hour: `${hour}h`,
    value,
  }));
  const weekdayData = weekday.map((value, day) => ({
    day: WEEKDAY_LABELS[day],
    value,
  }));

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">
          Por hora del día (UTC)
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis
                dataKey="hour"
                interval={3}
                tick={{ fontSize: 10, fill: "var(--muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--border)" }} />
              <Bar dataKey="value" fill="var(--accent)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">
          Por día de la semana
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "var(--muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--border)" }} />
              <Bar dataKey="value" fill="var(--accent)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
