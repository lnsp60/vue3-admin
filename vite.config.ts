import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      // 声明@代替src文件夹
      '@': path.resolve(__dirname, "./src")
    }
  }
})
