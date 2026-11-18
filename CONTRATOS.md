# Contratos v2 — Fressia's Messenger

Portafolio de **Fressia Rivera Fallas** (GitHub `fressiarf`). Dirección v2 aprobada por la clienta:
**estructura de underground.kimu.moe** (monitor retro, título pixel, diálogo con avatar, barra de estado tipo vim, tarjetas con contorno grueso, menú flotante) + **guiños a Mystic Messenger** + **paleta pastel**.

Maqueta de referencia (fuente de verdad visual): `../investigacion/propuesta-v2.png` y `../investigacion/propuesta-v2.html`.

Reglas duras:
- **CERO emojis** en todo el proyecto (texto, datos, código, comentarios, `alt`). Iconos = SVG pixel propios.
- **No es un chat.** Nada de burbujas en hilo. El texto narrativo va en `DialogBox` (estilo novela visual, avanza por clic/espacio).
- Dinámico: typewriter, hover que levanta tarjetas, destellos animados, transición tipo "cambio de canal" entre rutas, todo con `prefers-reduced-motion`.
- Avatares: **decisión de la clienta = arte oficial con crédito.** El orquestador dejó en `public/avatars/` un GIF chibi animado (`<id>.gif`) y un retrato estático (`<id>.png`) para `707, jumin, zen, yoosung, jaehee, v, unknown`. `Avatar` usa el GIF por defecto, el PNG como alternativa (`variant="portrait"`) y su pixel-art SVG solo como respaldo si la imagen falla y para `fressia`. Con `prefers-reduced-motion` usa el PNG. Debe haber un crédito visible en el pie de todas las páginas: "Personajes de Mystic Messenger © Cheritz Co., Ltd. Homenaje de fan sin fines de lucro." (texto en `src/data`, lo pinta el layout). `public/avatars/**` es del orquestador.
- La gatita del pie (`CatWalker`) sigue siendo pixel-art original.
- Stack fijo: Vite 6 + React 19 (JSX) + react-router-dom 7 + framer-motion 11. No instalar dependencias. Alias `@` → `src/`.
- Desktop-first con monitor de hasta 1180px; en móvil el marco se reduce, gutter de 16px, sin scroll horizontal.

## Ronda v3 (feedback de la clienta, 2026-11-17)

Más identidad del juego **sin copiarlo**: guiños reconocibles en pixel-art propio, sobre la base pastel actual. Mayoría de colores claros; el morado oscuro (`--tinta`) solo para contornos y textos.

Motivos del juego a usar (todos dibujados por nosotros, nada calcado):
- **Nave de 707**: OVNI pixel pastel flotando en la parte superior, con el chibi de 707 en la cabina. A veces suelta una bolsa de chips.
- **Honey Buddha Chips**: bolsa amarilla pixel con "HBC". Es un coleccionable que suma corazones al hacerle clic.
- **Reloj de arena** (moneda del juego) y **corazones de color por personaje** en el HUD: 707 rojo, Jumin morado, Zen plata, Yoosung verde, Jaehee arena, V menta, Unknown lavanda.
- **Cielo estrellado pastel** con estrellas que titilan, **marcos hexagonales** para iconos y **patrón de cuadros** sutil en barras, en homenaje al cuarto de 707.
- **Botón "MAX SPEED"** en el diálogo, que acelera el texto.
- **Objetos por guía**: Jumin, copa de vino · Zen, espejo · Yoosung, mando de juego · Jaehee, taza de café · V, cámara · Unknown, ojo menta · 707, chips.
- **Gatita** (Elizabeth la 3.ª), que ya existe.
- **Fressia = MC**: en la marca de la TopBar y donde aparezca Fressia se usa `id="mc"`, con la chibi de la protagonista en `public/avatars/mc.(gif|png)`.
- **Página secreta**: puerta con código, guiño al apartamento de Rika.

Todos los avatares son **chibi**: los `.png` de `public/avatars/` ya son el primer cuadro de cada GIF chibi. Las imágenes de proyectos están en `public/projects/<slug>.png` (del orquestador).

## Dueños de archivos (nadie edita archivos de otro)

| Sesión | Archivos |
|---|---|
| **seven** (diseño) | `index.html`, `public/**`, `src/styles/**`, `src/components/ui/**` |
| **jumin** (estructura) | `src/app/**`, `src/layouts/**`, `src/pages/**`, `src/data/**`, `src/hooks/**` |
| **v-motivos** (motivos del juego) | `src/components/motifs/**` (barrel `@/components/motifs`: `PropIcon`, `PROP_NAMES`, `HeartRow`, `SpaceShip`, `Collectible`, `MotifsShowcase`), `public/sprites/**` |
| orquestador | `src/main.jsx`, `package.json`, `vite.config.js`, `eslint.config.js`, `CONTRATOS.md` |

Los componentes v1 (`Starfield`, `HexButton`, `CircleButton`, `StatusBar`, `ChatBubble`) **se quedan exportados** hasta que jumin migre; el orquestador los borra al final.

## Tokens (`src/styles/tokens.css`)

```
--crema #FFF6E9  --bezel #F3E6D3  --bezel-sombra #E2CFB6
--pantalla #EEE8FF  --grid #DCD2FF  --tinta #3D2C5C  --tinta-suave #6E5E8E  --blanco #FFFFFF
--lila #C9B8FF  --rosa #FFC8DD  --menta #BDEDDB  --cielo #BDE0FE  --durazno #FFD6BA  --limon #FFF1B8
--p-707 #FFB8B8  --p-jumin #BFCBF5  --p-zen #E1E3EC  --p-yoosung #C9EDB6  --p-jaehee #F3DCBD  --p-v #B8E9E9  --p-unknown #DCC6F2
--font-pixel 'Pixelify Sans'   --font-mono-px 'Silkscreen'   --font-body 'Nunito'
--borde 3px solid var(--tinta)  --sombra-dura 5px 5px 0 var(--tinta)  --radio 12px
```

## Componentes UI v2 (`@/components/ui`, exports nombrados)

- `MonitorFrame({ children })` — bisel crema + pantalla con cuadrícula y scanlines.
- `TopBar({ hearts, total, links })` — marca "Fressia" con avatar mini, HUD de corazones (`hearts/total`), iconos de enlaces (`links: [{ id: 'github'|'linkedin'|'email', href }]`) y selector ES/EN (visual por ahora).
- `PixelTitle({ children, as = 'h1' })` — título pixel con sombra lila + divisor con rombo.
- `DialogBox({ lines, onFinish })` — `lines: [{ speaker, text }]` (speaker = id de personaje). Avatar a la izquierda, recuadro punteado, typewriter, clic/espacio/Enter avanza (primero completa la línea, luego pasa), contador `n/total`, fila de mini-avatares del elenco resaltando quien habla.
- `Avatar({ id, size = 128, src, animated = true })` — pixel-art SVG original por `id` (`707, jumin, zen, yoosung, jaehee, v, unknown, fressia`); si `src`, muestra esa imagen. Idle animado (parpadeo / rebote suave).
- `LevelDiamonds({ items })` — `items: [{ label, value, max }]`, rombos llenos según progreso.
- `StatusLine({ mode = 'NORMAL', path, center, position = '1,1 All' })` — barra tipo vim.
- `NavCard({ to, title, subtitle, icon, host, color })` — tarjeta con contorno grueso, etiqueta "guía: X", se levanta en hover/foco, destello al hover.
- `ProjectCard({ to, title, summary, tags, media, color, badge })` — tarjeta de proyecto con zona de GIF/imagen (`media`), placeholder animado si no hay.
- `Tag({ children, color })`.
- `PxIcon({ name, size = 24 })` — iconos pixel SVG: `about, projects, stack, design, timeline, contact, github, linkedin, email, heart, menu, close, arrow, star, sparkle, lock, download, external`.
- `Sparkles({ count = 12 })` — destellos/estrellas pixel animados (efecto "GIF") sobre el fondo.
- `CatWalker()` — gatita pixel blanca (guiño a Elizabeth la 3.ª) que cruza el pie de página cada cierto tiempo; clic = corazón.
- `FloatingMenu({ items })` — botón flotante abajo a la derecha que abre un panel "Filesystem" con rutas (`items: [{ to, label, icon }]`); Escape cierra, foco atrapado.
- `ChannelTransition({ routeKey, children })` — envuelve el outlet con efecto de "cambio de canal" (flash + scanline) entre rutas.

## Estructura v2 (jumin)

- `src/layouts/SiteShell.jsx` reemplaza a `PhoneShell`: `MonitorFrame` > `TopBar` > `ChannelTransition(<Outlet/>)` > `CatWalker` + `FloatingMenu` + `Sparkles`.
- Rutas: `/` Home · `/sobre-mi` · `/proyectos` · `/proyectos/:slug` · `/stack` · `/diseno` · `/trayectoria` · `/contacto` · `/secreto` (Unknown) · `*` 404. Sin Splash.
- Guías por sección: Sobre mí = jaehee · Proyectos = jumin · Stack = 707 · Diseño = zen · Trayectoria = v · Contacto = yoosung · Secreto = unknown.
- Datos en `src/data/*.json`; `dialogs.json` sustituye a los guiones de chat; sin emojis.
