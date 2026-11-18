import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LevelDiamonds, NavCard, ProjectCard, PxIcon } from '@/components/ui'
import { cssVar, dialogs, featuredProjects, fill, getCharacter, getSection, navSections, sections, ui } from '@/data'
import { useVisited } from '@/hooks/useVisited'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Home.module.css'

export default function Home() {
  const { visited, levels } = useVisited()
  const [introDone, setIntroDone] = useState(false)
  const secret = getSection('secreto')

  return (
    <Scene
      title={ui.sitio}
      lines={dialogs.home}
      onFinish={() => setIntroDone(true)}
      aside={<LevelDiamonds items={levels} />}
      file={ui.home.archivo}
      center={fill(ui.home.visitadas, { hearts: visited.length, total: sections.length })}
    >
      <ul className={styles.nav}>
        {navSections.map((s) => (
          <li key={s.id}>
            <NavCard
              to={s.ruta}
              title={s.titulo}
              subtitle={s.subtitulo}
              icon={s.icon}
              host={getCharacter(s.guia)?.nombre}
              prop={getCharacter(s.guia)?.prop}
              color={cssVar(s.colorVar)}
            />
          </li>
        ))}
      </ul>

      <h2 className={scene.sectionTitle}>{ui.home.destacados}</h2>
      <ul className={styles.featured}>
        {featuredProjects.map((p) => (
          <li key={p.slug}>
            <ProjectCard
              to={`/proyectos/${p.slug}`}
              title={p.nombre}
              summary={p.etiqueta || p.resumen}
              tags={p.tags}
              media={p.media || undefined}
              color={cssVar(p.colorVar)}
            />
          </li>
        ))}
      </ul>

      {/* Easter egg: aparece solo al terminar el diálogo de bienvenida */}
      {introDone && secret && (
        <Link to={secret.ruta} className={styles.secret} aria-label={ui.home.secretoLabel} title={ui.home.secretoLabel}>
          <PxIcon name={secret.icon} size={16} />
          <span aria-hidden="true">{ui.home.secretoPista}</span>
        </Link>
      )}
    </Scene>
  )
}
