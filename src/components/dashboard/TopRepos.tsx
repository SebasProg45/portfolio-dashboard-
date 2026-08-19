import type { RepoStat } from "@/lib/types";

export default function TopRepos({ repos }: { repos: RepoStat[] }) {
  if (repos.length === 0) {
    return <p className="text-sm text-muted">No hay repositorios todavía.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {repos.map((repo) => (
        <li key={repo.name} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="truncate font-mono text-sm font-medium hover:text-accent"
            >
              {repo.name}
            </a>
            {repo.description ? (
              <p className="truncate text-xs text-muted">{repo.description}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
            {repo.primaryLanguage ? <span>{repo.primaryLanguage}</span> : null}
            <span>★ {repo.stars}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
