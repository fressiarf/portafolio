import { Avatar } from '@/components/ui'
import { dialogs, getSection, profile, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './About.module.css'

export default function About() {
  const section = getSection('sobre-mi')
  const t = ui.sobreMi
  const facts = [
    { label: t.nombre, value: profile.nombre },
    { label: t.rol, value: profile.rol },
    { label: t.titulo, value: profile.titulo },
    { label: t.ubicacion, value: profile.ubicacion },
    { label: t.idiomas, value: profile.idiomas?.map((l) => `${l.idioma} (${l.nivel})`).join(' · ') },
    { label: t.estado, value: profile.openToWork ? t.disponible : t.noDisponible },
  ].filter((f) => f.value)

  return (
    <Scene title={section.titulo} lines={dialogs['sobre-mi']} file={section.archivo} center={section.subtitulo}>
      <div className={styles.layout}>
        <article className={`${scene.panel} ${styles.bio}`}>
          <div className={styles.avatar}>
            <Avatar id={profile.avatar} size={112} />
          </div>
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </article>

        <aside className={scene.panel}>
          <h2 className={scene.label}>{t.datos}</h2>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Scene>
  )
}
