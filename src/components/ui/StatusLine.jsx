import styles from './StatusLine.module.css'

const MODE_COLORS = { NORMAL: 'var(--menta)', INSERT: 'var(--rosa)', VISUAL: 'var(--lila)', COMMAND: 'var(--limon)' }

/** Barra de estado tipo vim: [MODO] ruta · centro · posición. */
export function StatusLine({ mode = 'NORMAL', path, center, position = '1,1 All', className }) {
  const key = String(mode).toUpperCase()
  return (
    <div
      className={[styles.line, className].filter(Boolean).join(' ')}
      style={{ '--mode-bg': MODE_COLORS[key] ?? 'var(--menta)' }}
      role="note"
      aria-label="Barra de estado"
    >
      <span className={styles.left}>
        <span className={styles.mode}>{key}</span>
        {path && (
          <span className={styles.path}>
            {path}
            <span className={styles.cursor} aria-hidden="true" />
          </span>
        )}
      </span>
      {center ? <span className={styles.center}>{center}</span> : <span />}
      <span className={styles.right}>{position}</span>
    </div>
  )
}

export default StatusLine
