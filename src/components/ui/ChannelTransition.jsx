import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import styles from './ChannelTransition.module.css'

/**
 * Envuelve el contenido de la ruta con un efecto de "cambio de canal" (se aplasta, destello, barrido de scanline).
 * `routeKey` debe cambiar entre rutas (p. ej. location.pathname).
 * Para que la salida muestre la página vieja, pasa como children el resultado de `useOutlet()`, no `<Outlet />`.
 */
export function ChannelTransition({ routeKey, children }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={styles.stage}>
        <AnimatePresence mode="wait" initial={false}>
          <Motion.div
            key={routeKey}
            className={styles.page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {children}
          </Motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={styles.stage}>
      <AnimatePresence mode="wait" initial={false}>
        <Motion.div
          key={routeKey}
          className={styles.page}
          initial={{ scaleY: 0.02, scaleX: 1.04, opacity: 0.6, filter: 'brightness(1.8)' }}
          animate={{
            scaleY: 1,
            scaleX: 1,
            opacity: 1,
            filter: 'brightness(1)',
            // sin transform/filter residuales: no rompen position: fixed dentro de las páginas
            transitionEnd: { filter: 'none', transform: 'none' },
          }}
          exit={{ scaleY: 0.02, scaleX: 1.06, opacity: 0, filter: 'brightness(2)' }}
          transition={{ duration: 0.22, ease: [0.7, 0, 0.3, 1] }}
        >
          {children}
          <Motion.span
            className={styles.flash}
            aria-hidden="true"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          />
          <Motion.span
            className={styles.noise}
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.5, 0, 1, 1] }}
          />
          <Motion.span
            className={styles.sweep}
            aria-hidden="true"
            initial={{ top: '-25%', opacity: 1 }}
            animate={{ top: '105%', opacity: 0 }}
            transition={{ duration: 0.55, ease: 'linear' }}
          />
        </Motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ChannelTransition
