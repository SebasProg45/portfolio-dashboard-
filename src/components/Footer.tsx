export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Sebastian González</p>
        <p className="font-mono">Next.js · TypeScript · Tailwind</p>
      </div>
    </footer>
  );
}
