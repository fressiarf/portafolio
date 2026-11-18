import { createBrowserRouter } from 'react-router-dom'
import SiteShell from '@/layouts/SiteShell'
import NotFound from '@/pages/NotFound'

// Carga diferida: cada página es su propio chunk.
const page = (load) => () => load().then((m) => ({ Component: m.default }))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteShell />,
    errorElement: <NotFound />,
    hydrateFallbackElement: <span />,
    children: [
      { index: true, lazy: page(() => import('@/pages/Home')) },
      { path: 'sobre-mi', lazy: page(() => import('@/pages/About')) },
      { path: 'proyectos', lazy: page(() => import('@/pages/Projects')) },
      { path: 'proyectos/:slug', lazy: page(() => import('@/pages/ProjectDetail')) },
      { path: 'stack', lazy: page(() => import('@/pages/Stack')) },
      { path: 'diseno', lazy: page(() => import('@/pages/Design')) },
      { path: 'trayectoria', lazy: page(() => import('@/pages/Timeline')) },
      { path: 'contacto', lazy: page(() => import('@/pages/Contact')) },
      { path: 'secreto', lazy: page(() => import('@/pages/Secret')) },
      { path: '*', element: <NotFound /> },
    ],
  },
])
