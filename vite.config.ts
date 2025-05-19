import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js', // 入口文件
      name: 'MyCanvasCore', // UMD 全局变量名
      fileName: (format) => `my-canvas-core.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // 第三方依赖（如 lodash），可通过 external 排除
      external: ['rbush'],
      output: {
        globals: {
          rbush: 'RBush'
        }
      }
    },
  },
});
