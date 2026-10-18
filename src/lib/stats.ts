import type {
  GraphQLContributionDay,
  GraphQLRepoNode,
  PublicEvent,
} from "./github-client";
import type { ContributionDay, LanguageStat, Project, RepoStat } from "./types";

export function normalizeContributionDays(
  weeks: { contributionDays: GraphQLContributionDay[] }[]
): ContributionDay[] {
  return weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      weekday: day.weekday,
    }))
  );
}

/**
 * Longest streak scans the whole calendar. Current streak walks backward from
 * today; today itself is skipped when it has zero contributions since the
 * day may simply not be over yet.
 */
export function calculateStreaks(days: ContributionDay[]): {
  current: number;
  longest: number;
} {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    if (day.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  let idx = days.length - 1;
  if (idx >= 0 && days[idx].count === 0) idx -= 1;
  let current = 0;
  while (idx >= 0 && days[idx].count > 0) {
    current += 1;
    idx -= 1;
  }

  return { current, longest };
}

export function calculateLanguageStats(
  repos: GraphQLRepoNode[],
  limit = 8
): LanguageStat[] {
  const bytesByLanguage = new Map<string, { bytes: number; color: string | null }>();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const existing = bytesByLanguage.get(edge.node.name);
      if (existing) {
        existing.bytes += edge.size;
      } else {
        bytesByLanguage.set(edge.node.name, {
          bytes: edge.size,
          color: edge.node.color,
        });
      }
    }
  }

  const totalBytes = Array.from(bytesByLanguage.values()).reduce(
    (sum, v) => sum + v.bytes,
    0
  );
  if (totalBytes === 0) return [];

  return Array.from(bytesByLanguage.entries())
    .map(([name, { bytes, color }]) => ({
      name,
      color,
      bytes,
      percent: (bytes / totalBytes) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, limit);
}

export function topRepos(repos: GraphQLRepoNode[], limit = 6): RepoStat[] {
  return [...repos]
    .sort((a, b) => b.stargazerCount - a.stargazerCount)
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name,
      url: repo.url,
      description: repo.description,
      stars: repo.stargazerCount,
      primaryLanguage: repo.primaryLanguage?.name ?? null,
      pushedAt: repo.pushedAt,
    }));
}

export function calculateActivityHeatmap(events: PublicEvent[]): {
  hourly: number[];
  weekday: number[];
} {
  const hourly = new Array(24).fill(0);
  const weekday = new Array(7).fill(0);

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const weight = event.payload?.commits?.length ?? 1;
    const date = new Date(event.created_at);
    hourly[date.getUTCHours()] += weight;
    weekday[date.getUTCDay()] += weight;
  }

  return { hourly, weekday };
}

/**
 * Turns a repo name into a display title: "asistencia-catequesis" ->
 * "Asistencia Catequesis", trailing/leading hyphens dropped.
 */
export function formatRepoTitle(name: string): string {
  return name
    .replace(/^-+|-+$/g, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Maps every non-archived repo to a portfolio project card, most recently
 * pushed first. No manual curation: a new repo shows up here automatically
 * once it has a GitHub description set (otherwise the card just omits it).
 */
export function toProjects(repos: GraphQLRepoNode[]): Project[] {
  return repos
    .filter((repo) => !repo.isArchived)
    .map((repo) => ({
      title: formatRepoTitle(repo.name),
      description: repo.description,
      languages: repo.languages.edges.map((edge) => edge.node.name),
      url: repo.url,
      pushedAt: repo.pushedAt,
    }));
}
