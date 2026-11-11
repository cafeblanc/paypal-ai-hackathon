import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type Connect } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const devActiveViewers = new Map<string, number>()

function demoVideoPlugin(): Plugin {
  const handler: Connect.SimpleHandleFunction = (req, res, next) => {
    const url = new URL(req.url || '', 'http://localhost')
    
    // 0. GET /api/viewers (실제 실시간 다중 디바이스 시청자 동기화)
    if (url.pathname === '/api/viewers') {
      const now = Date.now()
      const id = url.searchParams.get('id')
      const action = url.searchParams.get('action')
      if (id) {
        if (action === 'leave') {
          devActiveViewers.delete(id)
        } else {
          devActiveViewers.set(id, now)
        }
      }
      for (const [vId, ts] of devActiveViewers.entries()) {
        if (now - ts > 7000) {
          devActiveViewers.delete(vId)
        }
      }
      const count = Math.max(1, devActiveViewers.size)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ count, success: true, timestamp: now }))
      return
    }
    
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
        const rawUploadPath = path.resolve(dir, `raw_${Date.now()}_${fileName}`)

        const fileStream = fs.createWriteStream(rawUploadPath)
        req.pipe(fileStream)

        fileStream.on('finish', () => {
          try {
            // 사용자 요청: 동영상 업로드 시 웹 스트리밍 최적화 압축(CRF 28, 720p, faststart)을 자동 실행하여 저장
            execSync(`ffmpeg -y -i "${rawUploadPath}" -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "${targetPath}"`, { stdio: 'pipe' })
            if (fs.existsSync(rawUploadPath)) fs.unlinkSync(rawUploadPath)
          } catch (compressErr) {
            console.warn('FFmpeg auto-compression fallback to raw file:', compressErr)
            if (fs.existsSync(rawUploadPath)) {
              if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath)
              fs.renameSync(rawUploadPath, targetPath)
            }
          }

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
  define: {
    'import.meta.env.ADMIN_PASSWD': JSON.stringify(process.env.ADMIN_PASSWD || process.env.VITE_ADMIN_PASSWD || ''),
    'process.env.ADMIN_PASSWD': JSON.stringify(process.env.ADMIN_PASSWD || process.env.VITE_ADMIN_PASSWD || '')
  }
})
