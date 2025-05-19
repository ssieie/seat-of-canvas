import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'z-rs-core': path.resolve(__dirname, 'src/zRS/z-rs-core.es.js')
    }
  },
  server: {
    open: true,
    port: 8888,
  }
})
