import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from "dotenv";
dotenv.config(); // loads .env into process.env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()]

})
