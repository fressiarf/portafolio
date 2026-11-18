import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { HEART_NAMES, HEART_ORDER, HeartMeter, HeartRow } from '@/components/motifs'
import { Avatar } from './Avatar.jsx'
import { PxIcon } from './PxIcon.jsx'
import { characterName } from './characters.js'
import { useAnchoredPosition } from './useAnchoredPosition.js'
import styles from './TopBar.module.css'

const LINK_META = {
  github: { label: 'GitHub', icon: 'github' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  email: { label: 'Correo', icon: 'email' },
}

/** Email a partir de un href `mailto:` (sin parámetros). */
function emailFromHref(href = '') {
  const raw = String(href).replace(/^mailto:/i, '').split('?')[0]
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Respaldo para contextos sin Clipboard API (http, permisos)
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}

/** Botón de correo con popover: copiar, abrir en Gmail o abrir la app de correo. */
function EmailMenu({ href }) {
  const reduce = useReducedMotion()
  const email = emailFromHref(href)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null) // null | 'ok' | 'error'
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const menuId = useId()
  const popRef = useRef(null)
  const { pos, style: popStyle } = useAnchoredPosition(open, btnRef, popRef)

  const close = useCallback((focusButton = true) => {
    setOpen(false)
    if (focusButton) btnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    rootRef.current?.querySelector('[role="menuitem"]')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const items = [...(rootRef.current?.querySelectorAll('[role="menuitem"]') ?? [])]
        const i = items.indexOf(document.activeElement)
        if (i === -1 || items.length === 0) return
        e.preventDefault()
        const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
        items[next].focus()
      }
    }
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(null), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const emailRef = useRef(null)
  const onCopy = async () => {
    const ok = await copyText(email)
    setCopied(ok ? 'ok' : 'error')
    if (!ok && emailRef.current) {
      // Sin permiso de portapapeles: deja el correo seleccionado para copiarlo a mano (Ctrl+C)
      const range = document.createRange()
      range.selectNodeContents(emailRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`

  return (
    <span className={styles.emailWrap} ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className={styles.icon}
        aria-label="Correo"
        title="Correo"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <PxIcon name="email" size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <Motion.div
            ref={popRef}
            id={menuId}
            role="menu"
            aria-label={`Opciones para ${email}`}
            className={pos?.up ? `${styles.popover} ${styles.up}` : styles.popover}
            style={popStyle}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.14 }}
          >
            <p className={styles.popEmail} ref={emailRef}>
              {email}
            </p>
            <button type="button" role="menuitem" className={styles.popItem} onClick={onCopy}>
              <PxIcon name="contact" size={14} />
              {copied === 'ok' ? 'Copiado' : copied === 'error' ? 'Copia manual: Ctrl+C' : 'Copiar correo'}
            </button>
            <a
              role="menuitem"
              className={styles.popItem}
              href={gmail}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => close(false)}
            >
              <PxIcon name="external" size={14} />
              Abrir en Gmail
            </a>
            <a role="menuitem" className={styles.popItem} href={`mailto:${email}`} onClick={() => close(false)}>
              <PxIcon name="email" size={14} />
              Abrir app de correo
            </a>
            <span className="sr-only" aria-live="polite">
              {copied === 'ok' ? `Correo ${email} copiado` : copied === 'error' ? 'No se pudo copiar el correo' : ''}
            </span>
          </Motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}



/** Lista legible de lo que falta: "Diseño (Zen), ???". Unknown no revela su nombre. */
function missingText(visited, labels = {}) {
  const set = new Set(visited.map(String))
  return HEART_ORDER.filter((id) => !set.has(id))
    .map((id) => {
      const section = labels?.[id]
      if (id === 'unknown') return section || '???'
      return section ? `${section} (${HEART_NAMES[id]})` : HEART_NAMES[id]
    })
    .join(', ')
}

/** Móvil: botón compacto (medidor + n/total) que abre una tarjetita con la fila de corazones y lo que falta. */
function HeartMenu({ hearts, total, visited, labels, gold }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const popRef = useRef(null)
  const cardId = useId()
  const titleId = useId()
  const { pos, style } = useAnchoredPosition(open, btnRef, popRef)

  const close = useCallback((focusButton = true) => {
    setOpen(false)
    if (focusButton) btnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, close])

  const missing = missingText(visited, labels)
  return (
    <span className={styles.heartMenu} ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className={gold ? `${styles.meterBtn} ${styles.complete}` : styles.meterBtn}
        aria-label={`Corazones: ${hearts} de ${total}. Ver detalle`}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <HeartMeter value={hearts} max={total} size={28} />
        <span className={styles.count} aria-hidden="true">
          {hearts}/{total}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <Motion.div
            ref={popRef}
            id={cardId}
            role="dialog"
            aria-labelledby={titleId}
            className={pos?.up ? `${styles.popover} ${styles.heartCard} ${styles.up}` : `${styles.popover} ${styles.heartCard}`}
            style={style}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.14 }}
          >
            <p id={titleId} className={styles.popEmail}>
              Corazones {hearts}/{total}
            </p>
            <div className={styles.cardHearts}>
              <HeartRow visited={visited} size={18} labels={labels} />
            </div>
            <p className={styles.missing}>
              {missing ? (
                <>
                  <strong>Te falta:</strong> {missing}
                </>
              ) : (
                <strong>Visitaste todas las salas.</strong>
              )}
            </p>
          </Motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

/**
 * Barra superior: marca "Fressia" (chibi MC), HUD (cápsula con 7 corazones de color + "n/total"), enlaces e
 * idioma ES/EN (visual).
 * `links: [{ id: 'github'|'linkedin'|'email', href }]` (el de email es `mailto:` y abre un popover).
 * `visited: string[]`: ids de los guías visitados (pinta sus corazones; el último da nombre al aviso).
 * `labels` (opcional): { idGuía: 'Nombre de sección' }, se pasa tal cual a HeartRow.
 * Cuando `hearts` sube, aviso ~2 s "+1 corazón de <guía>".
 * Escritorio (>= 768px): cápsula con HeartRow. Móvil: botón compacto (HeartMeter + n/total) que abre una tarjeta.
 * Con hearts === total o `member`: dorado + insignia "Miembro de la RFA".
 */
export function TopBar({ hearts = 0, total = 0, links = [], visited = [], labels, member = false, className }) {
  const reduce = useReducedMotion()
  const [lang, setLang] = useState('es')

  // Aviso "+1 corazón de X" ~2 s cuando hearts sube (patrón "estado previo")
  const [prevHearts, setPrevHearts] = useState(hearts)
  const [toast, setToast] = useState(0)
  const [toastGuide, setToastGuide] = useState(null)
  if (hearts !== prevHearts) {
    if (hearts > prevHearts) {
      setToast((t) => t + 1)
      setToastGuide(visited.length ? visited[visited.length - 1] : null)
    }
    setPrevHearts(hearts)
  }
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(0), 2000)
    return () => clearTimeout(t)
  }, [toast])

  const complete = member || (total > 0 && hearts >= total)
  const toastText = toastGuide ? `+1 corazón de ${characterName(toastGuide)}` : '+1 corazón'
  return (
    <header className={[styles.bar, className].filter(Boolean).join(' ')}>
      <span className={styles.brand}>
        <Avatar id="mc" size={34} label="" />
        Fressia
      </span>

      <div className={styles.hud}>
        <span className={complete ? `${styles.capsule} ${styles.complete}` : styles.capsule}>
          <HeartRow visited={visited} size={18} labels={labels} />
          <span className={styles.count} aria-hidden="true">
            {hearts}/{total}
          </span>
        </span>
        <HeartMenu hearts={hearts} total={total} visited={visited} labels={labels} gold={complete} />
        {complete && <span className={styles.badge}>Miembro de la RFA</span>}
        <AnimatePresence>
          {toast > 0 && (
            <Motion.span
              key={toast}
              className={styles.toast}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              {toastText}
            </Motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only" aria-live="polite">
          {toast > 0 ? `${toastText}. ${hearts} de ${total}` : ''}
        </span>
      </div>

      <nav className={styles.links} aria-label="Enlaces y opciones">
        {links.map((l) => {
          if (l.id === 'email') return <EmailMenu key={l.id} href={l.href} />
          const meta = LINK_META[l.id] ?? { label: l.id, icon: 'external' }
          const external = /^https?:/.test(l.href ?? '')
          return (
            <a
              key={l.id}
              className={styles.icon}
              href={l.href}
              aria-label={meta.label}
              title={meta.label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <PxIcon name={meta.icon} size={18} />
            </a>
          )
        })}
        <span className={styles.lang} role="group" aria-label="Idioma">
          <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>
            ES
          </button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            EN
          </button>
        </span>
      </nav>
    </header>
  )
}

export default TopBar
