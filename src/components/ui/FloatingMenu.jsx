import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { PxIcon } from './PxIcon.jsx'
import styles from './FloatingMenu.module.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Botón flotante (abajo a la derecha) que abre el panel "Filesystem" con rutas.
 * `items: [{ to, label, icon }]`. Escape cierra, foco atrapado en el panel, el foco vuelve al botón al cerrar.
 */
export function FloatingMenu({ items = [] }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const fabRef = useRef(null)
  const rootRef = useRef(null)
  const panelId = useId()
  const titleId = useId()

  const close = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) requestAnimationFrame(() => fabRef.current?.focus())
  }, [])

  // Foco inicial, Escape, trampa de foco y clic fuera
  useEffect(() => {
    if (!open) return undefined
    const panel = panelRef.current
    const first = panel?.querySelector('.' + styles.item) ?? panel?.querySelector(FOCUSABLE)
    first?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const nodes = [...panel.querySelectorAll(FOCUSABLE)]
      if (nodes.length === 0) return
      const firstEl = nodes[0]
      const lastEl = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  return (
    <div className={styles.root} ref={rootRef}>
      <AnimatePresence>
        {open && (
          <Motion.div
            ref={panelRef}
            id={panelId}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={reduce ? { duration: 0.1 } : { type: 'spring', stiffness: 520, damping: 30 }}
          >
            <div className={styles.titlebar}>
              <span id={titleId}>Filesystem</span>
              <button type="button" className={styles.close} onClick={() => close()} aria-label="Cerrar menú">
                <PxIcon name="close" size={12} />
              </button>
            </div>
            <p className={styles.path} aria-hidden="true">
              ~/rfa $ ls
            </p>
            <ul className={styles.list}>
              {items.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} className={styles.item} onClick={() => close(false)} end={it.to === '/'}>
                    {it.icon && <PxIcon name={it.icon} size={18} />}
                    <span>{it.label}</span>
                    <span className={styles.slug} aria-hidden="true">
                      {it.to}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>

      <button
        ref={fabRef}
        type="button"
        className={styles.fab}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <PxIcon name={open ? 'close' : 'menu'} size={20} />
      </button>
    </div>
  )
}

export default FloatingMenu
