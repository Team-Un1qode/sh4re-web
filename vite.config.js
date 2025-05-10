import { resolve } from "node:path";
import { defineConfig } from "vite";
const root = resolve(__dirname, "src");
const publicDir = resolve(__dirname, "public");
export default defineConfig({
  root,
  publicDir,
  appType: "mpa",
});
