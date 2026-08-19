import { describe, expect, it } from "vitest";
import {
  calculateActivityHeatmap,
  calculateLanguageStats,
  calculateStreaks,
  topRepos,
} from "./stats";
import type { ContributionDay } from "./types";
import type { GraphQLRepoNode, PublicEvent } from "./github-client";

function day(date: string, count: number): ContributionDay {
  return { date, count, weekday: new Date(date).getDay() };
}

describe("calculateStreaks", () => {
  it("counts the longest run of active days anywhere in the calendar", () => {
    const days = [
      day("2026-08-01", 1),
      day("2026-08-02", 1),
      day("2026-08-03", 0),
      day("2026-08-04", 1),
      day("2026-08-05", 1),
      day("2026-08-06", 1),
      day("2026-08-07", 0),
    ];
    expect(calculateStreaks(days).longest).toBe(3);
  });

  it("counts the current streak backward from the last day", () => {
    const days = [
      day("2026-08-01", 1),
      day("2026-08-02", 0),
      day("2026-08-03", 1),
      day("2026-08-04", 1),
      day("2026-08-05", 1),
    ];
    expect(calculateStreaks(days).current).toBe(3);
  });

  it("does not break the current streak when today has no contributions yet", () => {
    const days = [
      day("2026-08-01", 1),
      day("2026-08-02", 1),
      day("2026-08-03", 0),
    ];
    expect(calculateStreaks(days).current).toBe(2);
  });

  it("returns zero for an all-empty calendar", () => {
    const days = [day("2026-08-01", 0), day("2026-08-02", 0)];
    expect(calculateStreaks(days)).toEqual({ current: 0, longest: 0 });
  });
});

function repo(
  name: string,
  stars: number,
  languages: { name: string; size: number; color: string }[]
): GraphQLRepoNode {
  return {
    name,
    url: `https://github.com/x/${name}`,
    description: null,
    stargazerCount: stars,
    pushedAt: "2026-01-01T00:00:00Z",
    primaryLanguage: languages[0] ? { name: languages[0].name } : null,
    languages: {
      edges: languages.map((l) => ({
        size: l.size,
        node: { name: l.name, color: l.color },
      })),
    },
  };
}

describe("calculateLanguageStats", () => {
  it("aggregates bytes across repos and computes percentages", () => {
    const repos = [
      repo("a", 1, [{ name: "TypeScript", size: 300, color: "#3178c6" }]),
      repo("b", 1, [
        { name: "TypeScript", size: 300, color: "#3178c6" },
        { name: "CSS", size: 400, color: "#563d7c" },
      ]),
    ];
    const result = calculateLanguageStats(repos);
    expect(result[0]).toMatchObject({ name: "TypeScript", percent: 60 });
    expect(result[1]).toMatchObject({ name: "CSS", percent: 40 });
  });

  it("returns an empty array when there is no language data", () => {
    expect(calculateLanguageStats([repo("empty", 0, [])])).toEqual([]);
  });
});

describe("topRepos", () => {
  it("sorts by stars descending and respects the limit", () => {
    const repos = [
      repo("low", 1, []),
      repo("high", 10, []),
      repo("mid", 5, []),
    ];
    const result = topRepos(repos, 2);
    expect(result.map((r) => r.name)).toEqual(["high", "mid"]);
  });
});

describe("calculateActivityHeatmap", () => {
  it("only counts PushEvents and weights by commit count", () => {
    const events: PublicEvent[] = [
      {
        type: "PushEvent",
        created_at: "2026-08-19T14:30:00Z",
        payload: { commits: [{ message: "a" }, { message: "b" }] },
      },
      { type: "WatchEvent", created_at: "2026-08-19T14:30:00Z" },
    ];
    const { hourly, weekday } = calculateActivityHeatmap(events);
    expect(hourly[14]).toBe(2);
    expect(weekday.reduce((a, b) => a + b, 0)).toBe(2);
  });
});
