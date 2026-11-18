import { memo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { CHARACTERS, COMMON_COLORS, SKIN_COLOR, gridToRects } from './pixelArt.js'
import styles from './Avatar.module.css'
import { useOfficialArt } from '@/config/avatars'

/* ---------------- v2: pixel-art por personaje ---------------- */

const SPRITES = Object.fromEntries(
  Object.entries(CHARACTERS).map(([id, c]) => {
    const colors = { ...COMMON_COLORS, ...c.palette }
    const rects = gridToRects(c.grid).map((r) => ({ ...r, fill: colors[r.ch] }))
    // Párpados: cubren las filas de ojos (8-9, columnas 4-5 y 10-11)
    const lids = c.noBlink ? [] : [4, 10]
    return [id, { rects, lids }]
  }),
)

const Sprite = memo(function Sprite({ id }) {
  const sprite = SPRITES[id]
  return (
    <svg className={styles.sprite} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {sprite.rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
      {sprite.lids.length > 0 && (
        <g className={styles.blink}>
          {sprite.lids.map((x) => (
            <g key={x}>
              <rect x={x} y={8} width={2} height={1} fill={SKIN_COLOR} />
              <rect x={x} y={9} width={2} height={1} fill={COMMON_COLORS.o} />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
})

function blinkDelay(id) {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0
  return `${(Math.abs(h) % 30) / 10}s`
}

/* ---------------- v1 (legado): iniciales sobre color ---------------- */

const V1_KEYS = ['jumin', 'zen', '707', 'yoosung', 'jaehee', 'v', 'unknown', 'ray']

function resolveV1Color(color, name = '') {
  if (color) {
    const key = String(color).toLowerCase()
    if (V1_KEYS.includes(key)) return `var(--c-${key})`
    if (key.startsWith('--')) return `var(${color})`
    return color
  }
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return `var(--c-${V1_KEYS[Math.abs(hash) % V1_KEYS.length]})`
}

function initials(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return (words[0].length <= 3 ? words[0] : words[0].slice(0, 2)).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Personajes con arte oficial en public/avatars/<id>.gif (chibi animado) y <id>.png (retrato).
// fressia no tiene imagen: usa siempre su pixel-art.
const OFFICIAL = new Set(['707', 'jumin', 'zen', 'yoosung', 'jaehee', 'v', 'unknown', 'mc'])
const BASE = import.meta.env.BASE_URL
// Decisión de la clienta (2026-11-17, provisional): los GIFs se animan aunque el sistema pida menos movimiento.
// Poner en `true` para volver a respetar prefers-reduced-motion en los avatares.
const GIF_RESPECTS_REDUCED_MOTION = false

/**
 * v2: `Avatar({ id, size = 128, src, variant = 'gif' | 'portrait', animated = true })`.
 *  - Por defecto muestra `/avatars/<id>.gif`; `variant="portrait"`, `animated={false}` o prefers-reduced-motion
 *    usan el retrato `/avatars/<id>.png`. `src` explícito tiene prioridad.
 *  - Si la imagen falla (onError) o el id no tiene arte (fressia; mc usa /avatars/mc.*), cae al pixel-art SVG propio.
 *  - Marco pixel: borde de tinta + pastel del personaje.
 * v1 (legado, hasta la migración): `Avatar({ name, color, src, size = 48 })` con iniciales.
 * Extras opcionales: `label` (nombre accesible; '' = decorativo), `talking` (rebote rápido), `className`.
 */
export function Avatar({ id, size, src, variant = 'gif', animated = true, name, color, label, talking = false, className }) {
  const reduce = useReducedMotion()
  const [failedUrl, setFailedUrl] = useState(null)
  const isV2 = id !== undefined && id !== null

  if (isV2) {
    const key = String(id)
    const known = CHARACTERS[key]
    const px = size ?? 128
    const charName = label || (known ? known.name : key)
    const decorative = label === ''

    const usePortrait = variant === 'portrait' || !animated || (GIF_RESPECTS_REDUCED_MOTION && reduce)
    // Modo 'propio' (src/config/avatars.js): nunca carga arte oficial, usa el pixel-art.
    const officialUrl = useOfficialArt && OFFICIAL.has(key) ? `${BASE}avatars/${key}.${usePortrait ? 'png' : 'gif'}` : null
    const url = src || officialUrl
    const showImage = Boolean(url) && url !== failedUrl
    const isGif = showImage && /\.gif($|\?)/i.test(url)

    const style = {
      width: px,
      height: px,
      '--bw': px < 48 ? '2px' : '3px',
      '--avatar-bg': known ? known.pastel : 'var(--lila)',
      '--blink-delay': blinkDelay(key),
      borderRadius: px < 48 ? 7 : undefined,
    }
    const cls = [styles.px, animated && styles.animated, talking && styles.talking, className].filter(Boolean).join(' ')

    if (showImage) {
      return (
        <span className={cls} style={style} {...(decorative ? { 'aria-hidden': true } : {})}>
          <img
            key={url}
            className={isGif ? styles.photoGif : styles.photo}
            src={url}
            alt={decorative ? '' : charName}
            width={px}
            height={px}
            loading="lazy"
            decoding="async"
            draggable="false"
            onError={() => setFailedUrl(url)}
          />
        </span>
      )
    }

    return (
      <span className={cls} style={style} {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': charName })}>
        {known ? (
          <Sprite id={key} />
        ) : (
          <span className="mono-px" aria-hidden="true" style={{ fontSize: Math.max(9, px * 0.3) }}>
            {initials(key)}
          </span>
        )}
      </span>
    )
  }

  // ---- v1 ----
  const px = size ?? 48
  return (
    <span
      className={[styles.avatar, className].filter(Boolean).join(' ')}
      style={{ width: px, height: px, fontSize: Math.max(11, Math.round(px * 0.4)), '--avatar-bg': resolveV1Color(color, name) }}
      role="img"
      aria-label={label ?? (name || 'Avatar')}
    >
      {src ? <img className={styles.img} src={src} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  )
}

export default Avatar
