import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion, useReducedMotion } from 'framer-motion'
import { PxIcon, Tag } from '@/components/ui'
import { cssVar, dialogs, getCharacter, getSection, ui } from '@/data'
import { useParty } from '@/hooks/useParty'
import { useVisited } from '@/hooks/useVisited'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Secret.module.css'

const DOOR_KEY = 'rfa:door-open'
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'borrar', '0', 'abrir']

function wasOpened() {
  try {
    return sessionStorage.getItem(DOOR_KEY) === '1'
  } catch {
    return false
  }
}

/** Puerta con cerradura numérica: el código correcto revela la sala. */
function Door({ onOpen }) {
  const t = ui.secreto
  const reduce = useReducedMotion()
  const [code, setCode] = useState('')
  const [error, setError] = useState(0) // contador para re-disparar la animación
  const length = t.codigo.length

  const submit = (value) => {
    if (value === t.codigo) onOpen()
    else {
      setError((n) => n + 1)
      setCode('')
    }
  }

  const press = (key) => {
    if (key === 'borrar') return setCode((c) => c.slice(0, -1))
    if (key === 'abrir') return submit(code)
    const next = (code + key).slice(0, length)
    setCode(next)
    if (next.length === length) submit(next)
  }

  const onKeyDown = (e) => {
    if (/^\d$/.test(e.key)) press(e.key)
    else if (e.key === 'Backspace') press('borrar')
    else if (e.key === 'Enter') press('abrir')
    else return
    e.preventDefault()
  }

  return (
    <Motion.div
      key={error}
      className={`${scene.panel} ${styles.door}`}
      animate={error && !reduce ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
      transition={{ duration: 0.35 }}
    >
      <p className={styles.doorTitle}>
        <PxIcon name="lock" size={20} />
        {t.puerta}
      </p>
      <p className={scene.label}>{t.instruccion}</p>

      <div className={styles.display} aria-label={t.pantalla} role="img">
        {Array.from({ length }, (_, i) => (
          <span key={i} className={`${styles.slot} ${i < code.length ? styles.filled : ''}`} />
        ))}
      </div>

      <div className={styles.keypad} role="group" aria-label={t.teclado} onKeyDown={onKeyDown}>
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`${styles.key} ${key === 'abrir' ? styles.enter : ''}`}
            onClick={() => press(key)}
          >
            {key === 'borrar' ? t.borrar : key === 'abrir' ? t.abrir : key}
          </button>
        ))}
      </div>

      <p className={styles.error} role="alert">
        {error > 0 ? t.error : ''}
      </p>
    </Motion.div>
  )
}

export default function Secret() {
  const section = getSection('secreto')
  const unknown = getCharacter(section.guia)
  const color = cssVar(section.colorVar)
  const { visit, member } = useVisited()
  const { replay } = useParty()
  const [open, setOpen] = useState(wasOpened)

  const unlock = () => {
    try {
      sessionStorage.setItem(DOOR_KEY, '1')
    } catch {
      // Sin sessionStorage: la puerta se cerrará al recargar.
    }
    visit(section.id)
    setOpen(true)
  }

  return (
    <div className={styles.secret}>
      <Scene
        key={open ? 'open' : 'closed'}
        title={section.titulo}
        lines={open ? dialogs.secreto : dialogs.puerta}
        file={section.archivo}
        center={open ? ui.secreto.exito : section.subtitulo}
        mode={open ? 'VISUAL' : 'NORMAL'}
      >
        {open ? (
          unknown && (
            <div className={`${scene.panel} ${styles.panel}`}>
              <p className={scene.label}>{unknown.categoria}</p>
              <ul className={scene.tags}>
                {unknown.tecnologias.map((tech) => (
                  <li key={tech}>
                    <Tag color={color}>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <Door onOpen={unlock} />
        )}
        <Link to="/" className={`${scene.button} ${styles.exit}`}>
          <PxIcon name="close" size={18} />
          {ui.secreto.volver}
        </Link>
        {member && (
          <button type="button" className={styles.replay} onClick={replay}>
            <PxIcon name="sparkle" size={14} />
            {ui.fiesta.repetir}
          </button>
        )}
      </Scene>
    </div>
  )
}
