
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
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
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              if (id.includes('framer-motion') || id.includes('motion') || id.includes('animejs')) {
                return 'animation-vendor';
              }
              if (id.includes('lucide-react') || id.includes('@radix-ui') || id.includes('embla-carousel')) {
                return 'ui-vendor';
              }
              if (id.includes('@supabase') || id.includes('@jsr/supabase')) {
                return 'supabase-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    server: {
      port: 5000,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  });