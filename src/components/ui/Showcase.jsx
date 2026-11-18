// Vitrina de revisión de la UI v2. Funciona dentro o fuera del router (si no hay, monta un MemoryRouter).
import { useState } from 'react'
import { MemoryRouter, useInRouterContext } from 'react-router-dom'
import { MonitorFrame } from './MonitorFrame.jsx'
import { TopBar } from './TopBar.jsx'
import { PixelTitle } from './PixelTitle.jsx'
import { DialogBox } from './DialogBox.jsx'
import { Avatar } from './Avatar.jsx'
import { LevelDiamonds } from './LevelDiamonds.jsx'
import { StatusLine } from './StatusLine.jsx'
import { NavCard } from './NavCard.jsx'
import { ProjectCard } from './ProjectCard.jsx'
import { Tag } from './Tag.jsx'
import { PxIcon } from './PxIcon.jsx'
import { Sparkles } from './Sparkles.jsx'
import { CatWalker } from './CatWalker.jsx'
import { FloatingMenu } from './FloatingMenu.jsx'
import { ChannelTransition } from './ChannelTransition.jsx'
import { Lightbox } from './Lightbox.jsx'
import { ICONS, CHARACTERS } from './pixelArt.js'
import styles from './Showcase.module.css'

const LINES = [
  { speaker: '707', text: 'Bienvenida a la RFA: Rivera\'s Fullstack Association. Yo programé este messenger... bueno, ella lo programó.' },
  { speaker: 'jumin', text: 'Los proyectos están ordenados por impacto. Revisa el álbum cuando tengas un momento.' },
  { speaker: 'zen', text: 'El diseño también cuenta. Logos, branding y paletas, todo hecho a mano.' },
  { speaker: 'mc', text: 'Gracias por pasar. Usa el menú de abajo a la derecha para moverte por las salas.' },
]

const LEVELS = [
  { label: 'L1 sobre mí', value: 3, max: 4 },
  { label: 'L2 proyectos', value: 1, max: 3 },
  { label: 'L3 stack', value: 2, max: 3 },
]

const CARDS = [
  { to: '/sobre-mi', title: 'Sobre mí', subtitle: 'Diseño + código', icon: 'about', host: 'jaehee' },
  { to: '/proyectos', title: 'Proyectos', subtitle: 'Álbum de trabajos', icon: 'projects', host: 'jumin' },
  { to: '/stack', title: 'Stack', subtitle: 'Terminal de 707', icon: 'stack', host: '707' },
  { to: '/diseno', title: 'Diseño', subtitle: 'Branding y logos', icon: 'design', host: 'zen' },
  { to: '/trayectoria', title: 'Trayectoria', subtitle: 'Línea de tiempo + CV', icon: 'timeline', host: 'v' },
  { to: '/contacto', title: 'Contacto', subtitle: 'Invitación a la fiesta', icon: 'contact', host: 'yoosung' },
  { to: '/secreto', title: '???', subtitle: 'Puerta con código', icon: 'lock', host: 'unknown', prop: 'door' },
]

const MENU = [
  { to: '/', label: 'Inicio', icon: 'star' },
  ...CARDS.map((c) => ({ to: c.to, label: c.title, icon: c.icon })),
  { to: '/secreto', label: '???', icon: 'lock' },
]

const LINKS = [
  { id: 'github', href: 'https://github.com/fressiarf' },
  { id: 'linkedin', href: 'https://www.linkedin.com/' },
  { id: 'email', href: 'mailto:correo@ejemplo.com' },
]

const LABELS = { 707: 'Stack', jumin: 'Proyectos', zen: 'Diseño', yoosung: 'Contacto', jaehee: 'Sobre mí', v: 'Trayectoria', unknown: 'Secreto' }
const VISITED = ['707', 'jumin', 'zen', 'yoosung', 'jaehee', 'v', 'unknown']
// Galería de ejemplo (imágenes de public/projects, del orquestador)
const GALLERY = [
  { src: '/projects/sembremos-seguridad.webp', alt: 'Pantalla de Sembremos Seguridad', caption: 'Sembremos Seguridad · intranet MSP' },
  { src: '/projects/marketplace-fwd.webp', alt: 'Pantalla de FWD Marketplace', caption: 'FWD Marketplace · Hackathon 2026' },
  { src: '/projects/dashboard-financiero.webp', alt: 'Dashboard financiero', caption: 'Dashboard financiero' },
  { src: '/projects/gestion-vuelos.webp', alt: 'Gestión de vuelos', caption: 'Gestión de vuelos' },
  { src: '/projects/sistema-de-reservas-hotel.webp', alt: 'Reservas de hotel', caption: 'Sistema de reservas de hotel' },
]

const SWATCHES = ['pantalla', 'lila', 'rosa', 'menta', 'cielo', 'durazno', 'limon', 'crema']
const CHANNELS = ['CH 01', 'CH 02', 'CH 03']

function ShowcaseBody() {
  const [visited, setVisited] = useState(0)
  const [channel, setChannel] = useState(0)
  const [shot, setShot] = useState(null)

  return (
    <MonitorFrame>
      <Sparkles count={16} />
      <TopBar hearts={visited} total={7} links={LINKS} visited={VISITED.slice(0, visited)} labels={LABELS} />
      <main className={styles.main}>
        <PixelTitle>Fressia&apos;s Messenger</PixelTitle>

        <section className={styles.hero}>
          <DialogBox lines={LINES} onFinish={() => setVisited((v) => Math.min(7, v + 1))} />
          <LevelDiamonds items={LEVELS} />
        </section>

        <StatusLine path="rfa://lobby.md" center={`${visited} de 7 salas visitadas`} />

        <ul className={styles.cards}>
          {CARDS.map((c) => (
            <li key={c.to}>
              <NavCard {...c} />
            </li>
          ))}
        </ul>

        <section className={styles.featured}>
          <ProjectCard
            to="/proyectos/sembremos-seguridad"
            title="Sembremos Seguridad"
            summary="Intranet del programa MSP en Puntarenas"
            tags={['React 19', 'Express 5', 'MySQL dual', 'JWT']}
            badge="Destacado"
            color="cielo"
          />
          <ProjectCard
            to="/proyectos/fwd-marketplace"
            title="FWD Marketplace"
            summary="Colaboradora · Hackathon FWD 2026"
            tags={[{ label: 'Next.js 15', color: 'menta' }, { label: 'TypeScript', color: 'cielo' }, 'Supabase', { label: 'IA', color: 'rosa' }]}
            color="durazno"
          />
        </section>

        <section className={styles.section} aria-labelledby="sc-avatars">
          <h2 id="sc-avatars" className={styles.h2}>Avatar · GIF (por defecto)</h2>
          <div className={styles.row}>
            {Object.keys(CHARACTERS).map((id) => (
              <figure key={id} className={styles.figure}>
                <Avatar id={id} size={96} />
                <figcaption>{id}</figcaption>
              </figure>
            ))}
          </div>
          <h2 className={styles.h2} style={{ marginTop: 18 }}>Avatar · variant=&quot;portrait&quot;</h2>
          <div className={styles.row}>
            {Object.keys(CHARACTERS).map((id) => (
              <figure key={id} className={styles.figure}>
                <Avatar id={id} size={96} variant="portrait" />
                <figcaption>{id}</figcaption>
              </figure>
            ))}
          </div>
          <h2 className={styles.h2} style={{ marginTop: 18 }}>Avatar · respaldo pixel-art (imagen rota) y legado</h2>
          <div className={styles.row}>
            {Object.keys(CHARACTERS).map((id) => (
              <figure key={id} className={styles.figure}>
                <Avatar id={id} size={64} src="/avatars/no-existe.png" />
                <figcaption>{id}</figcaption>
              </figure>
            ))}
            <figure className={styles.figure}>
              <Avatar name="Firma v1" color="jumin" size={48} />
              <figcaption>v1 legado</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sc-icons">
          <h2 id="sc-icons" className={styles.h2}>PxIcon ({Object.keys(ICONS).length})</h2>
          <div className={styles.iconGrid}>
            {Object.keys(ICONS).map((n) => (
              <div key={n} className={styles.iconCell}>
                <PxIcon name={n} size={24} />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sc-tags">
          <h2 id="sc-tags" className={styles.h2}>Tag · StatusLine</h2>
          <div className={styles.row}>
            <Tag>crema</Tag>
            <Tag color="menta">menta</Tag>
            <Tag color="rosa">rosa</Tag>
            <Tag color="jumin">jumin</Tag>
            <Tag color="limon">limón</Tag>
          </div>
          <StatusLine mode="INSERT" path="rfa://proyectos/sembremos.md" center="-- editando --" position="12,4 Top" />
          <StatusLine mode="VISUAL" path="rfa://secreto" position="7,7 Bot" />
        </section>

        <section className={styles.section} aria-labelledby="sc-channel">
          <h2 id="sc-channel" className={styles.h2}>ChannelTransition</h2>
          <div className={styles.channelBox}>
            <div className={styles.channelBtns} role="group" aria-label="Canal">
              {CHANNELS.map((ch, i) => (
                <button key={ch} type="button" className={styles.btn} aria-pressed={channel === i} onClick={() => setChannel(i)}>
                  {ch}
                </button>
              ))}
            </div>
            <ChannelTransition routeKey={channel}>
              <div
                className={styles.channel}
                style={{ background: ['var(--rosa)', 'var(--menta)', 'var(--cielo)'][channel] }}
              >
                {CHANNELS[channel]}
              </div>
            </ChannelTransition>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sc-lightbox">
          <h2 id="sc-lightbox" className={styles.h2}>Lightbox · galería Diseño UI</h2>
          <ul className={styles.gallery}>
            {GALLERY.map((img, n) => (
              <li key={img.src}>
                <button type="button" className={styles.thumb} onClick={() => setShot(n)} aria-label={`Ver ${img.caption}`}>
                  <img src={img.src} alt="" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
          <Lightbox images={GALLERY} index={shot} onClose={() => setShot(null)} onIndex={setShot} />
        </section>

        <section className={styles.section} aria-labelledby="sc-palette">
          <h2 id="sc-palette" className={styles.h2}>Paleta</h2>
          <div className={styles.palette}>
            {SWATCHES.map((s) => (
              <div key={s} style={{ background: `var(--${s})` }}>
                {s}
              </div>
            ))}
            <div style={{ background: 'var(--tinta)', color: 'var(--crema)' }}>tinta</div>
          </div>
          <p className={styles.log}>La gatita cruza el pie de la pantalla cada ~20 s. Clic en ella para darle un corazón.</p>
        </section>
      </main>
      <CatWalker />
      <FloatingMenu items={MENU} />
    </MonitorFrame>
  )
}

export default function Showcase() {
  const inRouter = useInRouterContext()
  if (inRouter) return <ShowcaseBody />
  return (
    <MemoryRouter>
      <ShowcaseBody />
    </MemoryRouter>
  )
}
