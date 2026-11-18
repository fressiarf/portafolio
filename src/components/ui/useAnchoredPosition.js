import { useCallback, useLayoutEffect, useState } from 'react'

const MARGIN = 16
const GAP = 10

/**
 * Interno: posición `fixed` para un popover anclado a un botón, siempre dentro del viewport.
 * Alinea el borde derecho con el del botón (sin salirse 16 px de cada lado), abre hacia arriba si abajo
 * no cabe y arriba hay más sitio, y limita el `top` al viewport. Se recalcula con resize y scroll.
 * Devuelve `pos` ({ left, top, up } o null mientras mide) y `style` listo para el popover.
 */
export function useAnchoredPosition(open, anchorRef, popRef) {
  const [pos, setPos] = useState(null)

  const place = useCallback(() => {
    const anchor = anchorRef.current
    const pop = popRef.current
    if (!anchor || !pop) return
    const r = anchor.getBoundingClientRect()
    const w = pop.offsetWidth
    const h = pop.offsetHeight
    const left = Math.min(Math.max(r.right - w, MARGIN), window.innerWidth - MARGIN - w)
    const below = window.innerHeight - r.bottom - GAP
    const up = below < h + MARGIN && r.top - GAP > below
    const raw = up ? r.top - GAP - h : r.bottom + GAP
    const top = Math.max(MARGIN, Math.min(raw, window.innerHeight - MARGIN - h))
    setPos({ left, top, up })
  }, [anchorRef, popRef])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return undefined
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, place])

  // Primer cuadro: se monta oculto para poder medirlo antes de mostrarlo
  const style = pos ? { left: pos.left, top: pos.top } : { left: MARGIN, top: 0, visibility: 'hidden' }
  return { pos, style }
}
