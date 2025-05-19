import {defineConfig} from 'vite';
import * as path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // 入口文件
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
  plugins: [dts({
    outDir: 'dist/types',
    include: ['src'],
    insertTypesEntry: true, // 为 package.json 添加 types
  })],
});
