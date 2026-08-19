const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_REST_URL = "https://api.github.com";

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN no está definido. Crea un Personal Access Token (scope: read:user, public_repo) y agrégalo a .env.local"
    );
  }
  return token;
}

const STATS_QUERY = /* GraphQL */ `
  query UserStats($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          name
          url
          description
          stargazerCount
          pushedAt
          primaryLanguage {
            name
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export type GraphQLLanguageEdge = {
  size: number;
  node: { name: string; color: string | null };
};

export type GraphQLRepoNode = {
  name: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  pushedAt: string;
  primaryLanguage: { name: string } | null;
  languages: { edges: GraphQLLanguageEdge[] };
};

export type GraphQLContributionDay = {
  date: string;
  contributionCount: number;
  weekday: number;
};

export type GithubStatsResponse = {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
      totalPullRequestContributions: number;
      totalIssueContributions: number;
      totalPullRequestReviewContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: GraphQLContributionDay[] }[];
      };
    };
    repositories: { nodes: GraphQLRepoNode[] };
  } | null;
};

export async function fetchGithubStatsRaw(
  username: string
): Promise<GithubStatsResponse> {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: STATS_QUERY,
      variables: { login: username },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data as GithubStatsResponse;
}

export type PublicEvent = {
  type: string;
  created_at: string;
  payload?: {
    commits?: { message: string }[];
  };
};

export async function fetchPublicEvents(
  username: string
): Promise<PublicEvent[]> {
  const events: PublicEvent[] = [];
  for (let page = 1; page <= 3; page += 1) {
    const res = await fetch(
      `${GITHUB_REST_URL}/users/${username}/events/public?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `bearer ${getToken()}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) break;
    const batch = (await res.json()) as PublicEvent[];
    if (batch.length === 0) break;
    events.push(...batch);
    if (batch.length < 100) break;
  }
  return events;
}
