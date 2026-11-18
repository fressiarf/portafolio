# Fressia's Messenger

Portafolio personal de **Fressia Rivera Fallas**, desarrolladora Full Stack Junior y técnica en Diseño Publicitario (Barranca, Puntarenas, Costa Rica).

Es un sitio con estética de monitor retro en tonos pastel, con guiños a *Mystic Messenger*. Cada sección tiene un personaje guía y la exploración se premia con corazones.

## Secciones

- **Inicio**: diálogo de bienvenida y accesos a cada sala.
- **Sobre mí**, **Proyectos** (destacados: Sembremos Seguridad y FWD Marketplace), **Stack**, **Diseño UI**, **Trayectoria** (con CV descargable) y **Contacto**.
- Una página secreta que se desbloquea al explorar todo el sitio.

## Tecnologías

React 19, Vite 6, React Router 7 y Framer Motion, con CSS Modules. Las imágenes se procesan con `sharp`.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # compilación de producción en dist/
npm run lint
```

`scripts/process-assets.mjs` regenera avatares e imágenes de proyectos, y necesita la carpeta `../investigacion` con los originales.

## Arte de personajes

Los personajes de Mystic Messenger son © Cheritz Co., Ltd. y se usan como homenaje de fan, sin fines de lucro y con crédito visible.

En `src/config/avatars.js`, cambiar `AVATAR_MODE` a `'propio'` reemplaza todo el arte oficial por pixel-art original del sitio.
