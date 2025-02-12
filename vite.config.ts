import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from "node:fs";
import * as path from "node:path";
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3001,
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
