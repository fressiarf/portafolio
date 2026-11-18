import { useCallback, useEffect, useSyncExternalStore } from 'react'

const SEEN_KEY = 'rfa:party-seen'

function wasSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    // Sin almacenamiento: la fiesta podría repetirse en otra visita.
  }
}

// Store compartido: SiteShell la muestra y cualquier página puede volver a abrirla.
let open = false
const listeners = new Set()
const set = (value) => {
  open = value
  listeners.forEach((listener) => listener())
}
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => open

/**
 * Fiesta de la RFA.
 * - `useParty(member)` en el layout: la abre sola la primera vez que `member` pasa a true
 *   (queda marcada en localStorage para no repetirla).
 * - `replay()` la abre de nuevo a petición; `close()` la cierra.
 */
export function useParty(member = false) {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    if (member && !wasSeen()) {
      markSeen()
      set(true)
    }
  }, [member])

  const close = useCallback(() => set(false), [])
  const replay = useCallback(() => set(true), [])

  return { open: isOpen, close, replay }
}
