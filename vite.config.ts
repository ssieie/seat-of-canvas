import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ZRS',
      formats: ['es', 'umd'],
      fileName: (format) => `z-rs-core.${format}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: 'z-rs-core.[format].js',
        chunkFileNames: 'z-rs-[name].[format].js',
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return 'z-rs-lib.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      include: ['src/**/*.ts'],
      insertTypesEntry: true,
    }),
  ],
});
