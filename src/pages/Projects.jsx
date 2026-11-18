import { useSearchParams } from 'react-router-dom'
import { ProjectCard } from '@/components/ui'
import { cssVar, dialogs, fill, getSection, projectTechs, sortedProjects, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Projects.module.css'

export default function Projects() {
  const section = getSection('proyectos')
  const t = ui.proyectos
  const [params, setParams] = useSearchParams()
  const active = projectTechs.includes(params.get('tech')) ? params.get('tech') : ''
  const list = active ? sortedProjects.filter((p) => p.stack.includes(active)) : sortedProjects

  const select = (tech) => setParams(tech ? { tech } : {}, { replace: true })

  return (
    <Scene
      title={section.titulo}
      lines={dialogs.proyectos}
      file={section.archivo}
      center={active || t.todas}
      position={fill(t.contador, { n: list.length })}
    >
      <fieldset className={styles.filter}>
        <legend className={scene.label}>{t.filtro}</legend>
        <div className={styles.options}>
          {['', ...projectTechs].map((tech) => (
            <button
              key={tech || 'all'}
              type="button"
              className={styles.option}
              aria-pressed={active === tech}
              onClick={() => select(tech)}
            >
              {tech || t.todas}
            </button>
          ))}
        </div>
      </fieldset>

      {list.length === 0 ? (
        <p className={scene.label}>{t.vacio}</p>
      ) : (
        <ul className={scene.grid}>
          {list.map((p) => (
            <li key={p.slug}>
              <ProjectCard
                to={`/proyectos/${p.slug}`}
                title={p.nombre}
                summary={p.etiqueta || p.resumen}
                tags={p.tags}
                media={p.media || undefined}
                color={cssVar(p.colorVar)}
                badge={p.destacado ? t.destacado : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </Scene>
  )
}
