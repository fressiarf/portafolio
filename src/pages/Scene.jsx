import { DialogBox, PixelTitle, StatusLine } from '@/components/ui'
import { ui } from '@/data'
import styles from './Scene.module.css'

/**
 * Plantilla común de página: título pixel, diálogo del guía, barra tipo vim y contenido.
 * `aside` se coloca junto al diálogo (p. ej. LevelDiamonds en Home).
 */
export default function Scene({ title, lines, onFinish, file, mode, center, position, aside, children }) {
  return (
    <div className={styles.scene}>
      <PixelTitle>{title}</PixelTitle>

      {lines?.length > 0 && (
        <div className={`${styles.intro} ${aside ? styles.withAside : ''}`}>
          <div className={styles.dialog}>
            <DialogBox lines={lines} onFinish={onFinish} />
          </div>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      )}

      <StatusLine mode={mode} path={file ? `${ui.menu.protocolo}${file}` : undefined} center={center} position={position} />

      <div className={styles.content}>{children}</div>
    </div>
  )
}
