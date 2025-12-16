import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/flavor-collection/', // 这一行非常重要，必须匹配你的 GitHub 仓库名
})