import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL no está definido. Conecta una base de datos Postgres (Neon, vía Vercel Marketplace o neon.tech) y agrégala a .env.local"
    );
  }
  return neon(url);
}
