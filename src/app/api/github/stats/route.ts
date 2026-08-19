import { getGithubStats } from "@/lib/github";

export async function GET() {
  const username = process.env.GITHUB_USERNAME ?? "sebastianGonzalez34";

  try {
    const stats = await getGithubStats(username);
    return Response.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
