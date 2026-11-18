import { useEffect, useRef, useState } from 'react'
import { Avatar, PxIcon } from '@/components/ui'
import { dialogs, getSection, profile, profileLinks, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'
import styles from './Contact.module.css'

export default function Contact() {
  const section = getSection('contacto')
  const t = ui.contacto
  const [copied, setCopied] = useState('') // '' | 'ok' | 'error'
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied('ok')
    } catch {
      setCopied('error')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(''), 2500)
  }

  return (
    <Scene title={section.titulo} lines={dialogs.contacto} file={section.archivo} center={section.subtitulo}>
      <article className={styles.invitation}>
        <header className={styles.header}>
          <PxIcon name="sparkle" size={20} />
          <h2 className={styles.title}>{t.titulo}</h2>
          <PxIcon name="sparkle" size={20} />
        </header>

        <div className={styles.host}>
          <Avatar id={profile.avatar} size={96} />
          <div>
            <p className={scene.label}>{t.anfitrion}</p>
            <p className={styles.name}>{profile.nombre}</p>
            <p className={styles.role}>
              {profile.rol} · {profile.ubicacion}
            </p>
          </div>
        </div>

        <p className={styles.text}>{t.texto}</p>

        <ul className={styles.channels}>
          {profileLinks.map((link) => {
            const external = !link.href.startsWith('mailto:')
            return (
              <li key={link.id}>
                <a
                  className={scene.button}
                  href={link.href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <PxIcon name={link.id} size={18} />
                  {t[link.id]}
                </a>
              </li>
            )
          })}
        </ul>
        {profile.email && (
          <div className={styles.copyRow}>
            <code className={styles.address}>{profile.email}</code>
            <button type="button" className={`${scene.button} ${styles.copy}`} onClick={copy}>
              <PxIcon name="email" size={16} />
              {copied === 'ok' ? t.copiado : t.copiar}
            </button>
            <span className="sr-only" role="status">
              {copied === 'ok' ? t.copiado : copied === 'error' ? t.errorCopia : ''}
            </span>
            {copied === 'error' && <p className={styles.copyError}>{t.errorCopia}</p>}
          </div>
        )}

        <footer className={styles.signature}>
          <PxIcon name="heart" size={16} />
          {t.firma}
        </footer>
      </article>
    </Scene>
  )
}
