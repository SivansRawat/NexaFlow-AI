import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",   // allow LAN access
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("pdfjs-dist") ||
              id.includes("pdf-lib") ||
              id.includes("jspdf") ||
              id.includes("jspdf-autotable")
            ) {
              return "pdf-vendor";
            }
            if (
              id.includes("xlsx") ||
              id.includes("docx") ||
              id.includes("pptxgenjs")
            ) {
              return "excel-vendor";
            }
            if (id.includes("recharts")) {
              return "chart-vendor";
            }
          }
        },
      },
    },
  },
  base: '/',
})
