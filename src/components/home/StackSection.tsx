const stack = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "GitHub GraphQL API",
  "PostgreSQL (Neon)",
  "Recharts",
];

export default function StackSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="font-mono text-sm text-accent">Stack</h2>
      <p className="mt-2 max-w-xl text-muted">
        Con qué está construido este sitio y el dashboard de GitHub.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
