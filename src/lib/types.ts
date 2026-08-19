export type ContributionDay = {
  date: string;
  count: number;
  weekday: number;
};

export type LanguageStat = {
  name: string;
  color: string | null;
  percent: number;
  bytes: number;
};

export type RepoStat = {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  primaryLanguage: string | null;
  pushedAt: string;
};

export type GithubStats = {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributionCalendar: ContributionDay[];
  languages: LanguageStat[];
  topRepos: RepoStat[];
  hourlyActivity: number[];
  weekdayActivity: number[];
  totals: {
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  };
  generatedAt: string;
};
