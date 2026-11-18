// Punto único de acceso a los datos del portafolio.
import profile from './profile.json'
import characters from './characters.json'
import projects from './projects.json'
import sections from './sections.json'
import dialogs from './dialogs.json'
import timeline from './timeline.json'
import design from './design.json'
import ui from './ui.json'

export { profile, characters, projects, sections, dialogs, timeline, design, ui }

/** `--p-707` → `var(--p-707)` */
export const cssVar = (name) => (name ? `var(${name})` : undefined)

/** Sustituye `{clave}` en una plantilla de texto. */
export const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (key in values ? String(values[key]) : `{${key}}`))

export const getCharacter = (id) => characters.find((c) => c.id === id)
export const getSection = (id) => sections.find((s) => s.id === id)
export const getProject = (slug) => projects.find((p) => p.slug === slug)

/** Secciones visibles en la navegación (la secreta queda fuera). */
export const navSections = sections.filter((s) => !s.oculta)

/** Sección a la que pertenece una ruta (`/proyectos/x` → proyectos). */
export const sectionForPath = (pathname) =>
  sections.find((s) => pathname === s.ruta || pathname.startsWith(`${s.ruta}/`))

/** Destacados primero, manteniendo el orden del JSON. */
export const sortedProjects = [...projects].sort((a, b) => Number(b.destacado) - Number(a.destacado))
export const featuredProjects = sortedProjects.filter((p) => p.destacado)

/** Todas las tecnologías usadas en proyectos, sin repetir y en orden alfabético. */
export const projectTechs = [...new Set(projects.flatMap((p) => p.stack))].sort((a, b) => a.localeCompare(b, 'es'))

/** Enlaces del perfil que existen, en formato `{ id, href }` para TopBar y Contacto. */
export const profileLinks = [
  { id: 'github', href: profile.github },
  { id: 'linkedin', href: profile.linkedin },
  { id: 'email', href: profile.email ? `mailto:${profile.email}` : '' },
].filter((l) => l.href)

/** Guía -> nombre de su sección, para el HUD de corazones: { zen: 'Diseño', ... } */
export const guideLabels = Object.fromEntries(sections.map((s) => [s.guia, s.titulo]))

/** Ítems del menú flotante: inicio + secciones visibles. */
export const menuItems = [
  { to: '/', label: ui.menu.inicio, icon: 'star' },
  ...navSections.map((s) => ({ to: s.ruta, label: s.titulo, icon: s.icon })),
]
