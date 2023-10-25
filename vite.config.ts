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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("three") && id.includes("/jsm/")) {
              return "three-jsm";
            } else if (id.includes("three")) {
              return "three";
            } else if (id.includes("vue")) {
              return "vue";
            }

            return "vendor";
          }

          if (id.includes("helpers/blocks/")) {
            return "blocks";
          }

          if (id.includes("helpers/")) {
            return "helpers";
          }
        },
      },
    },
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(commitHash),
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
});
