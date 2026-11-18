import { ICONS, gridToRects } from './pixelArt.js'

// Precalcula los rectángulos una sola vez por icono
const RECTS = Object.fromEntries(Object.entries(ICONS).map(([k, rows]) => [k, gridToRects(rows)]))

/** Icono pixel 12x12 propio. Decorativo (aria-hidden) salvo que se pase `title`. Color = currentColor. */
export function PxIcon({ name, size = 24, title, className, ...rest }) {
  const rects = RECTS[name]
  if (!rects) return null
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
      ))}
    </svg>
  )
}

export default PxIcon
