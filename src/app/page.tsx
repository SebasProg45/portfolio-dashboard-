import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-sm text-accent">Hola, soy</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Sebastian González
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Desarrollador de software. Construyo aplicaciones web y, en este
        sitio, un dashboard que analiza mi propia actividad en GitHub en
        tiempo real.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Ver dashboard
        </Link>
        <Link
          href="/proyectos"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
        >
          Ver proyectos
        </Link>
      </div>
    </div>
  );
}
