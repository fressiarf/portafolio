// Datos de personajes para la UI (nombre visible y pastel). Sin JSX.
import { CHARACTERS, CAST_ORDER } from './pixelArt.js'

export { CAST_ORDER }

/** Nombre visible de un id de personaje ('707' -> '707', 'jumin' -> 'Jumin'). */
export function characterName(id) {
  return CHARACTERS[id]?.name ?? (id ? String(id) : '')
}

/**
 * Resuelve un color: id de personaje -> su pastel; nombre de token ('rosa', 'p-zen', '--menta') -> var();
 * cualquier otro valor se usa tal cual.
 */
export function resolvePastel(color, fallback = 'var(--blanco)') {
  if (!color) return fallback
  const key = String(color)
  if (CHARACTERS[key]) return CHARACTERS[key].pastel
  if (key.startsWith('--')) return `var(${key})`
  if (/^(p-[a-z0-9]+|crema|bezel|pantalla|lila|rosa|menta|cielo|durazno|limon|blanco)$/.test(key)) return `var(--${key})`
  return key
}
