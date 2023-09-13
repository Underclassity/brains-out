import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import process from "child_process";

const commitHash = process.execSync("git rev-parse --short HEAD").toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(commitHash),
  },
});
