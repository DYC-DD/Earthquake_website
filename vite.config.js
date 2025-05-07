import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/QuakeWeatherWeb/",
  plugins: [react()],
  server: {
    open: true,
  },
});
