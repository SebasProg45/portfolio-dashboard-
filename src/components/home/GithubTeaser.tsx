import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import type { GithubStats } from "@/lib/types";

export default function GithubTeaser({
  stats,
}: {
  stats: GithubStats | null;
}) {
  const topLanguage = stats?.languages[0]?.name ?? null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="font-mono text-sm text-accent">En vivo desde GitHub</h2>
      <p className="mt-2 max-w-xl text-muted">
        Este portafolio incluye un dashboard que analiza mi actividad real en
        GitHub: rachas de commits, lenguajes más usados y patrones de
        actividad.
      </p>

      <div className="mt-6 rounded-lg border border-border p-6">
        {stats ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Contribuciones (1 año)"
              value={stats.totalContributions}
            />
            <StatCard
              label="Racha actual"
              value={`${stats.currentStreak} días`}
            />
            <StatCard
              label="Lenguaje principal"
              value={topLanguage ?? "—"}
            />
          </div>
        ) : (
          <p className="text-sm text-muted">
            Las métricas en vivo se cargan en el dashboard completo.
          </p>
        )}

        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Ver dashboard completo →
        </Link>
      </div>
    </section>
  );
}
