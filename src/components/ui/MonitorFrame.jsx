import { memo } from 'react'
import styles from './MonitorFrame.module.css'

// Estrellas del cielo pastel: posiciones fijas (PRNG con semilla) para que no salten entre renders.
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STAR_COLORS = ['#ffffff', '#fff1b8', '#c9b8ff', '#ffc8dd', '#bde0fe']
const STARS = (() => {
  const rand = mulberry32(707)
  return Array.from({ length: 46 }, (_, i) => ({
    id: i,
    left: `${(rand() * 98 + 1).toFixed(1)}%`,
    top: `${(rand() * 98 + 1).toFixed(1)}%`,
    big: rand() > 0.72,
    color: STAR_COLORS[i % STAR_COLORS.length],
    d: `${(2.2 + rand() * 3.4).toFixed(2)}s`,
    delay: `${(-rand() * 5).toFixed(2)}s`,
  }))
})()

const Sky = memo(function Sky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      {STARS.map((s) => (
        <span
          key={s.id}
          className={s.big ? `${styles.star} ${styles.big}` : styles.star}
          style={{ left: s.left, top: s.top, '--c': s.color, '--d': s.d, '--delay': s.delay }}
        />
      ))}
    </div>
  )
})

/**
 * Monitor retro: bisel crema + pantalla con cielo estrellado pastel (estrellas que titilan), cuadrícula y scanlines.
 * La pantalla es `position: relative` + `isolation: isolate`.
 */
export function MonitorFrame({ children, className }) {
  return (
    <div className={[styles.monitor, className].filter(Boolean).join(' ')}>
      <div className={styles.screen}>
        <Sky />
        {children}
      </div>
      <div className={styles.foot} aria-hidden="true">
        <span>RFA-1180 · PASTEL</span>
        <span className={styles.led} />
      </div>
    </div>
  )
}

export default MonitorFrame
