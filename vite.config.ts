import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: '/flavor-collection/', 
    define: {
      // 优先使用 process.env.API_KEY (GitHub Actions 注入的环境变量)
      // 如果没有，再尝试读取本地 .env 文件中的 API_KEY
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || '')
    }
  }
})
