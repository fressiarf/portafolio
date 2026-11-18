import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/tokens.css'
import '@/styles/global.css'
import MotifsShowcase from '../MotifsShowcase.jsx'

// ?motion=full simula "sin preferencia de movimiento reducido" para probar la caida de chips.
if (new URLSearchParams(location.search).get('motion') === 'full') {
  const original = window.matchMedia.bind(window)
  window.matchMedia = (q) =>
    q.includes('prefers-reduced-motion') ? { ...original(q), matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : original(q)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotifsShowcase />
  </StrictMode>,
)
