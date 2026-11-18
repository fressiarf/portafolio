// Procesa los assets del sitio (lo ejecuta el orquestador, no forma parte del bundle).
// - Avatares: fondo blanco para los GIFs con fondo gris, Jaehee estÃ¡tico, retratos PNG = primer cuadro.
// - Proyectos: PNG -> WebP a 960px de ancho.
// Uso: node scripts/process-assets.mjs
import sharp from 'sharp'
import gifenc from 'gifenc'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const { GIFEncoder, quantize, applyPalette } = gifenc
const ROOT = path.resolve(import.meta.dirname, '..')
const AV = path.join(ROOT, 'public', 'avatars')
const PROJ = path.join(ROOT, 'public', 'projects')
const INV = path.resolve(ROOT, '..', 'investigacion')

async function readFrames(file, width = 160) {
  const meta = await sharp(file, { animated: true }).metadata()
  const img = sharp(file, { animated: true }).resize({ width, withoutEnlargement: true })
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const n = meta.pages || 1
  const ph = Math.round(info.height / n)
  const size = w * ph * 4
  const frames = Array.from({ length: n }, (_, i) => new Uint8ClampedArray(data.subarray(i * size, (i + 1) * size)))
  const delay = meta.delay || Array(n).fill(80)
  return { w, h: ph, frames, delay }
}

// Flood fill desde los bordes: pinta de blanco el fondo conectado parecido al color del borde.
function whitenBackground(px, w, h, tol = 42) {
  const seen = new Uint8Array(w * h)
  const stack = []
  let sR = 0, sG = 0, sB = 0
  const near = (i, r, g, b) => Math.abs(px[i] - r) + Math.abs(px[i + 1] - g) + Math.abs(px[i + 2] - b) <= tol
  const pushIf = (x, y, r, g, b) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const p = y * w + x
    if (seen[p]) return
    if (!near(p * 4, r, g, b)) return
    seen[p] = 1
    stack.push(p)
  }
  for (let x = 0; x < w; x++) for (const y of [0, h - 1]) seed(x, y)
  for (let y = 0; y < h; y++) for (const x of [0, w - 1]) seed(x, y)
  function seed(x, y) {
    const i = (y * w + x) * 4
    if (seen[y * w + x]) return
    sR = px[i]; sG = px[i + 1]; sB = px[i + 2]
    pushIf(x, y, sR, sG, sB)
    while (stack.length) {
      const p = stack.pop()
      const q = p * 4
      const r = px[q], g = px[q + 1], b = px[q + 2]
      px[q] = px[q + 1] = px[q + 2] = 255
      px[q + 3] = 255
      const cx = p % w, cy = (p - cx) / w
      // compara siempre con el color del borde (sR,sG,sB), asÃ­ no "camina" hacia el personaje
      void r; void g; void b
      pushIf(cx + 1, cy, sR, sG, sB); pushIf(cx - 1, cy, sR, sG, sB); pushIf(cx, cy + 1, sR, sG, sB); pushIf(cx, cy - 1, sR, sG, sB)
    }
  }
  return px
}

// Cuadros completos (el diff con transparencia daba fondos de color en el navegador).
function encodeGif({ w, h, frames, delay }) {
  const gif = GIFEncoder()
  frames.forEach((f, i) => {
    const palette = quantize(f, 64)
    gif.writeFrame(applyPalette(f, palette), w, h, { palette, delay: delay[i] ?? 80 })
  })
  gif.finish()
  return Buffer.from(gif.bytes())
}

async function firstFramePng(gifFile, pngFile) {
  await sharp(gifFile, { pages: 1 }).png().toFile(pngFile)
}

async function avatars() {
  const orig = path.join(INV, 'originales', 'avatars')
  // Ray/Unknown viene en 220x196: se completa a cuadrado con blanco arriba para que llene el marco
  {
    const ray = await readFrames(path.join(INV, 'gifs-candidatos-2', 'unknown2-4.gif'), 220)
    const side = Math.max(ray.w, ray.h)
    const padTop = side - ray.h
    ray.frames = ray.frames.map((f) => {
      const out = new Uint8ClampedArray(side * side * 4).fill(255)
      out.set(f, padTop * side * 4)
      return out
    })
    ray.h = side
    await writeFile(path.join(AV, 'unknown.gif'), encodeGif(ray))
  }
  // MC: ilustraciÃ³n fija (primer cuadro) con su fondo original, decisiÃ³n de la clienta
  {
    const mc = await readFrames(path.join(orig, 'mc.gif'), 160)
    await writeFile(path.join(AV, 'mc.gif'), encodeGif({ ...mc, frames: [mc.frames[0]], delay: [1000] }))
  }
  // Fondo plano (gris o verde claro) -> blanco
  const sources = {
    jumin: path.join(orig, 'jumin.gif'),
    yoosung: path.join(INV, 'gifs-candidatos-2', 'yoosung2-1.gif'),
  }
  for (const [id, src] of Object.entries(sources)) {
    const anim = await readFrames(src, 160)
    anim.frames = anim.frames.map((f) => whitenBackground(f, anim.w, anim.h))
    await writeFile(path.join(AV, `${id}.gif`), encodeGif(anim))
  }
  // Jaehee estÃ¡tico (primer cuadro) para que no se mueva
  const jae = await readFrames(path.join(orig, 'jaehee.gif'))
  await writeFile(path.join(AV, 'jaehee.gif'), encodeGif({ ...jae, frames: [jae.frames[0]], delay: [1000] }))
  // Retratos = primer cuadro del GIF
  for (const id of ['707', 'jumin', 'zen', 'yoosung', 'jaehee', 'v', 'unknown', 'mc']) {
    await firstFramePng(path.join(AV, `${id}.gif`), path.join(AV, `${id}.png`))
  }
}

async function projects() {
  const files = (await readdir(PROJ)).filter((f) => f.endsWith('.png'))
  for (const f of files) {
    const input = await readFile(path.join(PROJ, f))
    await sharp(input).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(PROJ, f.replace(/\.png$/, '.webp')))
  }
}

const only = process.argv[2]
if (!only || only === 'avatars') await avatars()
if (!only || only === 'projects') await projects()
console.log('assets listos')

