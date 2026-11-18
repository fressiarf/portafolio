import { isValidElement } from 'react'
import { SmartLink } from './SmartLink.jsx'
import { Tag } from './Tag.jsx'
import { resolvePastel } from './characters.js'
import styles from './ProjectCard.module.css'

function Media({ media, title }) {
  if (!media) {
    return (
      <div className={styles.placeholder} aria-hidden="true">
        <div className={styles.window}>
          <span>GIF en camino</span>
          <span className={styles.bar}>
            <i />
          </span>
        </div>
      </div>
    )
  }
  if (isValidElement(media)) return media
  const src = typeof media === 'string' ? media : media.src
  const alt = (typeof media === 'object' && media.alt) || `Vista de ${title}`
  if (/\.(mp4|webm)$/i.test(src)) {
    return <video src={src} autoPlay muted loop playsInline aria-label={alt} />
  }
  return <img src={src} alt={alt} loading="lazy" />
}

/**
 * Tarjeta de proyecto. `media`: URL (png/gif/webp/mp4/webm), `{ src, alt }` o nodo; sin media muestra placeholder animado.
 * `tags`: strings o `{ label, color }`. `color`: fondo de la zona de media. `badge`: texto de esquina.
 */
export function ProjectCard({ to, title, summary, tags = [], media, color, badge, className }) {
  return (
    <SmartLink
      to={to}
      className={[styles.card, className].filter(Boolean).join(' ')}
      style={{ '--card-color': resolvePastel(color, 'var(--pantalla)') }}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <div className={styles.media}>
        <Media media={media} title={title} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {summary && <p className={styles.summary}>{summary}</p>}
        {tags.length > 0 && (
          <ul className={styles.tags} aria-label="Tecnologías">
            {tags.map((t) => {
              const label = typeof t === 'string' ? t : t.label
              return (
                <li key={label}>
                  <Tag color={typeof t === 'string' ? undefined : t.color}>{label}</Tag>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </SmartLink>
  )
}

export default ProjectCard
