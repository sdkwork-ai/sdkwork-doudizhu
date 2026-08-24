import { resolveBrowserDistOutDir } from '../../../sdkwork-specs/tools/browser-dist-layout.mjs';
function resolveViteEnvironment(mode, processEnv = process.env) {
  const profileMatch = /^(standalone|cloud)\.(development|test|staging|production)$/u.exec(mode ?? '');
  return profileMatch?.[2]
    ?? (['development', 'test', 'staging', 'production'].includes(processEnv.SDKWORK_ENVIRONMENT ?? '')
      ? processEnv.SDKWORK_ENVIRONMENT
      : 'production');
}
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    build: {
      outDir: resolveBrowserDistOutDir(resolveViteEnvironment(mode, process.env)),
      emptyOutDir: true,
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.SDKWORK_ACCESS_TOKEN': JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/app/v3/api': {
          target: env.VITE_DOUDIZHU_API_BASE_URL ?? 'http://127.0.0.1:8096',
          changeOrigin: true,
        },
      },
    },
  };
});
