import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import { Avatar } from './Avatar.jsx'
import { PxIcon } from './PxIcon.jsx'
import { CAST_ORDER, characterName } from './characters.js'
import styles from './DialogBox.module.css'

const SPEED_MS = { normal: 26, max: 6 }

/**
 * Diálogo estilo novela visual. `lines: [{ speaker, text }]` (speaker = id de personaje).
 * - Clic en el recuadro, Espacio o Enter: pasa SIEMPRE a la siguiente línea (en la última llama a
 *   `onFinish` y vuelve a empezar). Espacio/Enter globales solo cuando el foco está en <body>.
 * - Fila de mini-avatares: botones reales; saltan a la primera línea de ese personaje.
 *   Si no tiene línea, el botón queda deshabilitado (tooltip "aún no habla aquí").
 * - Botón MAX SPEED: alterna la velocidad del typewriter.
 */
export function DialogBox({ lines = [], onFinish, className }) {
  const reduce = useReducedMotion()
  const [state, setState] = useState({ lines, index: 0, shown: 0 })
  const [maxSpeed, setMaxSpeed] = useState(false)

  // Si cambian las líneas, reinicia (ajuste de estado durante el render)
  let current = state
  if (state.lines !== lines) {
    current = { lines, index: 0, shown: 0 }
    setState(current)
  }

  const total = lines.length
  const index = Math.min(current.index, Math.max(0, total - 1))
  const line = lines[index]
  const fullLength = line?.text?.length ?? 0
  const shown = reduce ? fullLength : Math.min(current.shown, fullLength)
  const typing = shown < fullLength
  const isLast = index >= total - 1

  // Typewriter (en MAX SPEED escribe 3 caracteres por paso)
  useEffect(() => {
    if (reduce || !typing) return undefined
    const step = maxSpeed ? 3 : 1
    const t = setTimeout(
      () => setState((s) => ({ ...s, shown: s.shown + step })),
      maxSpeed ? SPEED_MS.max : SPEED_MS.normal,
    )
    return () => clearTimeout(t)
  }, [reduce, typing, shown, maxSpeed])

  const goTo = useCallback((i) => setState((s) => ({ ...s, index: i, shown: 0 })), [])

  const advance = useCallback(() => {
    if (!total) return
    if (isLast) {
      onFinish?.()
      goTo(0)
      return
    }
    goTo(index + 1)
  }, [total, isLast, index, onFinish, goTo])

  // Espacio / Enter globales solo cuando nadie más tiene el foco
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (document.activeElement !== document.body) return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  if (!line) return null

  const speaker = line.speaker
  const extra = [...new Set(lines.map((l) => l.speaker))].filter((id) => id && !CAST_ORDER.includes(id))
  const cast = [...CAST_ORDER, ...extra]
  const firstLineOf = (id) => lines.findIndex((l) => l.speaker === id)
  const name = characterName(speaker)

  // Clic en cualquier parte del recuadro que no sea un botón = siguiente línea
  const onBoxClick = (e) => {
    if (e.target.closest('button')) return
    advance()
  }

  return (
    <section className={[styles.wrap, className].filter(Boolean).join(' ')} aria-label="Diálogo">
      <div className={styles.portrait}>
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={speaker}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Avatar id={speaker} talking={typing} />
          </Motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.box} onClick={onBoxClick}>
        <div className={styles.who}>
          <span>{name}</span>
          <span className={styles.tools}>
            <button
              type="button"
              className={styles.speed}
              aria-pressed={maxSpeed}
              onClick={() => setMaxSpeed((v) => !v)}
              title="Alterna la velocidad del texto"
            >
              MAX SPEED
            </button>
            <span className={styles.count}>
              {index + 1}/{total}
            </span>
          </span>
        </div>

        {/* Visual (typewriter) oculto a lectores; la línea completa se anuncia una sola vez */}
        <p className={styles.text} aria-hidden="true">
          {line.text.slice(0, shown)}
          {typing && <span className={styles.caret} />}
        </p>
        <p className="sr-only" aria-live="polite">
          {name}: {line.text}
        </p>

        <div className={styles.next}>
          <span aria-hidden="true">{isLast ? 'fin · clic para repetir' : 'clic o espacio para continuar'}</span>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={advance}
            aria-label={isLast ? 'Terminar y repetir el diálogo' : 'Siguiente línea'}
          >
            <PxIcon name="arrow" size={12} className={styles.arrow} />
          </button>
        </div>

        <ul className={styles.cast} aria-label="Saltar a un personaje">
          {cast.map((id) => {
            const target = firstLineOf(id)
            const available = target !== -1
            const who = characterName(id)
            return (
              <li key={id}>
                <button
                  type="button"
                  className={[styles.castBtn, id === speaker && styles.active, !available && styles.unavailable]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={available ? `Ir a lo que dice ${who}` : `${who}: aún no habla aquí`}
                  aria-disabled={!available}
                  aria-current={id === speaker ? 'true' : undefined}
                  title={available ? who : 'aún no habla aquí'}
                  onClick={() => available && goTo(target)}
                >
                  <Avatar id={id} size={30} animated={false} label="" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default DialogBox
