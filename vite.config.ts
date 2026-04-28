// @lovable.dev/vite-tanstack-config already includes the following
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks para mejor caching
          'vendor-react': ['react', 'react-dom'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'vendor-animations': ['framer-motion'],
        },
      },
    },
  },
});