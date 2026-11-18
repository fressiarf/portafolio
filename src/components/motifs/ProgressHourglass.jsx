import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import './motifs.css'

// Reloj de arena pixel en reticula de 16x20.
const T = 'var(--tinta, #3D2C5C)'
const GOLD = '#F5C94E'
const GOLD_LIGHT = '#FFE9A3'
const GLASS = '#E3F8F0'
const SAND = '#FFD86B'
const SAND_TOP = '#FFEFA8'

// [fila, contorno izquierdo, contorno derecho]; el interior va entre ambos.
const BULB = [
  [3, 2, 13], [4, 2, 13], [5, 3, 12], [6, 4, 11], [7, 5, 10], [8, 6, 9], [9, 6, 9],
  [10, 6, 9], [11, 6, 9], [12, 5, 10], [13, 4, 11], [14, 3, 12], [15, 2, 13], [16, 2, 13],
]
const TOP_ROWS = BULB.slice(0, 7) // filas 3..9
const BOTTOM_ROWS = BULB.slice(7) // filas 10..16

function Row({ y, x0, x1, fill }) {
  if (x1 < x0) return null
  return <rect x={x0} y={y} width={x1 - x0 + 1} height={1} fill={fill} />
}

function Cap({ y }) {
  return (
    <>
      <Row y={y} x0={1} x1={14} fill={T} />
      <Row y={y + 1} x0={1} x1={1} fill={T} />
      <Row y={y + 1} x0={2} x1={13} fill={GOLD} />
      <Row y={y + 1} x0={3} x1={5} fill={GOLD_LIGHT} />
      <Row y={y + 1} x0={14} x1={14} fill={T} />
      <Row y={y + 2} x0={1} x1={14} fill={T} />
    </>
  )
}

/**
 * Reloj de arena de progreso para el HUD: la arena de abajo se llena segun
 * value/max y la de arriba baja en proporcion. Al subir `value` cae un
 * chorrito y el reloj celebra; con value === max brilla dorado.
 * `size` es la ALTURA en px (el ancho es size * 0.8).
 */
export function ProgressHourglass({ value = 0, max = 7, size = 44, className }) {
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

  const bottomFilled = Math.round(p * BOTTOM_ROWS.length)
  const topFilled = Math.round((1 - p) * TOP_ROWS.length)
  const topStart = TOP_ROWS.length - topFilled // primeras filas vacias arriba
  const bottomStart = BOTTOM_ROWS.length - bottomFilled
  const surfaceY = bottomFilled ? BOTTOM_ROWS[bottomStart][0] : 17

  const cls = ['motif-hourglass', complete && 'motif-hourglass--complete', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={cls}
      role="img"
      aria-label={`${v} de ${safeMax} salas exploradas`}
      style={{ height: size, width: size * 0.8 }}
    >
      <Motion.span
        key={burst}
        className="motif-hourglass__body"
        initial={false}
        animate={burst ? { rotate: [0, -14, 10, -4, 0], scale: [1, 1.16, 1] } : undefined}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 16 20" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
          <Cap y={0} />
          {BULB.map(([y, l, r]) => (
            <g key={y}>
              <Row y={y} x0={l} x1={l} fill={T} />
              <Row y={y} x0={l + 1} x1={r - 1} fill={GLASS} />
              <Row y={y} x0={r} x1={r} fill={T} />
            </g>
          ))}
          {TOP_ROWS.slice(topStart).map(([y, l, r], i) => (
            <Row key={`t${y}`} y={y} x0={l + 1} x1={r - 1} fill={i === 0 ? SAND_TOP : SAND} />
          ))}
          {BOTTOM_ROWS.slice(bottomStart).map(([y, l, r], i) => (
            <Row key={`b${y}`} y={y} x0={l + 1} x1={r - 1} fill={i === 0 ? SAND_TOP : SAND} />
          ))}
          {/* brillo del vidrio */}
          <Row y={4} x0={3} x1={3} fill="#FFFFFF" />
          <Row y={5} x0={4} x1={4} fill="#FFFFFF" />
          <Row y={14} x0={4} x1={4} fill="#FFFFFF" />
          {burst > 0 && (
            <Motion.rect
              key={`s${burst}`}
              x={7}
              y={9}
              width={1}
              height={Math.max(1, surfaceY - 9)}
              fill={SAND}
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.6, 1, 0.6, 0] }}
              transition={{ duration: 1.3, ease: 'linear' }}
            />
          )}
          <Cap y={17} />
          {complete && (
            <>
              <Row y={1} x0={12} x1={12} fill="#FFFFFF" />
              <Row y={18} x0={11} x1={11} fill="#FFFFFF" />
            </>
          )}
        </svg>
      </Motion.span>
      {burst > 0 && (
        <Motion.span
          key={`f${burst}`}
          className="motif-hourglass__flash"
          aria-hidden="true"
          initial={{ opacity: 0.9, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </span>
  )
}
