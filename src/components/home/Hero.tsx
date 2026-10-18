import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 sm:pb-20 sm:pt-32">
        <p className="font-mono text-sm text-accent">Hola, soy</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Sebastian González
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
          Desarrollador de software. Construyo aplicaciones web y, en este
          sitio, un dashboard que analiza mi propia actividad en GitHub en
          tiempo real.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Ver dashboard
          </Link>
          <Link
            href="/proyectos"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            Ver proyectos
          </Link>
          <Link
            href="/sobre-mi"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Sobre mí →
          </Link>
        </div>
      </div>
    </section>
  );
}
