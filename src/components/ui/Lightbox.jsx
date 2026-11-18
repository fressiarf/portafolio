import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { PxIcon } from './PxIcon.jsx'
import styles from './Lightbox.module.css'

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
const SWIPE_PX = 50

/**
 * Visor de imágenes modal. `images: [{ src, alt, caption }]`, `index`: número o null (null = cerrado).
 * `onClose()` al pedir cierre (Escape, clic en el fondo o botón cerrar); `onIndex(n)` al navegar
 * (flechas en pantalla, teclas izquierda/derecha o swipe). Navega en bucle.
 * Se monta en un portal sobre <body>, bloquea el scroll de la página, atrapa el foco y lo devuelve al cerrar.
 */
export function Lightbox({ images = [], index = null, onClose, onIndex }) {
  const reduce = useReducedMotion()
  const total = images.length
  const open = index !== null && index !== undefined && total > 0
  const i = open ? ((Number(index) % total) + total) % total : 0
  const image = open ? images[i] : null

  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const returnFocusRef = useRef(null)
  const swipeRef = useRef(null)
  const titleId = useId()

  const go = useCallback(
    (delta) => {
      if (!open || total < 2) return
      onIndex?.((i + delta + total) % total)
    },
    [open, total, i, onIndex],
  )

  // Guardar/devolver el foco y bloquear el scroll mientras está abierto
  useEffect(() => {
    if (!open) return undefined
    returnFocusRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      const el = returnFocusRef.current
      if (el && typeof el.focus === 'function') el.focus()
    }
  }, [open])

  // Teclado: Escape, flechas y trampa de foco
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'Tab') {
        const nodes = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  // Swipe sencillo (pointer events) sobre la imagen
  const onPointerDown = (e) => {
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <Motion.div
          key="lightbox"
          className={styles.backdrop}
          onClick={onBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={onBackdrop}
          >
            <div className={styles.frame}>
              <div className={styles.bar}>
                <span id={titleId} className={styles.title}>
                  {image.caption || image.alt || 'Imagen'}
                </span>
                <button ref={closeRef} type="button" className={styles.close} onClick={() => onClose?.()} aria-label="Cerrar visor">
                  <PxIcon name="close" size={14} />
                </button>
              </div>

              <div className={styles.stage} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeRef.current = null)}>
                <AnimatePresence mode="wait" initial={false}>
                  <Motion.img
                    key={image.src}
                    className={styles.img}
                    src={image.src}
                    alt={image.alt || image.caption || ''}
                    draggable="false"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                  />
                </AnimatePresence>
              </div>

              <div className={styles.footer}>
                {total > 1 && (
                  <button type="button" className={styles.nav} onClick={() => go(-1)} aria-label="Imagen anterior">
                    <PxIcon name="arrow" size={18} className={styles.flip} />
                  </button>
                )}
                <div className={styles.meta}>
                  {image.caption && <p className={styles.caption}>{image.caption}</p>}
                  <p className={styles.counter} aria-live="polite">
                    <span className="sr-only">Imagen </span>
                    {i + 1}/{total}
                  </p>
                </div>
                {total > 1 && (
                  <button type="button" className={styles.nav} onClick={() => go(1)} aria-label="Imagen siguiente">
                    <PxIcon name="arrow" size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default Lightbox
