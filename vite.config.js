import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default defineConfig({
  root,
  outDir,
  publicDir,
  appType: "mpa",
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        write: resolve(root, "write.html"),
      },
    },
  },
});
