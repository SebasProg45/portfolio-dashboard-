import { fetchGithubStatsRaw, fetchPublicEvents } from "./github-client";
import {
  calculateActivityHeatmap,
  calculateLanguageStats,
  calculateStreaks,
  normalizeContributionDays,
  topRepos,
} from "./stats";
import type { GithubStats } from "./types";

export async function getGithubStats(username: string): Promise<GithubStats> {
  const [raw, events] = await Promise.all([
    fetchGithubStatsRaw(username),
    fetchPublicEvents(username),
  ]);

  if (!raw.user) {
    throw new Error(`No se encontró el usuario de GitHub "${username}"`);
  }

  const { contributionsCollection, repositories } = raw.user;
  const contributionCalendar = normalizeContributionDays(
    contributionsCollection.contributionCalendar.weeks
  );
  const { current, longest } = calculateStreaks(contributionCalendar);
  const { hourly, weekday } = calculateActivityHeatmap(events);

  return {
    username,
    totalContributions:
      contributionsCollection.contributionCalendar.totalContributions,
    currentStreak: current,
    longestStreak: longest,
    contributionCalendar,
    languages: calculateLanguageStats(repositories.nodes),
    topRepos: topRepos(repositories.nodes),
    hourlyActivity: hourly,
    weekdayActivity: weekday,
    totals: {
      commits: contributionsCollection.totalCommitContributions,
      pullRequests: contributionsCollection.totalPullRequestContributions,
      issues: contributionsCollection.totalIssueContributions,
      reviews: contributionsCollection.totalPullRequestReviewContributions,
    },
    generatedAt: new Date().toISOString(),
  };
}
