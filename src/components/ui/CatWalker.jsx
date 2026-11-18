import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { PxIcon } from './PxIcon.jsx'
import { CAT_FRAMES, CAT_PALETTE, gridToRects } from './pixelArt.js'
import styles from './CatWalker.module.css'

const FRAMES = CAT_FRAMES.map((f) => gridToRects(f).map((r) => ({ ...r, fill: CAT_PALETTE[r.ch] })))

const FIRST_DELAY = 3500
const nextDelay = () => 16000 + Math.random() * 14000

function CatSprite() {
  return (
    <svg viewBox="0 0 16 12" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {FRAMES.map((rects, i) => (
        <g key={i} className={i === 0 ? styles.f1 : styles.f2}>
          {rects.map((r) => (
            <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/**
 * Gatita pixel blanca que cruza el pie de la pantalla cada cierto tiempo. Clic = corazón.
 * Con prefers-reduced-motion se queda sentada en la esquina (sigue siendo clicable).
 * Se posiciona `absolute` en el ancestro posicionado más cercano (la pantalla de MonitorFrame).
 */
export function CatWalker() {
  const reduce = useReducedMotion()
  const [walking, setWalking] = useState(false)
  const [run, setRun] = useState(0)
  const [hearts, setHearts] = useState([])
  const [given, setGiven] = useState(0)
  const timer = useRef(null)
  const nextId = useRef(0)

  const schedule = useCallback((ms) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setRun((r) => r + 1)
      setWalking(true)
    }, ms)
  }, [])

  useEffect(() => {
    if (reduce) return undefined
    schedule(FIRST_DELAY)
    return () => clearTimeout(timer.current)
  }, [reduce, schedule])

  const onEnd = (e) => {
    if (e.target !== e.currentTarget) return
    setWalking(false)
    schedule(nextDelay())
  }

  const giveHeart = () => {
    nextId.current += 1
    const id = nextId.current
    setHearts((h) => [...h, id])
    setGiven((g) => g + 1)
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1100)
  }

  const visible = reduce || walking
  return (
    <>
      <span className="sr-only" aria-live="polite">
        {given > 0 ? `Le diste ${given} ${given === 1 ? 'corazón' : 'corazones'} a la gatita` : ''}
      </span>
      {visible && (
        <div
          key={run}
          className={[styles.walker, reduce && styles.sitting].filter(Boolean).join(' ')}
          onAnimationEnd={reduce ? undefined : onEnd}
        >
          <button type="button" className={styles.cat} onClick={giveHeart} aria-label="Gatita blanca: darle un corazón">
            <CatSprite />
          </button>
          <AnimatePresence>
            {hearts.map((id) => (
              <Motion.span
                key={id}
                className={styles.heart}
                initial={{ opacity: 1, y: 0, scale: 0.6 }}
                animate={reduce ? { opacity: 0 } : { opacity: 0, y: -46, scale: 1.2 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <PxIcon name="heart" size={18} />
              </Motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

export default CatWalker
