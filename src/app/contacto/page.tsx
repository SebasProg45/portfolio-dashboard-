const links = [
  { label: "Email", href: "mailto:sebastian.gonzalezprog@gmail.com" },
  { label: "GitHub", href: "https://github.com/sebastianGonzalez34" },
];

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contacto</h1>
      <p className="mt-2 max-w-xl text-muted">
        ¿Quieres hablar de un proyecto o simplemente saludar? Escríbeme.
      </p>
      <ul className="mt-8 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="font-mono text-sm text-accent hover:underline"
            >
              {link.label} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
