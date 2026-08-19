import StatCard from "@/components/dashboard/StatCard";
import ContributionHeatmap from "@/components/dashboard/ContributionHeatmap";
import LanguageBreakdown from "@/components/dashboard/LanguageBreakdown";
import ActivityPatterns from "@/components/dashboard/ActivityPatterns";
import TopRepos from "@/components/dashboard/TopRepos";
import TrendChart from "@/components/dashboard/TrendChart";
import { getGithubStats } from "@/lib/github";
import { getRecentSnapshots, type Snapshot } from "@/lib/snapshots";

export default async function DashboardPage() {
  const username = process.env.GITHUB_USERNAME ?? "sebastianGonzalez34";

  let stats;
  let error: string | null = null;
  try {
    stats = await getGithubStats(username);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido";
  }

  let snapshots: Snapshot[] = [];
  try {
    snapshots = await getRecentSnapshots();
  } catch {
    // DATABASE_URL no configurado todavía: la sección de tendencia se oculta.
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          GitHub Activity Dashboard
        </h1>
        <div className="mt-8 rounded-lg border border-dashed border-border p-8">
          <p className="text-sm font-medium text-foreground">
            No se pudo cargar la actividad de GitHub todavía.
          </p>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>
              Crea un Personal Access Token en{" "}
              <span className="font-mono">github.com/settings/tokens</span>{" "}
              (scopes: <span className="font-mono">read:user</span>,{" "}
              <span className="font-mono">public_repo</span>).
            </li>
            <li>
              Copia <span className="font-mono">.env.local.example</span> a{" "}
              <span className="font-mono">.env.local</span> y pega el token
              ahí (nunca lo compartas en el chat).
            </li>
            <li>Reinicia el servidor de desarrollo.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          GitHub Activity Dashboard
        </h1>
        <p className="font-mono text-xs text-muted">@{stats.username}</p>
      </div>
      <p className="mt-2 text-muted">
        Métricas propias calculadas a partir de mi actividad real en GitHub.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contribuciones (1 año)" value={stats.totalContributions} />
        <StatCard
          label="Racha actual"
          value={`${stats.currentStreak} días`}
        />
        <StatCard
          label="Racha más larga"
          value={`${stats.longestStreak} días`}
        />
        <StatCard label="Commits totales" value={stats.totals.commits} />
      </div>

      <section className="mt-10 rounded-lg border border-border p-6">
        <h2 className="font-semibold">Calendario de contribuciones</h2>
        <div className="mt-4">
          <ContributionHeatmap days={stats.contributionCalendar} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border p-6">
          <h2 className="font-semibold">Lenguajes más usados</h2>
          <div className="mt-4">
            <LanguageBreakdown languages={stats.languages} />
          </div>
        </section>

        <section className="rounded-lg border border-border p-6">
          <h2 className="font-semibold">Repos destacados</h2>
          <div className="mt-4">
            <TopRepos repos={stats.topRepos} />
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-border p-6">
        <h2 className="font-semibold">Patrones de actividad</h2>
        <div className="mt-4">
          <ActivityPatterns
            hourly={stats.hourlyActivity}
            weekday={stats.weekdayActivity}
          />
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border p-6">
        <h2 className="font-semibold">Tendencia histórica</h2>
        {snapshots.length >= 2 ? (
          <div className="mt-4">
            <TrendChart snapshots={snapshots} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Aún no hay suficientes snapshots. El cron job diario
            (`/api/cron/snapshot`) va guardando un punto por día; vuelve en
            unos días para ver la tendencia.
          </p>
        )}
      </section>

      <p className="mt-6 text-xs text-muted">
        Actualizado: {new Date(stats.generatedAt).toLocaleString("es")}
      </p>
    </div>
  );
}
