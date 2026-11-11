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
          .filter(f => !f.startsWith('.') && !f.startsWith('raw_') && /\.(mp4|webm|mov)$/i.test(f))
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
          const m4aPath = targetPath.replace(/\.[^.]+$/, '.m4a')
          try {
            // 1. 오디오는 .m4a로 별도 추출 (WebAudio 재생용)
            try {
              execSync(`ffmpeg -y -i "${rawUploadPath}" -vn -c:a aac -b:a 128k "${m4aPath}"`, { stdio: 'pipe' })
            } catch {}
            // 2. 비디오(.mp4) 컨테이너는 -an(무음 트랙)으로 인코딩하여 크롬 '영어(자동 감지됨)' 자막 팝업 원천 차단
            execSync(`ffmpeg -y -i "${rawUploadPath}" -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -preset fast -an -movflags +faststart "${targetPath}"`, { stdio: 'pipe' })
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
            m4aUrl: `/demo_video/${path.basename(m4aPath)}`,
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

    // 3. POST /api/dub-video (신규 상품 동영상 등록 시 번역된 안내음성을 전용 .m4a로 생성하고 .mp4는 -an 무음 처리)
    if (url.pathname === '/api/dub-video' && req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}')
          const videoUrl = String(payload.videoUrl || '')
          const scriptText = String(payload.scriptText || '').replace(/["`$]/g, ' ').trim()
          const baseName = path.basename(decodeURIComponent(videoUrl.split('?')[0]))
          const dir = path.resolve(__dirname, 'public/demo_video')
          const mp4Path = path.resolve(dir, baseName)
          const m4aPath = mp4Path.replace(/\.[^.]+$/, '.m4a')
          const tmpWavPath = path.resolve(dir, `tmp_tts_${Date.now()}.wav`)
          const tmpMp4Path = path.resolve(dir, `tmp_vid_${Date.now()}.mp4`)

          if (scriptText && fs.existsSync(mp4Path)) {
            const psCmd = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; foreach($v in $s.GetInstalledVoices()){ if($v.VoiceInfo.Culture.Name -like 'en-*'){ $s.SelectVoice($v.VoiceInfo.Name); break } }; $s.Rate = -1; $s.SetOutputToWaveFile('${tmpWavPath.replace(/'/g, "''")}'); $s.Speak('${scriptText.replace(/'/g, "''")}'); $s.Dispose()`
            execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'pipe' })
            if (fs.existsSync(tmpWavPath)) {
              execSync(`ffmpeg -y -i "${tmpWavPath}" -af "adelay=800|800,apad=pad_dur=2" -c:a aac -b:a 128k "${m4aPath}"`, { stdio: 'pipe' })
              fs.unlinkSync(tmpWavPath)
            }
            execSync(`ffmpeg -y -i "${mp4Path}" -c:v copy -an "${tmpMp4Path}"`, { stdio: 'pipe' })
            if (fs.existsSync(tmpMp4Path)) {
              fs.renameSync(tmpMp4Path, mp4Path)
            }
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, m4aUrl: `/demo_video/${path.basename(m4aPath)}` }))
        } catch (err: any) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
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
