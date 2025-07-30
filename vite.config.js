import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'iconify-icon',
          },
        },
      }),
      vueDevTools(),
    ],
    base: env.VITE_BASE || '/',
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/scss/base/variable" as *;
          @use "@/assets/scss/mixin/function" as *;
          @use "@/assets/scss/mixin/mixin" as *;
        `,
        },
      },
    },
  };
});

// export default defineConfig({

// });
