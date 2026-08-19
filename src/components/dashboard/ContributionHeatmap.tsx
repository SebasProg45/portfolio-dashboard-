import type { ContributionDay } from "@/lib/types";

function chunkIntoWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function levelFor(count: number, max: number): number {
  if (count === 0) return 0;
  if (max <= 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const levelClasses = [
  "bg-border",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

export default function ContributionHeatmap({
  days,
}: {
  days: ContributionDay[];
}) {
  const weeks = chunkIntoWeeks(days);
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} contribuciones`}
                className={`h-3 w-3 rounded-sm ${levelClasses[levelFor(day.count, max)]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted">
        <span>Menos</span>
        {levelClasses.map((cls, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
}
