import { resolvePastel } from './characters.js'
import styles from './Tag.module.css'

/** Etiqueta pixel. `color`: token pastel ('menta', 'p-zen'), id de personaje o color CSS. */
export function Tag({ children, color, className }) {
  return (
    <span
      className={[styles.tag, className].filter(Boolean).join(' ')}
      style={color ? { '--tag-bg': resolvePastel(color) } : undefined}
    >
      {children}
    </span>
  )
}

export default Tag
