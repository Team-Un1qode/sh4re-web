import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";


export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    envDir: ".env",
    appType: "mpa",
    build: {
      outDir: "../dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          write: resolve(__dirname, "write.html"),
          post: resolve(__dirname, "post.html")
        }
      }
    },
  });
};
