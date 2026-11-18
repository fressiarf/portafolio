import { motion as Motion, useReducedMotion } from 'framer-motion'
import styles from './PixelTitle.module.css'

/** Título pixel con sombra lila y divisor con rombo. `as`: etiqueta del encabezado (h1 por defecto). */
export function PixelTitle({ children, as = 'h1', className }) {
  const reduce = useReducedMotion()
  const Heading = as
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <Motion.div
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
      >
        <Heading className={styles.title}>{children}</Heading>
      </Motion.div>
      <div className={styles.divider} aria-hidden="true">
        <i />
        <span className={styles.gem} />
        <i />
      </div>
    </div>
  )
}

export default PixelTitle
