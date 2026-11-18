import { motion as Motion, useReducedMotion } from 'framer-motion'
import { Avatar, Tag } from '@/components/ui'
import { characters, cssVar, dialogs, fill, getSection, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Stack.module.css'

const STEP = 0.45 // segundos entre bloques de la terminal

export default function Stack() {
  const section = getSection('stack')
  const t = ui.stack
  const reduce = useReducedMotion()

  // Revelado tipo comando: primero aparece la línea del prompt, luego la salida.
  const reveal = (delay) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.2 } }

  return (
    <Scene title={section.titulo} lines={dialogs.stack} file={section.archivo} center={section.subtitulo}>
      <div className={styles.terminal} role="log" aria-label={section.subtitulo}>
        {characters.map((c, i) => {
          const color = cssVar(c.colorVar)
          return (
            <section key={c.id} className={styles.block}>
              <Motion.p className={styles.command} {...reveal(i * STEP)}>
                <span className={styles.prompt}>{t.prompt}</span> {fill(t.comando, { id: c.id })}
              </Motion.p>
              <Motion.div className={styles.output} {...reveal(i * STEP + 0.2)}>
                <Avatar id={c.id} size={48} />
                <div className={styles.result}>
                  <h2 className={styles.category} style={{ color }}>
                    {fill(t.salida, { categoria: c.categoria, n: c.tecnologias.length })}
                  </h2>
                  <ul className={scene.tags}>
                    {c.tecnologias.map((tech) => (
                      <li key={tech}>
                        <Tag color={color}>{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Motion.div>
            </section>
          )
        })}
        <Motion.p className={styles.command} {...reveal(characters.length * STEP)}>
          <span className={styles.prompt}>{t.prompt}</span> {t.fin}
          <span className={styles.cursor} aria-hidden="true" />
        </Motion.p>
      </div>
    </Scene>
  )
}
