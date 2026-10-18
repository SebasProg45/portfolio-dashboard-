import { getProjects } from "@/lib/github";

export default async function ProyectosPage() {
  const username = process.env.GITHUB_USERNAME ?? "sebastianGonzalez34";

  let proyectos;
  let error: string | null = null;
  try {
    proyectos = await getProjects(username);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error desconocido";
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
      <p className="mt-2 text-muted">
        Se cargan automáticamente desde mis repositorios de GitHub.
      </p>

      {error || !proyectos ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-sm text-muted">
          No se pudieron cargar los proyectos todavía. {error}
        </div>
      ) : proyectos.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-8 text-sm text-muted">
          Todavía no hay repositorios públicos que mostrar.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {proyectos.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-border p-6 transition-colors hover:bg-surface"
            >
              <h2 className="font-semibold group-hover:text-accent">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {p.description ?? "Sin descripción todavía en GitHub."}
              </p>
              {p.languages.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.languages.slice(0, 4).map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
