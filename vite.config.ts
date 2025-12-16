import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 使用 '.' 代表当前目录，避免 process.cwd() 可能带来的问题
  // 第三个参数 '' 表示加载所有变量
  const env = loadEnv(mode, '.', '');
  
  // 优先取系统环境变量，其次取 .env 文件
  const apiKey = process.env.API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    base: '/flavor-collection/', 
    define: {
      // 注入 API_KEY
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})