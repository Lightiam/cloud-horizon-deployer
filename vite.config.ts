import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: 'buffer',
      events: 'events',
      stream: 'stream-browserify',
      util: 'util'
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.version': '"v18.0.0"',
    'process.platform': '"browser"'
  },
  optimizeDeps: {
    include: [
      'buffer',
      'events', 
      'stream-browserify',
      'util',
      '@aws-sdk/client-ec2', 
      '@aws-sdk/client-s3', 
      '@google-cloud/storage'
    ]
  }
}));
