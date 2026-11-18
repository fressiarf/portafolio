import { Link } from 'react-router-dom'
import { PxIcon } from '@/components/ui'
import { dialogs, ui } from '@/data'
import Scene from './Scene'
import scene from './Scene.module.css'

export default function NotFound() {
  const t = ui.notFound
  return (
    <Scene title={t.codigo} lines={dialogs.notFound} file={t.codigo} mode="ERROR">
      <Link to="/" className={scene.button}>
        <PxIcon name="arrow" size={18} />
        {t.boton}
      </Link>
    </Scene>
  )
}
