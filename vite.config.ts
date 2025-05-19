import {defineConfig} from 'vite';
import * as path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/core/core.ts'), // 入口文件
      name: 'ZRS', // UMD 全局变量名
      formats: ['es', 'umd'],
      fileName: (format) => `z-rs-core.${format}.js`,
    },
    // rollupOptions: {
    // 第三方依赖（如 lodash），可通过 external 排除
    //   external: ['rbush'],
    //   output: {
    //     globals: {
    //       rbush: 'RBush'
    //     }
    //   }
    // },
  },
});
