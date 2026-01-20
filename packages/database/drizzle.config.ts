import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

config({ path: "./../../.env" });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
