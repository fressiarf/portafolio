import { useEffect, useRef, useState } from 'react'
import { MotionConfig, animate, motion as Motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { PropIcon } from './PropIcon.jsx'
import { Avatar } from '@/components/ui/Avatar.jsx'
import { useOfficialArt } from '@/config/avatars'
import './motifs.css'

// Nave en reticula de 32x18: [fila, desde, hasta, color].
const COLORS = {
  o: 'var(--tinta, #3D2C5C)',
  h: '#F1EBFF',
  b: 'var(--lila, #C9B8FF)',
  s: '#B3A0F0',
  y: 'var(--limon, #FFF1B8)',
  w: '#FFFFFF',
}
const DOME = [
  [0, 13, 18, 'o'],
  [1, 11, 12, 'o'], [1, 19, 20, 'o'],
  [2, 10, 10, 'o'], [2, 21, 21, 'o'],
  [3, 9, 9, 'o'], [3, 22, 22, 'o'],
  [4, 9, 9, 'o'], [4, 22, 22, 'o'],
  [5, 8, 8, 'o'], [5, 23, 23, 'o'],
  [6, 8, 8, 'o'], [6, 23, 23, 'o'],
  [7, 8, 8, 'o'], [7, 23, 23, 'o'],
  // brillos del cristal
  [2, 12, 13, 'w'], [3, 11, 11, 'w'], [4, 10, 10, 'w'], [5, 21, 21, 'w'],
]
const GLASS = [
  [1, 13, 18], [2, 11, 20], [3, 10, 21], [4, 10, 21], [5, 9, 22], [6, 9, 22], [7, 9, 22],
]
const SAUCER = [
  [8, 3, 28, 'o'],
  [9, 1, 2, 'o'], [9, 3, 28, 'h'], [9, 29, 30, 'o'],
  [10, 0, 0, 'o'], [10, 1, 30, 'b'], [10, 31, 31, 'o'],
  [11, 0, 0, 'o'], [11, 1, 30, 'b'], [11, 31, 31, 'o'],
  [12, 0, 0, 'o'], [12, 1, 30, 'b'], [12, 31, 31, 'o'],
  [13, 1, 2, 'o'], [13, 3, 28, 's'], [13, 29, 30, 'o'],
  [14, 3, 6, 'o'], [14, 7, 24, 's'], [14, 25, 28, 'o'],
  [15, 7, 24, 'o'],
  [16, 12, 12, 'o'], [16, 13, 18, 'y'], [16, 19, 19, 'o'],
  [17, 13, 18, 'o'],
  // brillos del casco
  [9, 5, 8, 'w'], [10, 3, 4, 'w'],
]
const LIGHTS = [
  { x: 3, c: 'var(--limon, #FFF1B8)', alt: false },
  { x: 9, c: 'var(--rosa, #FFC8DD)', alt: true },
  { x: 15, c: 'var(--menta, #BDEDDB)', alt: false },
  { x: 21, c: 'var(--rosa, #FFC8DD)', alt: true },
  { x: 27, c: 'var(--limon, #FFF1B8)', alt: false },
]

function Spans({ spans }) {
  return spans.map(([y, x0, x1, c]) => (
    <rect key={`${y}-${x0}-${c}`} x={x0} y={y} width={x1 - x0 + 1} height={1} fill={COLORS[c]} />
  ))
}

function Glass({ fill, opacity }) {
  return GLASS.map(([y, x0, x1]) => (
    <rect key={y} x={x0} y={y} width={x1 - x0 + 1} height={1} fill={fill} opacity={opacity} />
  ))
}

function ShipArt() {
  return (
    <>
      <svg viewBox="0 0 32 18" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <Glass fill="var(--cielo, #BDE0FE)" opacity="0.6" />
      </svg>
      <span className="motif-ship__cockpit">
        {useOfficialArt ? (
          <img className="motif-ship__pilot" src="/avatars/707.png" alt="" draggable="false" />
        ) : (
          // modo 'propio' (src/config/avatars.js): pixel-art de 707 del sitio
          <Avatar id="707" size={28} animated={false} label="" className="motif-ship__pilot" />
        )}
      </span>
      <svg viewBox="0 0 32 18" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <Glass fill="#FFFFFF" opacity="0.14" />
        <Spans spans={DOME} />
        <Spans spans={SAUCER} />
        {LIGHTS.map((l) => (
          <rect
            key={l.x}
            className={`motif-ship__light${l.alt ? ' motif-ship__light--b' : ''}`}
            x={l.x}
            y={11}
            width={2}
            height={1}
            fill={l.c}
          />
        ))}
      </svg>
    </>
  )
}

/**
 * OVNI pastel con el avatar fijo de 707 (public/avatars/707.png, arte de Cheritz
 * con credito en el sitio) recortado en circulo en la cupula. Deriva de lado a lado dentro
 * del ancho de su contenedor y cada 12-20 s suelta una bolsa de chips.
 * Clic: destello + onClick. Con prefers-reduced-motion sigue flotando, pero
 * con menos amplitud y sin caida de chips (decision de la clienta).
 */
export function SpaceShip({ onClick }) {
  const reduced = useReducedMotion()
  const laneRef = useRef(null)
  const shipRef = useRef(null)
  const shipWRef = useRef(96)
  const [dims, setDims] = useState({ lane: 0, ship: 96 })
  const [drops, setDrops] = useState([])
  const [flashes, setFlashes] = useState([])
  const x = useMotionValue(0)

  useEffect(() => {
    const lane = laneRef.current
    if (!lane) return undefined
    const measure = () => {
      const ship = shipRef.current?.offsetWidth || 96
      shipWRef.current = ship
      setDims((d) => (d.lane === lane.clientWidth && d.ship === ship ? d : { lane: lane.clientWidth, ship }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(lane)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const max = Math.max(0, dims.lane - dims.ship)
    if (!max) return undefined
    let from = 0
    let to = max
    if (reduced) {
      const amp = Math.min(max / 2, 36)
      from = max / 2 - amp
      to = max / 2 + amp
    }
    const duration = reduced ? 9 : Math.min(28, Math.max(10, max / 35))
    x.set(from)
    const controls = animate(x, [from, to], {
      duration,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    })
    return () => controls.stop()
  }, [dims, reduced, x])

  useEffect(() => {
    if (reduced) return undefined
    let timer
    const schedule = () => {
      timer = setTimeout(() => {
        const left = x.get() + shipWRef.current / 2 - 12
        setDrops((d) => [...d, { id: `${Date.now()}-${Math.random()}`, left }])
        schedule()
      }, 12000 + Math.random() * 8000)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [reduced, x])

  const handleClick = (e) => {
    setFlashes((f) => [...f, Date.now()])
    onClick?.(e)
  }

  const bob = reduced ? 2 : 6
  return (
    <MotionConfig reducedMotion="never">
      <div ref={laneRef} className="motif-ship-lane">
        <Motion.div className="motif-ship-track" style={{ x }}>
          <Motion.div
            animate={{ y: [0, -bob, 0, bob * 0.6, 0], rotate: reduced ? [-1, 1, -1] : [-3, 3, -3] }}
            transition={{
              y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Motion.button
              ref={shipRef}
              type="button"
              className="motif-ship"
              aria-label="Nave de 707"
              onClick={handleClick}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShipArt />
              {flashes.map((id) => (
                <Motion.span
                  key={id}
                  className="motif-ship__flash"
                  initial={{ opacity: 0.95, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  onAnimationComplete={() => setFlashes((f) => f.filter((v) => v !== id))}
                />
              ))}
            </Motion.button>
          </Motion.div>
        </Motion.div>
        {drops.map((d) => (
          <Motion.div
            key={d.id}
            className="motif-ship__drop"
            style={{ left: d.left }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: 240, x: 18, rotate: 540, opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{ duration: 2.8, ease: 'easeIn' }}
            onAnimationComplete={() => setDrops((all) => all.filter((v) => v.id !== d.id))}
          >
            <PropIcon name="chips" size={24} />
          </Motion.div>
        ))}
      </div>
    </MotionConfig>
  )
}
