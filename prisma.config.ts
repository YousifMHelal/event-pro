import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations connect directly (bypassing Neon's pooler). The app's
  // PrismaClient uses DATABASE_URL (pooled) via the adapter in src/lib/prisma.ts.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
