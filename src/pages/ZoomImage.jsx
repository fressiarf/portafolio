import { ui } from '@/data'
import styles from './ZoomImage.module.css'

/** Miniatura ampliable: al hacer clic llama a `onOpen` (la página abre el Lightbox). */
export default function ZoomImage({ src, alt, onOpen, className, lazy = false }) {
  return (
    <button
      type="button"
      className={`${styles.zoom} ${className ?? ''}`}
      onClick={onOpen}
      title={ui.diseno.ampliar}
      aria-label={`${ui.diseno.ampliar}: ${alt}`}
    >
      <img src={src} alt="" loading={lazy ? 'lazy' : 'eager'} decoding="async" />
    </button>
  )
}
