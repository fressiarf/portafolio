import { useCallback, useSyncExternalStore } from 'react'
import { navSections, sections, ui } from '@/data'

const KEY = 'rfa:visited'
const BONUS_KEY = 'rfa:bonus'
/** Corazones extra posibles (bolsas de chips): uno por guía. */
export const MAX_BONUS = sections.length

const validIds = new Set(sections.map((s) => s.id))

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin almacenamiento disponible: el progreso vive solo en memoria.
  }
}

const loadVisited = () => {
  const v = read(KEY, [])
  // sin repetidos ni ids viejos (el almacenamiento puede traer ambos de versiones anteriores)
  return Array.isArray(v) ? [...new Set(v.filter((id) => validIds.has(id)))] : []
}
const loadBonus = () => {
  const n = Number(read(BONUS_KEY, 0))
  return Number.isFinite(n) ? Math.min(Math.max(0, Math.floor(n)), MAX_BONUS) : 0
}

// Store compartido: TopBar, Home y el layout ven el mismo progreso.
let state = { visited: loadVisited(), bonus: loadBonus() }
const listeners = new Set()
const emit = () => listeners.forEach((listener) => listener())
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => state

/**
 * Progreso del visitante:
 * - `visited`: ids de secciones visitadas; `guides`: ids de sus guías (para el HUD).
 * - `hearts/total`: un corazón por sección visitada (x/7). `bonus` cuenta chips recogidos, aparte.
 * - `levels`: entrada para `LevelDiamonds`.
 * - `member`: true cuando todas las salas del menú están visitadas.
 * - `visit(id)`, `addBonus()`.
 */
export function useVisited() {
  const { visited, bonus } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const visit = useCallback((id) => {
    if (!validIds.has(id) || state.visited.includes(id)) return
    state = { ...state, visited: [...state.visited, id] }
    write(KEY, state.visited)
    emit()
  }, [])

  const addBonus = useCallback(() => {
    if (state.bonus >= MAX_BONUS) return false
    state = { ...state, bonus: state.bonus + 1 }
    write(BONUS_KEY, state.bonus)
    emit()
    return true
  }, [])

  const levels = ui.niveles.map(({ nivel, label }) => {
    const inLevel = sections.filter((s) => s.nivel === nivel)
    return { label, value: inLevel.filter((s) => visited.includes(s.id)).length, max: inLevel.length }
  })

  // Miembro de la RFA: todas las salas del menú visitadas (la secreta no cuenta).
  const member = navSections.every((s) => visited.includes(s.id))

  const guides = sections.filter((s) => visited.includes(s.id)).map((s) => s.guia)

  return {
    visited,
    guides,
    bonus,
    // Decisión de la clienta: el contador cuenta solo salas visitadas (x/7); la nave y las chips son decorativas.
    hearts: visited.length,
    total: sections.length,
    member,
    canCollect: bonus < MAX_BONUS,
    levels,
    visit,
    addBonus,
  }
}
