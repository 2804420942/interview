import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/interview/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    allowedHosts: [".preview.with.woa.com"],
    proxy: {
      '/oss-data': {
        target: 'https://interview-alic.oss-cn-guangzhou.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oss-data/, '/data'),
      }
    }
  }
})