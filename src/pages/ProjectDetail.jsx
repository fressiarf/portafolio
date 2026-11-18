import { Link, useParams } from 'react-router-dom'
import { PxIcon, Tag } from '@/components/ui'
import { cssVar, dialogs, getProject, getSection, ui } from '@/data'
import Scene from './Scene'
import NotFound from './NotFound'
import scene from './Scene.module.css'
import styles from './ProjectDetail.module.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)
  const section = getSection('proyectos')
  const t = ui.proyecto

  if (!project) return <NotFound />

  const color = cssVar(project.colorVar)

  return (
    <Scene
      title={project.nombre}
      lines={dialogs.proyecto}
      file={`${section.ruta.slice(1)}/${project.slug}.md`}
      center={project.etiqueta || project.rol}
    >
      <article className={`${scene.panel} ${styles.card}`} style={{ '--chip': color }}>
        <div className={styles.media}>
          {project.media ? <img src={project.media} alt="" /> : <PxIcon name="projects" size={48} />}
        </div>

        <p className={styles.summary}>{project.resumen}</p>
        <p className={styles.description}>{project.descripcion}</p>

        <dl className={styles.meta}>
          <div>
            <dt className={scene.label}>{t.rol}</dt>
            <dd>{project.rol}</dd>
          </div>
          <div>
            <dt className={scene.label}>{t.stack}</dt>
            <dd>
              <ul className={scene.tags}>
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Tag color={color}>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          {project.repo && (
            <a className={scene.button} href={project.repo} target="_blank" rel="noopener noreferrer">
              <PxIcon name="github" size={18} />
              {t.repo}
            </a>
          )}
          {project.demo && (
            <a className={scene.button} href={project.demo} target="_blank" rel="noopener noreferrer">
              <PxIcon name="external" size={18} />
              {t.demo}
            </a>
          )}
          <Link className={scene.button} to={section.ruta} style={{ '--chip': 'var(--blanco)' }}>
            <PxIcon name="arrow" size={18} />
            {t.volver}
          </Link>
        </div>
      </article>
    </Scene>
  )
}
