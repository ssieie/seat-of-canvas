import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'z-rs-lib-dev': path.resolve(__dirname, 'D:\\ZhaoXin\\Html\\vue-drag-demo\\src\\index.ts')
    }
  },
  server: {
    open: true,
    port: 8888,
  }
})
