import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.jsx', '.tsx', '.js', '.ts', '.json']
  },
  server: {
    host: true,
    port: 5173
  }
})
