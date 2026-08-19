import { getGithubStats } from "@/lib/github";
import { insertSnapshot } from "@/lib/snapshots";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const username = process.env.GITHUB_USERNAME ?? "sebastianGonzalez34";

  try {
    const stats = await getGithubStats(username);
    await insertSnapshot(stats);
    return Response.json({ ok: true, capturedAt: stats.generatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
