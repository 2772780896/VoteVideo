import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',  // 修改：开发时使用根路径，部署时再改回 '/VoteVideo'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 配置代理：把 /api 请求转发到后端服务器
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 后端服务器地址
        changeOrigin: true,  // 修改请求头的 Origin
        // rewrite: (path) => path.replace(/^\/api/, '/api')  // 不需要重写路径
      }
    }
  }
})
