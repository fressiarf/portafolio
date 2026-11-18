import { SPRITES } from './sprites.js'
import { PixelSprite } from './PixelSprite.jsx'

/**
 * Iconos pixel-art de objetos (16x16). `name` en PROP_NAMES.
 * `color` solo aplica a `heart` (relleno); `title` opcional lo hace accesible.
 */
export function PropIcon({ name, size = 24, className, color, title }) {
  const sprite = SPRITES[name]
  if (!sprite) return null
  const overrides = name === 'heart' && color ? { h: color } : undefined
  const cls = ['motif-prop', `motif-prop--${name}`, className].filter(Boolean).join(' ')
  return (
    <PixelSprite
      rows={sprite.rows}
      palette={sprite.palette}
      overrides={overrides}
      size={size}
      className={cls}
      title={title}
    />
  )
}
