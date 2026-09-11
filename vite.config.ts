import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 使用函数式配置，可以直接从参数拿到 mode，避免使用 Node 全局变量 process，
// 这样无需安装 @types/node，也无需修改 tsconfig。
export default defineConfig(({ mode }) => ({
  // GitHub Pages 部署在子路径 https://2804420942.github.io/interview/ 下，
  // 因此打包资源需要加上 /interview/ 前缀；本地开发时保持根路径 /。
  base: mode === 'production' ? '/interview/' : '/',
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
}))