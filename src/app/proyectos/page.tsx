const proyectos = [
  {
    title: "Portfolio Dashboard",
    description:
      "Este mismo sitio: portafolio con un dashboard que consume la API de GitHub para calcular métricas propias de actividad.",
    tags: ["Next.js", "TypeScript", "GitHub API"],
    href: "/dashboard",
  },
];

export default function ProyectosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
      <p className="mt-2 text-muted">Algunas cosas que he construido.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {proyectos.map((p) => (
          <a
            key={p.title}
            href={p.href}
            className="group rounded-lg border border-border p-6 transition-colors hover:bg-surface"
          >
            <h2 className="font-semibold group-hover:text-accent">
              {p.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
