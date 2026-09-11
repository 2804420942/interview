import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // GitHub Pages 部署在子路径 https://2804420942.github.io/interview/ 下，
  // 因此打包资源需要加上 /interview/ 前缀；本地开发时保持根路径 /。
  base: process.env.NODE_ENV === 'production' ? '/interview/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    allowedHosts: [".preview.with.woa.com,.devnet-preview.with.woa.com"],
    proxy: {
      '/oss-data': {
        target: 'https://interview-alic.oss-cn-guangzhou.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oss-data/, '/data'),
      }
    }
  }
})