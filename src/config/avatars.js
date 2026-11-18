/**
 * Interruptor de arte de personajes.
 *
 * 'oficial' -> usa los chibis/retratos de Mystic Messenger de public/avatars/ (arte de Cheritz, con crédito).
 * 'propio'  -> usa solo el pixel-art original del sitio: avatares, nave y fiesta dejan de cargar
 *              public/avatars/, se oculta el crédito a Cheritz y la página Diseño UI quita las
 *              imágenes que contienen arte oficial (lista OFFICIAL_ART_IMAGES).
 *
 * Para cambiar: edita esta línea y vuelve a publicar.
 */
export const AVATAR_MODE = 'oficial' // 'oficial' | 'propio'

export const useOfficialArt = AVATAR_MODE === 'oficial'

/** Imágenes de la página Diseño UI que muestran arte oficial y se ocultan en modo 'propio'. */
export const OFFICIAL_ART_IMAGES = [
  '/design/referencia-juego.webp',
  '/design/avatares-chibi.webp',
  '/design/version-v2.webp',
  '/design/version-actual.webp',
]

/** true si la imagen puede mostrarse con el modo actual. */
export const canShowImage = (src) => useOfficialArt || !OFFICIAL_ART_IMAGES.includes(src)
