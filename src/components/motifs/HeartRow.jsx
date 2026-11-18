import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { SPRITES } from './sprites.js'
import { PixelSprite } from './PixelSprite.jsx'
import { HEART_ORDER, HEART_COLORS, HEART_NAMES } from './hearts.js'
import './motifs.css'

const heart = SPRITES.heart
// Recorta las filas vacias del sprite (16x16 -> 16x13) para que se lea mejor pequeno.
const ROWS = heart.rows.slice(1, 14)
const EMPTY = { h: 'var(--crema, #FFF6E9)', w: 'var(--crema, #FFF6E9)' }

function heartTitle(id, filled, label) {
  const name = HEART_NAMES[id]
  if (filled) return label ? `${name} · ${label}` : name
  return label ? `Te falta ${label} (${name})` : `Te falta ${name}`
}

function Heart({ id, filled, size, label }) {
  // Detecta el paso de vacio a lleno (patron "estado previo" de React).
  const [prev, setPrev] = useState(filled)
  const [burst, setBurst] = useState(0)
  if (filled !== prev) {
    if (filled) setBurst((b) => b + 1)
    setPrev(filled)
  }

  return (
    <span className="motif-hearts__item" data-filled={filled || undefined} title={heartTitle(id, filled, label)}>
      <Motion.span
        key={burst}
        className="motif-hearts__beat"
        initial={false}
        animate={burst ? { scale: [1, 1.35, 1] } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <PixelSprite rows={ROWS} palette={heart.palette} overrides={filled ? { h: HEART_COLORS[id] } : EMPTY} size={size} />
      </Motion.span>
      {burst > 0 && (
        <Motion.span
          key={`s${burst}`}
          className="motif-hearts__spark"
          aria-hidden="true"
          initial={{ opacity: 1, scale: 0.3 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}
    </span>
  )
}

/**
 * Siete corazones pixel, uno por guia, en orden fijo. Lleno = color del guia;
 * vacio = contorno sobre crema. `labels` mapea id de guia a nombre de seccion.
 */
export function HeartRow({ visited = [], size = 18, labels = {} }) {
  const set = new Set(visited.map(String))
  const count = HEART_ORDER.filter((id) => set.has(id)).length
  return (
    <span className="motif-hearts" role="img" aria-label={`${count} de 7 corazones`}>
      {HEART_ORDER.map((id) => (
        <Heart key={id} id={id} filled={set.has(id)} size={size} label={labels?.[id]} />
      ))}
    </span>
  )
}
