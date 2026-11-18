import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { SPRITES } from './sprites.js'
import { PixelSprite } from './PixelSprite.jsx'
import { HEART_ORDER, HEART_COLORS, HEART_NAMES } from './hearts.js'
import { Avatar } from '@/components/ui/Avatar.jsx'
import { useOfficialArt } from '@/config/avatars'
import './motifs.css'

const HEART_ROWS = SPRITES.heart.rows.slice(1, 14)
const SPARK_ROWS = ['..o..', '..o..', 'oo.oo', '..o..', '..o..']
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

function makeRain() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: HEART_COLORS[HEART_ORDER[i % HEART_ORDER.length]],
    left: Math.random() * 96,
    size: 12 + Math.round(Math.random() * 12),
    delay: Math.random() * 1.1,
    duration: 1.7 + Math.random() * 0.9,
    drift: (Math.random() - 0.5) * 60,
    spin: (Math.random() - 0.5) * 240,
  }))
}

function makeSparks() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: 6 + Math.random() * 88,
    top: 8 + Math.random() * 80,
    delay: Math.random() * 1.6,
    color: i % 2 ? 'var(--limon, #FFF1B8)' : '#FFFFFF',
  }))
}

function PartyContent({ onClose, title, message, cta, onCta, closeLabel }) {
  const reduced = useReducedMotion()
  const [rain] = useState(makeRain)
  const [sparks] = useState(makeSparks)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  // Foco inicial, Escape, foco atrapado, bloqueo de scroll y restauracion de foco.
  useEffect(() => {
    const previous = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [onClose])

  const ctaNode = cta?.label
    ? onCta
      ? (
          <button type="button" className="motif-party__btn motif-party__btn--cta" onClick={() => onCta(cta)}>
            {cta.label}
          </button>
        )
      : (
          <a className="motif-party__btn motif-party__btn--cta" href={cta.to}>
            {cta.label}
          </a>
        )
    : null

  return (
    <Motion.div
      className="motif-party"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.35 : 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      {!reduced && (
        <div className="motif-party__rain" aria-hidden="true">
          {rain.map((h) => (
            <Motion.span
              key={h.id}
              className="motif-party__drop"
              style={{ left: `${h.left}%` }}
              initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
              animate={{ y: '110vh', x: h.drift, rotate: h.spin, opacity: [0, 1, 1, 0] }}
              transition={{ duration: h.duration, delay: h.delay, ease: 'easeIn' }}
            >
              <PixelSprite rows={HEART_ROWS} palette={SPRITES.heart.palette} overrides={{ h: h.color }} size={h.size} />
            </Motion.span>
          ))}
          {sparks.map((s) => (
            <Motion.span
              key={`s${s.id}`}
              className="motif-party__spark"
              style={{ left: `${s.left}%`, top: `${s.top}%` }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0, 1, 0], scale: [0.4, 1.2, 0.6, 1.1, 0.4] }}
              transition={{ duration: 1.6, delay: s.delay }}
            >
              <PixelSprite rows={SPARK_ROWS} palette={{ o: s.color }} size={14} />
            </Motion.span>
          ))}
        </div>
      )}

      <Motion.div
        ref={dialogRef}
        className="motif-party__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="motif-party-title"
        aria-describedby={message ? 'motif-party-message' : undefined}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={reduced ? { duration: 0.35 } : { type: 'spring', stiffness: 320, damping: 22 }}
      >
        <div className="motif-party__screen">
          <h2 id="motif-party-title" className="motif-party__title">{title}</h2>
          {message && <p id="motif-party-message" className="motif-party__message">{message}</p>}
          <ul className="motif-party__cast">
            {HEART_ORDER.map((id, i) => (
              <Motion.li
                key={id}
                className="motif-party__chibi"
                style={{ '--c': HEART_COLORS[id] }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.2, y: 12 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0.35, delay: 0.1 }
                    : { type: 'spring', stiffness: 520, damping: 14, delay: 0.3 + i * 0.12 }
                }
              >
                {useOfficialArt ? (
                  <img src={`/avatars/${id}.png`} alt={HEART_NAMES[id]} draggable="false" />
                ) : (
                  // modo 'propio' (src/config/avatars.js): pixel-art del sitio
                  <Avatar id={id} size={56} animated={false} label={HEART_NAMES[id]} />
                )}
              </Motion.li>
            ))}
          </ul>
        </div>
        <div className="motif-party__actions">
          {ctaNode}
          <button ref={closeRef} type="button" className="motif-party__btn" onClick={() => onClose?.()}>
            {closeLabel}
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  )
}

/**
 * Pantalla de celebracion "fiesta de la RFA".
 * - `cta` opcional: { label, to }. Sin `onCta` se renderiza <a href={to}>;
 *   con `onCta(cta)` se renderiza un boton (util para navigate() del router).
 * - Escape, clic en el fondo o el boton Cerrar llaman a onClose.
 */
export function RfaParty({ open, onClose, title, message, cta, onCta, closeLabel = 'Cerrar' }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <PartyContent
          key="rfa-party"
          onClose={onClose}
          title={title}
          message={message}
          cta={cta}
          onCta={onCta}
          closeLabel={closeLabel}
        />
      )}
    </AnimatePresence>,
    document.body,
  )
}
