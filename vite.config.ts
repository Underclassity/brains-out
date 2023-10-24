import { defineConfig, splitVendorChunkPlugin, type PluginOption } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import vue from "@vitejs/plugin-vue";
import process from "child_process";
import packageJson from "./package.json";

const commitHash = process.execSync("git rev-parse --short HEAD").toString();

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", // will be saved in project's root
    }) as PluginOption,
  ],
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(commitHash),
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
});
