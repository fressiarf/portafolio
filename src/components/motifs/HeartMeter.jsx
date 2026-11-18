import { useId, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { SPRITES, spriteRects } from './sprites.js'
import './motifs.css'

// Corazon recortado a 16x13 (sin filas vacias).
const ROWS = SPRITES.heart.rows.slice(1, 14)
const W = 16
const H = ROWS.length
const TOP = 1 // primera fila con interior
const BOTTOM = H - 1 // la ultima fila es solo contorno

const outline = spriteRects(ROWS, { o: 'var(--tinta, #3D2C5C)' })
const interior = spriteRects(ROWS, { h: 'h', w: 'w' })

const EMPTY = 'var(--crema, #FFF6E9)'
const FILL = { h: 'var(--rosa, #FFC8DD)', w: '#FFE6EF' }
const GOLD = { h: '#F5C94E', w: 'var(--limon, #FFF1B8)' }

/**
 * Un solo corazon pixel que se llena de abajo hacia arriba segun value/max.
 * Al subir `value` la marea sube y late una vez; con value === max se vuelve dorado.
 * `size` es el ANCHO en px (alto = size * 13/16).
 */
export function HeartMeter({ value = 0, max = 7, size = 28, className }) {
  const clipId = `hm-${useId().replace(/:/g, '')}`
  const safeMax = Math.max(1, max)
  const v = Math.min(safeMax, Math.max(0, value))
  const p = v / safeMax
  const complete = v >= safeMax

  // Detecta subidas de value (patron "estado previo" de React).
  const [prev, setPrev] = useState(v)
  const [burst, setBurst] = useState(0)
  if (v !== prev) {
    if (v > prev) setBurst((b) => b + 1)
    setPrev(v)
  }

  const level = BOTTOM - p * (BOTTOM - TOP) // y de la superficie de la marea
  const fill = complete ? GOLD : FILL
  const cls = ['motif-meter', complete && 'motif-meter--complete', className].filter(Boolean).join(' ')

  return (
    <span className={cls} role="img" aria-label={`${v} de ${safeMax} corazones`}>
      <Motion.span
        key={burst}
        className="motif-meter__beat"
        initial={false}
        animate={burst ? { scale: [1, 1.3, 1] } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={size}
          height={(size * H) / W}
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={clipId}>
              <Motion.rect
                x={0}
                width={W}
                height={H}
                initial={false}
                animate={{ y: p > 0 ? level : H }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </clipPath>
          </defs>
          {interior.map((r) => (
            <rect key={`e${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={EMPTY} />
          ))}
          <g clipPath={`url(#${clipId})`}>
            {interior.map((r) => (
              <rect key={`f${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={fill[r.fill]} />
            ))}
          </g>
          {outline.map((r) => (
            <rect key={`o${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
          ))}
        </svg>
      </Motion.span>
    </span>
  )
}
