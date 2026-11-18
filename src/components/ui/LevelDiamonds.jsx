import { motion as Motion, useReducedMotion } from 'framer-motion'
import styles from './LevelDiamonds.module.css'

/** Niveles con rombos: `items: [{ label, value, max }]`. */
export function LevelDiamonds({ items = [], className }) {
  const reduce = useReducedMotion()
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      {items.map((it, row) => {
        const max = Math.max(1, Number(it.max) || 1)
        const value = Math.max(0, Math.min(max, Number(it.value) || 0))
        return (
          <li key={it.label} className={styles.row}>
            <span className="sr-only">
              {it.label}: nivel {value} de {max}
            </span>
            <span className={styles.gems} aria-hidden="true">
              {Array.from({ length: max }, (_, i) => (
                <Motion.span
                  key={i}
                  className={[styles.gem, i < value && styles.on].filter(Boolean).join(' ')}
                  initial={reduce ? false : { scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 45 }}
                  transition={{ delay: reduce ? 0 : 0.15 + row * 0.12 + i * 0.06, type: 'spring', stiffness: 500, damping: 18 }}
                />
              ))}
            </span>
            <span aria-hidden="true">{it.label}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default LevelDiamonds
