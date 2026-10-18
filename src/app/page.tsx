import Hero from "@/components/home/Hero";
import GithubTeaser from "@/components/home/GithubTeaser";
import StackSection from "@/components/home/StackSection";
import { getGithubStats } from "@/lib/github";
import type { GithubStats } from "@/lib/types";

export default async function Home() {
  const username = process.env.GITHUB_USERNAME ?? "sebastianGonzalez34";

  let stats: GithubStats | null = null;
  try {
    stats = await getGithubStats(username);
  } catch {
    // Sin token de GitHub configurado localmente: la sección de arriba
    // simplemente omite las métricas en vivo y enlaza al dashboard.
  }

  return (
    <div>
      <Hero />
      <div className="mx-auto max-w-5xl border-t border-border" />
      <GithubTeaser stats={stats} />
      <StackSection />
    </div>
  );
}
