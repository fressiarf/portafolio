import { memo, useMemo } from 'react'
import { PxIcon } from './PxIcon.jsx'
import styles from './Sparkles.module.css'

const COLORS = ['#c9b8ff', '#ff9ec4', '#8fdcc0', '#9cc9f5', '#ffc29a', '#f5d86b']

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Destellos pixel animados sobre el fondo (detrás del contenido).
 * Se posiciona `absolute` dentro del ancestro posicionado más cercano (la pantalla de MonitorFrame).
 */
export const Sparkles = memo(function Sparkles({ count = 12 }) {
  const n = Math.max(0, Math.min(80, Math.round(Number(count) || 0)))
  const items = useMemo(() => {
    const rand = mulberry32(1225 + n)
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: `${(rand() * 96 + 2).toFixed(1)}%`,
      top: `${(rand() * 92 + 4).toFixed(1)}%`,
      size: [10, 12, 14, 18][Math.floor(rand() * 4)],
      color: COLORS[i % COLORS.length],
      icon: rand() > 0.35 ? 'sparkle' : 'star',
      d: `${(3 + rand() * 4).toFixed(2)}s`,
      delay: `${(-rand() * 7).toFixed(2)}s`,
    }))
  }, [n])
  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((s) => (
        <span
          key={s.id}
          className={styles.spark}
          style={{ left: s.left, top: s.top, color: s.color, '--d': s.d, '--delay': s.delay }}
        >
          <PxIcon name={s.icon} size={s.size} />
        </span>
      ))}
    </div>
  )
})

export default Sparkles
