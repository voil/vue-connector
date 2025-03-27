import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import GlobPlugin from "vite-plugin-glob";
const projectRootDir = resolve(__dirname)

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true
    }),
    GlobPlugin({
      restoreQueryExtension: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(projectRootDir, 'src'),
      '@/types': resolve(projectRootDir, 'src/types/*'),
      '@/assets': resolve(projectRootDir, 'src/assets/*'),
      '@/composables': resolve(projectRootDir, 'src/composables/*'),
      '@/components': resolve(projectRootDir, 'src/components/*'),
    },
  },
  build: {
    lib: {
      name: 'vue-connector',
      fileName: (format, name) => {
        return `${name}.${format === 'es' ? 'js' : 'umd.cjs'}`
      },
      entry: {
        index: resolve(__dirname, 'src/index.ts')
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          'vue': 'Vue',
        },
        assetFileNames: '[name].css',
        chunkFileNames: '[name].css',
      },
    },
    outDir: 'dist',
    cssCodeSplit: true,
    emptyOutDir: true,
  },
})