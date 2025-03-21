import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Habilita Jest-like assertions (expect, toBe, etc.)
    environment: "jsdom", // Simula el DOM en las pruebas
    setupFiles: "./src/setupTests.ts", // Archivo de configuración
    coverage: {
      provider: "istanbul", // Opcional: Para reporte de cobertura de código
    },
  },
});
