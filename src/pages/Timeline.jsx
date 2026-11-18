import { Link } from 'react-router-dom'
import { PxIcon, Tag } from '@/components/ui'
import { dialogs, getSection, profile, timeline, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Timeline.module.css'

export default function Timeline() {
  const section = getSection('trayectoria')
  const t = ui.trayectoria
  const cvName = profile.cv?.split('/').pop()

  return (
    <Scene title={section.titulo} lines={dialogs.trayectoria} file={section.archivo} center={section.subtitulo}>
      <ol className={styles.timeline}>
        {timeline.map((item) => (
          <li key={item.id} className={`${styles.item} ${styles[item.tipo] ?? ''}`}>
            <span className={styles.dot} aria-hidden="true" />
            <div className={`${scene.panel} ${styles.card}`}>
              <p className={styles.date}>
                <span>{item.fecha}</span>
                <span className={styles.kind}>{t.tipos[item.tipo]}</span>
              </p>
              <h2 className={styles.title}>{item.titulo}</h2>
              <p className={styles.place}>{item.lugar}</p>
              {item.descripcion && <p className={styles.text}>{item.descripcion}</p>}
              {item.stack?.length > 0 && (
                <ul className={`${scene.tags} ${styles.stack}`}>
                  {item.stack.map((tech) => (
                    <li key={tech}>
                      <Tag color="var(--p-v)">{tech}</Tag>
                    </li>
                  ))}
                </ul>
              )}
              {item.slug && (
                <Link to={`/proyectos/${item.slug}`} className={styles.link}>
                  {t.verProyecto}
                  <PxIcon name="arrow" size={14} />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      {profile.cv && (
        <section className={`${scene.panel} ${styles.cv}`} aria-labelledby="cv-titulo">
          <h2 id="cv-titulo" className={scene.label}>
            {t.cvTitulo}
          </h2>
          <div className={styles.cvActions}>
            <a className={scene.button} href={profile.cv} target="_blank" rel="noopener noreferrer">
              <PxIcon name="external" size={18} />
              {t.verCv}
              <span className="sr-only">{t.nuevaPestana}</span>
            </a>
            <a className={scene.button} href={profile.cv} download={cvName}>
              <PxIcon name="download" size={18} />
              {t.descargarCv}
            </a>
          </div>
        </section>
      )}
    </Scene>
  )
}
