import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type Connect } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function demoVideoPlugin(): Plugin {
  const handler: Connect.SimpleHandleFunction = (req, res, next) => {
    const url = new URL(req.url || '', 'http://localhost')
    
    // 1. GET /api/list-demo-videos
    if (url.pathname === '/api/list-demo-videos' && req.method === 'GET') {
      try {
        const dir = path.resolve(__dirname, 'public/demo_video')
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        const files = fs.readdirSync(dir)
          .filter(f => !f.startsWith('.'))
          .map(file => {
            const stat = fs.statSync(path.join(dir, file))
            return {
              name: file,
              path: `/demo_video/${file}`,
              size: stat.size,
              updatedAt: stat.mtimeMs
            }
          })
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ files }))
      } catch (err: any) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message }))
      }
      return
    }

    // 2. POST /api/upload-video
    if (url.pathname === '/api/upload-video' && req.method === 'POST') {
      try {
        const rawName = (req.headers['x-file-name'] as string) || `demo_${Date.now()}.mp4`
        let fileName = decodeURIComponent(rawName)
        // Remove characters forbidden on Windows while preserving Korean / Unicode letters
        fileName = fileName.replace(/[\/\\:*?"<>|]/g, '_')
        fileName = path.basename(fileName)
        if (!fileName) fileName = `video_${Date.now()}.mp4`

        const dir = path.resolve(__dirname, 'public/demo_video')
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        const targetPath = path.resolve(dir, fileName)

        const fileStream = fs.createWriteStream(targetPath)
        req.pipe(fileStream)

        fileStream.on('finish', () => {
          const stat = fs.statSync(targetPath)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true,
            fileName,
            url: `/demo_video/${fileName}`,
            size: stat.size,
            absolutePath: targetPath
          }))
        })

        fileStream.on('error', (err) => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        })
      } catch (err: any) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message }))
      }
      return
    }

    next()
  }

  return {
    name: 'demo-video-upload-plugin',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), demoVideoPlugin()],
})
