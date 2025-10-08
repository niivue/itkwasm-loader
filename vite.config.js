import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["itk-wasm", "@itk-wasm/mesh-io", "@itk-wasm/image-io", "@thewtex/zstddec"],
  },
});
