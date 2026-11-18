import { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { PropIcon } from './PropIcon.jsx'
import './motifs.css'

const LABELS = {
  chips: 'Recoger Honey Buddha Chips',
  hourglass: 'Recoger reloj de arena',
  heart: 'Recoger corazón',
}
const LIFETIME = 8000

function randomSpot() {
  return {
    left: `${8 + Math.random() * 80}vw`,
    top: `${14 + Math.random() * 68}vh`,
  }
}

/**
 * Objeto que aparece cada `everyMs` (con algo de azar) en un punto visible
 * del viewport, con rebote. Clic: animacion de recogida + onCollect().
 * Si nadie lo toca en 8 s, se va solo.
 */
export function Collectible({ kind = 'chips', onCollect, everyMs = 25000 }) {
  const [item, setItem] = useState(null)

  // Programa la siguiente aparicion cuando no hay objeto en pantalla.
  useEffect(() => {
    if (item) return undefined
    const wait = everyMs * (0.8 + Math.random() * 0.4)
    const t = setTimeout(() => setItem({ id: Date.now(), collected: false, ...randomSpot() }), wait)
    return () => clearTimeout(t)
  }, [item, everyMs])

  // Se va solo si no lo recogen.
  useEffect(() => {
    if (!item || item.collected) return undefined
    const t = setTimeout(() => setItem(null), LIFETIME)
    return () => clearTimeout(t)
  }, [item])

  const collect = () => {
    if (!item || item.collected) return
    setItem({ ...item, collected: true })
    onCollect?.()
  }

  const collected = Boolean(item?.collected)
  return (
    <AnimatePresence>
      {item && (
        <Motion.button
          key={item.id}
          type="button"
          className="motif-collectible"
          style={{ left: item.left, top: item.top }}
          aria-label={LABELS[kind] || `Recoger ${kind}`}
          onClick={collect}
          disabled={collected}
          initial={{ opacity: 0, scale: 0.2, y: -30 }}
          animate={
            collected
              ? { opacity: 0, scale: 1.8, y: -70, rotate: 24 }
              : { opacity: 1, scale: 1, y: [0, -14, 0, -6, 0], rotate: [0, -6, 6, 0] }
          }
          exit={{ opacity: 0, scale: 0.4 }}
          transition={
            collected
              ? { duration: 0.45, ease: 'easeOut' }
              : {
                  opacity: { duration: 0.25 },
                  scale: { type: 'spring', stiffness: 420, damping: 14 },
                  y: { duration: 1.6, repeat: Infinity, repeatDelay: 0.6 },
                  rotate: { duration: 1.6, repeat: Infinity, repeatDelay: 0.6 },
                }
          }
          onAnimationComplete={() => {
            if (collected) setItem(null)
          }}
        >
          <span className="motif-collectible__glow" aria-hidden="true" />
          <PropIcon name={kind} size={40} />
        </Motion.button>
      )}
    </AnimatePresence>
  )
}
