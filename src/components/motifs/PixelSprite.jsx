import { spriteRects } from './sprites.js'

/** Dibuja una reticula de pixeles como SVG nitido. Uso interno de motifs. */
export function PixelSprite({ rows, palette, size = 24, className, title, overrides }) {
  const pal = overrides ? { ...palette, ...overrides } : palette
  const rects = spriteRects(rows, pal)
  const w = rows[0].length
  const h = rows.length
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  )
}
