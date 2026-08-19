# Portfolio Dashboard

Portafolio personal con un dashboard que analiza mi propia actividad de
GitHub en tiempo real: rachas de commits, calendario de contribuciones,
lenguajes más usados, repos destacados y patrones de actividad por
hora/día. Incluye un cron job diario que guarda snapshots históricos en
Postgres para graficar la tendencia en el tiempo.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Recharts](https://recharts.org) para los gráficos
- GitHub GraphQL API + REST Events API para los datos
- [Neon](https://neon.tech) (Postgres serverless, vía Vercel Marketplace o directo) para los snapshots históricos
- [Vercel Cron](https://vercel.com/docs/cron-jobs) para disparar el snapshot diario
- [Vitest](https://vitest.dev) para los tests de las funciones de cálculo

## Setup local

```bash
npm install
cp .env.local.example .env.local
```

Completa `.env.local`:

- `GITHUB_TOKEN`: Personal Access Token de GitHub (scopes `read:user`,
  `public_repo`) — [crear uno aquí](https://github.com/settings/tokens).
- `GITHUB_USERNAME`: el usuario que se analiza.
- `DATABASE_URL` (opcional en desarrollo): connection string de Postgres.
  Sin esto, la sección de tendencia histórica del dashboard simplemente se
  oculta.
- `CRON_SECRET` (opcional en desarrollo, requerido en producción): protege
  `/api/cron/snapshot` contra llamadas no autorizadas.

```bash
npm run dev
```

## Scripts

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run lint    # ESLint
npm run test    # Vitest (funciones de cálculo en src/lib)
```

## Arquitectura de los datos

- `src/lib/github-client.ts` — llamadas crudas a la API de GitHub (GraphQL + REST).
- `src/lib/stats.ts` — funciones puras que calculan rachas, % por lenguaje,
  heatmap de actividad y top repos a partir de los datos crudos.
- `src/lib/github.ts` — orquesta cliente + cálculos y arma el objeto
  `GithubStats` que consume la UI.
- `src/lib/db.ts` / `src/lib/snapshots.ts` — conexión a Postgres e
  inserción/lectura de snapshots históricos.
- `src/app/api/cron/snapshot/route.ts` — endpoint que dispara el cron
  diario definido en `vercel.json`.

## Deploy en Vercel

1. Sube el repo a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new).
2. En **Storage**, agrega una base de datos Postgres (Neon) y conéctala al
   proyecto — esto define `DATABASE_URL` automáticamente.
3. Agrega las env vars `GITHUB_TOKEN`, `GITHUB_USERNAME` y `CRON_SECRET` en
   la configuración del proyecto.
4. Despliega. El cron definido en `vercel.json` (`/api/cron/snapshot`,
   diario a las 06:00 UTC) empieza a correr solo.
