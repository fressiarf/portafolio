import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lightbox, PxIcon, Tag } from '@/components/ui'
import { cssVar, design, dialogs, getProject, getSection, ui } from '@/data'
import Scene from './Scene'
import ZoomImage from './ZoomImage'
import scene from './Scene.module.css'
import styles from './Design.module.css'
import { canShowImage } from '@/config/avatars'

// Modo 'propio' (src/config/avatars.js): se quitan las imágenes con arte oficial.
const shown = (src) => (src && canShowImage(src) ? src : null)

/** Todas las imágenes de la página, en orden, para navegar en el Lightbox. */
function buildGallery() {
  const items = []
  design.caso.pasos.forEach((p) => shown(p.imagen) && items.push({ src: p.imagen, alt: p.alt, caption: p.titulo }))
  design.caso.decisiones.forEach((d) => shown(d.imagen) && items.push({ src: d.imagen, alt: d.alt, caption: d.titulo }))
  design.proyectos.items.forEach((item) => {
    const name = getProject(item.slug)?.nombre ?? item.slug
    item.images.forEach((src, n) => items.push({ src, alt: `${name}, captura ${n + 1}`, caption: name }))
  })
  return items
}
const gallery = buildGallery()
const indexOf = (src) => gallery.findIndex((g) => g.src === src)

/** Bloque 1: el proceso de diseño de este portafolio. */
function CaseStudy({ open }) {
  const caso = design.caso
  return (
    <section className={styles.block} aria-labelledby="caso-titulo">
      <h2 id="caso-titulo" className={scene.sectionTitle}>
        {caso.titulo}
      </h2>
      <p className={styles.intro}>{caso.intro}</p>

      <ol className={styles.steps}>
        {caso.pasos.map((paso, i) => (
          <li key={paso.id} className={`${scene.panel} ${styles.step}`}>
            {shown(paso.imagen) && (
              <ZoomImage src={paso.imagen} alt={paso.alt} onOpen={() => open(paso.imagen)} className={styles.stepImage} />
            )}
            <p className={styles.stepNumber}>
              {ui.diseno.paso} {i + 1}
            </p>
            <h3 className={styles.stepTitle}>{paso.titulo}</h3>
            <p className={styles.stepText}>{paso.texto}</p>
            {paso.credito && <p className={styles.credit}>{paso.credito}</p>}
          </li>
        ))}
      </ol>

      <h3 className={styles.subTitle}>{caso.decisionesTitulo}</h3>
      <ul className={styles.decisions}>
        {caso.decisiones.map((d) => (
          <li key={d.id} className={`${scene.panel} ${styles.decision} ${shown(d.imagen) ? styles.withImage : ''}`}>
            {shown(d.imagen) && <ZoomImage src={d.imagen} alt={d.alt} onOpen={() => open(d.imagen)} className={styles.decisionImage} />}
            <div>
              <h4 className={styles.decisionTitle}>{d.titulo}</h4>
              <p className={styles.stepText}>{d.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Bloque 2: capturas de interfaces de proyectos (placeholder mientras `images` esté vacío). */
function ProjectInterfaces({ open }) {
  const bloque = design.proyectos
  return (
    <section className={styles.block} aria-labelledby="interfaces-titulo">
      <h2 id="interfaces-titulo" className={scene.sectionTitle}>
        {bloque.titulo}
      </h2>
      <p className={styles.intro}>{bloque.intro}</p>

      <ul className={scene.grid}>
        {bloque.items.map((item) => {
          const project = getProject(item.slug)
          if (!project) return null
          const color = cssVar(project.colorVar)
          return (
            <li key={item.slug} className={`${scene.panel} ${styles.project}`} style={{ '--chip': color }}>
              {item.images.length > 0 ? (
                <div className={styles.shots}>
                  {item.images.map((src, n) => (
                    <ZoomImage
                      key={src}
                      src={src}
                      alt={`${project.nombre}, captura ${n + 1}`}
                      onOpen={() => open(src)}
                      lazy
                      className={styles.shot}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <span className={styles.placeholderBadge}>
                    <PxIcon name="sparkle" size={18} />
                    {bloque.placeholder}
                  </span>
                </div>
              )}
              <h3 className={styles.stepTitle}>{project.nombre}</h3>
              <p className={styles.stepText}>{item.nota}</p>
              <Link to={`/proyectos/${project.slug}`} className={styles.link}>
                {ui.diseno.verProyecto}
                <PxIcon name="arrow" size={14} />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Bloque 3: formación en diseño y herramientas. */
function Training() {
  const f = design.formacion
  return (
    <section className={styles.block} aria-labelledby="formacion-titulo">
      <h2 id="formacion-titulo" className={scene.sectionTitle}>
        {f.titulo}
      </h2>
      <div className={styles.training}>
        <ul className={styles.trainingList}>
          {f.items.map((item) => (
            <li key={item.id} className={`${scene.panel} ${styles.trainingItem}`}>
              <span className={styles.year}>{item.fecha}</span>
              <div>
                <h3 className={styles.decisionTitle}>{item.titulo}</h3>
                <p className={styles.place}>{item.lugar}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={scene.panel}>
          <h3 className={scene.label}>{f.herramientasTitulo}</h3>
          <ul className={scene.tags}>
            {f.herramientas.map((tool) => (
              <li key={tool}>
                <Tag color="var(--p-zen)">{tool}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Design() {
  const section = getSection('diseno')
  const [index, setIndex] = useState(null)
  const open = (src) => {
    const i = indexOf(src)
    if (i >= 0) setIndex(i)
  }

  return (
    <Scene title={section.titulo} lines={dialogs.diseno} file={section.archivo} center={section.subtitulo}>
      <CaseStudy open={open} />
      <ProjectInterfaces open={open} />
      <Training />
      <Lightbox images={gallery} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </Scene>
  )
}
