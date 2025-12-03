// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import jsconfigPaths from 'vite-jsconfig-paths';

// export default defineConfig(({ mode }) => {
//   // depending on your application, base can also be "/"
//   const env = loadEnv(mode, process.cwd(), '');
//   const API_URL = `${env.VITE_APP_BASE_NAME}`;
//   const PORT = 3000;

//   return {
//     server: {
//       // this ensures that the browser opens upon server start
//       open: true,
//       // this sets a default port to 3000
//       port: PORT,
//       host: true
//     },
//     build: {
//       chunkSizeWarningLimit: 1600
//     },
//     preview: {
//       open: true,
//       host: true
//     },
//     define: {
//       global: 'window'
//     },
//     resolve: {
//       alias: {
//         // { find: '', replacement: path.resolve(__dirname, 'src') },
//         // {
//         //   find: /^~(.+)/,
//         //   replacement: path.join(process.cwd(), 'node_modules/$1')
//         // },
//         // {
//         //   find: /^src(.+)/,
//         //   replacement: path.join(process.cwd(), 'src/$1')
//         // }
//         // {
//         //   find: 'assets',
//         //   replacement: path.join(process.cwd(), 'src/assets')
//         // },
//         '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
//       }
//     },
//     base: API_URL,
//     plugins: [react(), jsconfigPaths()]
//   };
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: [
        'favicon.ico',
        'vite.svg', // file logo vite
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'Manajemen Operasional',
        short_name: 'ManOp',
        description: 'Aplikasi Manajemen Operasional',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'vite-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'vite-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'vite-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
