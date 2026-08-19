"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { LanguageStat } from "@/lib/types";

const FALLBACK_COLORS = [
  "#6366f1",
  "#818cf8",
  "#a5b4fc",
  "#c7d2fe",
  "#4f46e5",
  "#4338ca",
  "#3730a3",
  "#312e81",
];

export default function LanguageBreakdown({
  languages,
}: {
  languages: LanguageStat[];
}) {
  if (languages.length === 0) {
    return (
      <p className="text-sm text-muted">No hay datos de lenguajes todavía.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              dataKey="percent"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {languages.map((lang, i) => (
                <Cell
                  key={lang.name}
                  fill={lang.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  stroke="var(--background)"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${Number(value).toFixed(1)}%`}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2 text-sm">
        {languages.map((lang, i) => (
          <li key={lang.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    lang.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                }}
              />
              {lang.name}
            </span>
            <span className="font-mono text-muted">
              {lang.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
