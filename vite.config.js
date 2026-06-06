import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages 배포 시 파일들의 경로가 깨지지 않도록 상대 경로로 설정
})
