import { useEffect, useState } from 'react'
import { ScrollRestoration, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import {
  CatWalker,
  ChannelTransition,
  FloatingMenu,
  MonitorFrame,
  Sparkles,
  TopBar,
} from '@/components/ui'
import { Collectible, RfaParty, SpaceShip } from '@/components/motifs'
import { getSection, guideLabels, menuItems, profileLinks, sectionForPath, ui } from '@/data'
import { useParty } from '@/hooks/useParty'
import { useVisited } from '@/hooks/useVisited'
import { useOfficialArt } from '@/config/avatars'
import styles from './SiteShell.module.css'

// Congela el outlet de cada ruta para que la pantalla saliente no cambie mientras anima.
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

export default function SiteShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { hearts, total, guides, member, canCollect, visit, addBonus } = useVisited()
  const party = useParty(member)
  const secret = getSection('secreto')

  // Cada sección visitada suma un corazón (la oculta cuenta al abrir su puerta).
  useEffect(() => {
    const section = sectionForPath(pathname)
    if (section && !section.oculta) visit(section.id)
  }, [pathname, visit])

  return (
    <div className={styles.shell}>
      <Sparkles />
      <MonitorFrame>
        <TopBar hearts={hearts} total={total} visited={guides} labels={guideLabels} member={member} links={profileLinks} />
        {/* Nave de 707: clic = corazón extra (hasta el tope de bonus) */}
        <div className={styles.sky}>
          <SpaceShip onClick={addBonus} />
        </div>
        <main className={styles.screen}>
          <ChannelTransition routeKey={pathname}>
            <FrozenOutlet key={pathname} />
          </ChannelTransition>
        </main>
        <footer className={styles.footer}>
          {useOfficialArt && <p className={styles.credit}>{ui.credito}</p>}
          {/* Carril propio de la gatita: nunca se solapa con el crédito */}
          <div className={styles.catLane}>
            <CatWalker />
          </div>
        </footer>
      </MonitorFrame>
      {canCollect && <Collectible kind="chips" onCollect={addBonus} />}
      {/* Fiesta de la RFA: se abre sola la primera vez que se completan las salas del menú */}
      <RfaParty
        open={party.open}
        onClose={party.close}
        title={ui.fiesta.titulo}
        message={ui.fiesta.mensaje}
        cta={secret ? { label: ui.fiesta.cta, to: secret.ruta } : undefined}
        onCta={(cta) => {
          party.close()
          navigate(cta.to)
        }}
        closeLabel={ui.fiesta.cerrar}
      />
      <FloatingMenu items={menuItems} />
      <ScrollRestoration />
    </div>
  )
}
