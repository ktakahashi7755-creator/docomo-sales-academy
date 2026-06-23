import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // GitHub Pages 等のサブパス配信では PAGES_BASE（例 "/docomo-sales-academy/"）を渡す。
  // 既定は "/"（ルート配信・ローカル開発）。
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
