
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'figma:asset/efbec2c8a000b727f455221bcbe68500e8da9d01.png': path.resolve(__dirname, './src/assets/efbec2c8a000b727f455221bcbe68500e8da9d01.png'),
        'figma:asset/e0dadd06cc6f52211a0e08bf3e35bcfc83d2bc23.png': path.resolve(__dirname, './src/assets/e0dadd06cc6f52211a0e08bf3e35bcfc83d2bc23.png'),
        'figma:asset/ca956e2128254b147edffd6b45ad64dc6e70ccc0.png': path.resolve(__dirname, './src/assets/ca956e2128254b147edffd6b45ad64dc6e70ccc0.png'),
        'figma:asset/b2de5b3165ec4654c1f085d798694b51dec489ae.png': path.resolve(__dirname, './src/assets/b2de5b3165ec4654c1f085d798694b51dec489ae.png'),
        'figma:asset/b1f026e5b06da2564ae90baa5031d7c2c5ecfde1.png': path.resolve(__dirname, './src/assets/b1f026e5b06da2564ae90baa5031d7c2c5ecfde1.png'),
        'figma:asset/aaa4c771f642b9d0ece5cd76547437241dde83d5.png': path.resolve(__dirname, './src/assets/aaa4c771f642b9d0ece5cd76547437241dde83d5.png'),
        'figma:asset/a73abf717c8cb2b5e778476c386026bc5447bd78.png': path.resolve(__dirname, './src/assets/a73abf717c8cb2b5e778476c386026bc5447bd78.png'),
        'figma:asset/9ff6eddef9ca70eee5f510a4e124926ae69f4254.png': path.resolve(__dirname, './src/assets/9ff6eddef9ca70eee5f510a4e124926ae69f4254.png'),
        'figma:asset/9fa13760753c2875dd7d26a73dd47eccc00a364a.png': path.resolve(__dirname, './src/assets/9fa13760753c2875dd7d26a73dd47eccc00a364a.png'),
        'figma:asset/92b3f19660479c0d75b7e673f10f66ec1bfcbba8.png': path.resolve(__dirname, './src/assets/92b3f19660479c0d75b7e673f10f66ec1bfcbba8.png'),
        'figma:asset/7ced599f4d655b3c3d798c5d031d02646d11bfc3.png': path.resolve(__dirname, './src/assets/7ced599f4d655b3c3d798c5d031d02646d11bfc3.png'),
        'figma:asset/6b228892f4120af9e9ab99d96791a88cc008dc8d.png': path.resolve(__dirname, './src/assets/6b228892f4120af9e9ab99d96791a88cc008dc8d.png'),
        'figma:asset/6666d2d060f59c5fbfa90907542bc8fca8bc0a4a.png': path.resolve(__dirname, './src/assets/6666d2d060f59c5fbfa90907542bc8fca8bc0a4a.png'),
        'figma:asset/5fd055599f5ee43f9e36057db9addbf5d79ca68e.png': path.resolve(__dirname, './src/assets/5fd055599f5ee43f9e36057db9addbf5d79ca68e.png'),
        'figma:asset/46ff4cae0f268156a0e7794e8a387a8d64db55da.png': path.resolve(__dirname, './src/assets/46ff4cae0f268156a0e7794e8a387a8d64db55da.png'),
        'figma:asset/3fbc46d04b02165989d148069378d1cc20779417.png': path.resolve(__dirname, './src/assets/3fbc46d04b02165989d148069378d1cc20779417.png'),
        'figma:asset/28224c9e999f1dac33e62c4b101cb36d5714b2be.png': path.resolve(__dirname, './src/assets/28224c9e999f1dac33e62c4b101cb36d5714b2be.png'),
        'figma:asset/23503bc3325694b212c3983be418285b882f20c8.png': path.resolve(__dirname, './src/assets/23503bc3325694b212c3983be418285b882f20c8.png'),
        'figma:asset/19d4a7f8955ee93e73385f95d75ac53c7754f201.png': path.resolve(__dirname, './src/assets/19d4a7f8955ee93e73385f95d75ac53c7754f201.png'),
        'figma:asset/1897beb0d120d7f8f93a7e51b8bc74e971678137.png': path.resolve(__dirname, './src/assets/1897beb0d120d7f8f93a7e51b8bc74e971678137.png'),
        'figma:asset/188848743a7955c420f3aa9e53b1ad8a36c37aef.png': path.resolve(__dirname, './src/assets/188848743a7955c420f3aa9e53b1ad8a36c37aef.png'),
        'figma:asset/1253f3bdc503d1419fa74efcfbe871b2538a54b3.png': path.resolve(__dirname, './src/assets/1253f3bdc503d1419fa74efcfbe871b2538a54b3.png'),
        'figma:asset/03c6badb4ca3300cb50c2776b203004544d11ab3.png': path.resolve(__dirname, './src/assets/03c6badb4ca3300cb50c2776b203004544d11ab3.png'),
        'figma:asset/cfaeb5454460dc9e5a1c0e3885ebc636b897a0.png': path.resolve(__dirname, './src/assets/cfaeb5454460dc9e5a1c0e3885ebc636b897a0.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Vendor splitting only applies to the browser bundle. In an SSR
          // build react/react-dom are external, and Rollup errors if an
          // external module is named in manualChunks.
          manualChunks: isSsrBuild
            ? undefined
            : {
                'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                'animation-vendor': ['framer-motion'],
              }
        }
      }
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    server: {
      port: Number(process.env.PORT) || 5000,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  }));