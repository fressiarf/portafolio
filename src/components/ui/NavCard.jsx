import { PropIcon } from '@/components/motifs'
import { PxIcon } from './PxIcon.jsx'
import { SmartLink } from './SmartLink.jsx'
import { characterName, resolvePastel } from './characters.js'
import styles from './NavCard.module.css'

// Objeto de cada guía (Ronda v3). Se usa si no llega `prop`.
const HOST_PROPS = {
  707: 'chips',
  jumin: 'wine',
  zen: 'mirror',
  yoosung: 'gamepad',
  jaehee: 'coffee',
  v: 'camera',
  unknown: 'minteye',
}

// Hexágono "pointy-top" en caja 52x56
const HEX = '26,2 49,15 49,41 26,54 3,41 3,15'

/**
 * Tarjeta de navegación con contorno grueso y sombra dura; se levanta en hover/foco con destellos.
 * `icon`: nombre de PxIcon o nodo, dentro de un marco hexagonal. `host`: id del guía ('jaehee') o texto.
 * `color`: pastel/id/color CSS (si falta, el pastel del guía).
 * `prop` (opcional): objeto del guía ('wine', 'mirror'...) que asoma en hover; por defecto el del `host`;
 * `prop={false}` lo quita.
 */
export function NavCard({ to, title, subtitle, icon, host, color, prop, className }) {
  const bg = resolvePastel(color ?? host, 'var(--lila)')
  const propName = prop === false ? null : (prop ?? HOST_PROPS[host] ?? null)
  return (
    <SmartLink to={to} className={[styles.card, className].filter(Boolean).join(' ')} style={{ '--card-color': bg }}>
      {host && <span className={styles.host}>guía: {characterName(host)}</span>}
      <span className={styles.ico} aria-hidden="true">
        <svg className={styles.hex} viewBox="0 0 52 56" focusable="false">
          <polygon points={HEX} />
        </svg>
        <span className={styles.icoInner}>{typeof icon === 'string' ? <PxIcon name={icon} size={24} /> : icon}</span>
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
      {/* Sin flecha: el objeto del guía ocupa su lugar a la derecha (pedido de la clienta) */}
      {propName && (
        <span className={styles.prop} aria-hidden="true">
          <PropIcon name={propName} size={32} />
        </span>
      )}
      <PxIcon name="sparkle" size={14} className={`${styles.spark} ${styles.s1}`} />
      <PxIcon name="sparkle" size={12} className={`${styles.spark} ${styles.s2}`} />
      <PxIcon name="star" size={10} className={`${styles.spark} ${styles.s3}`} />
    </SmartLink>
  )
}

export default NavCard
