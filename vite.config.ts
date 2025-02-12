import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import {api_proxy_addr, dest_root, img_proxy_addr} from "./src/target_config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  base: dest_root,
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, "/"),
      },
    },
  },

})
