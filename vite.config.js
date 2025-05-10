import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

const root = resolve(__dirname, "src");
const publicDir = resolve(__dirname, "public");

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root,
    publicDir,
    envDir: ".env",
    appType: "mpa",
  });
};
