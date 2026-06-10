import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations connect directly (bypassing Neon's pooler). The app's
  // PrismaClient uses DATABASE_URL (pooled) via the adapter in src/lib/prisma.ts.
  // Fall back to DATABASE_URL so `prisma generate` (postinstall) doesn't
  // require DIRECT_URL to be set in environments that only run the build.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
