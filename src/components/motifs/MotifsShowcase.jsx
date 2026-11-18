import { useState } from 'react'
import { PropIcon } from './PropIcon.jsx'
import { PROP_NAMES } from './propNames.js'
import { HeartRow } from './HeartRow.jsx'
import { SpaceShip } from './SpaceShip.jsx'
import { Collectible } from './Collectible.jsx'
import { ProgressHourglass } from './ProgressHourglass.jsx'
import { HeartMeter } from './HeartMeter.jsx'
import { RfaParty } from './RfaParty.jsx'
import { HEART_ORDER, HEART_COLORS, HEART_NAMES } from './hearts.js'
import './motifs.css'

const SECTION_LABELS = {
  707: 'Stack',
  jumin: 'Proyectos',
  zen: 'Diseño',
  yoosung: 'Contacto',
  jaehee: 'Sobre mí',
  v: 'Trayectoria',
  unknown: 'Secreto',
}

const card = {
  background: 'var(--blanco, #fff)',
  border: 'var(--borde, 3px solid #3D2C5C)',
  borderRadius: 'var(--radio, 12px)',
  boxShadow: 'var(--sombra-dura, 5px 5px 0 #3D2C5C)',
  padding: '16px 18px',
  marginBottom: 24,
}
const h2 = {
  fontFamily: 'var(--font-pixel, monospace)',
  fontSize: 20,
  margin: '0 0 12px',
  color: 'var(--tinta, #3D2C5C)',
}
const label = {
  fontFamily: 'var(--font-mono-px, monospace)',
  fontSize: 11,
  color: 'var(--tinta-suave, #6E5E8E)',
}
const chip = (on) => ({
  fontFamily: 'var(--font-mono-px, monospace)',
  fontSize: 12,
  padding: '4px 10px',
  border: '2px solid var(--tinta, #3D2C5C)',
  borderRadius: 999,
  background: on ? 'var(--limon, #FFF1B8)' : 'var(--blanco, #fff)',
  color: 'var(--tinta, #3D2C5C)',
  cursor: 'pointer',
})

/** Vitrina de todos los motivos de V, para revision del orquestador. */
export default function MotifsShowcase() {
  const [visited, setVisited] = useState(['707', 'v'])
  const [shipClicks, setShipClicks] = useState(0)
  const [collected, setCollected] = useState(0)
  const [rooms, setRooms] = useState(3)
  const [meter, setMeter] = useState(4)
  const [party, setParty] = useState(false)

  const toggle = (id) =>
    setVisited((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]))

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px 80px', color: 'var(--tinta, #3D2C5C)' }}>
      <h1 style={{ ...h2, fontSize: 28 }}>Motivos de V</h1>
      <p style={{ ...label, fontSize: 12, marginBottom: 24 }}>
        Exports de @/components/motifs: PropIcon, PROP_NAMES, HeartRow, HeartMeter, RfaParty, ProgressHourglass,
        SpaceShip, Collectible.
      </p>

      <section style={card}>
        <h2 style={h2}>HeartMeter (HUD móvil)</h2>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 12 }}>
          <HeartMeter value={meter} max={7} />
          <HeartMeter value={meter} max={7} size={64} />
          <HeartMeter value={7} max={7} />
          <HeartMeter value={0} max={7} />
        </div>
        <label style={{ ...label, display: 'flex', gap: 10, alignItems: 'center' }}>
          Corazones: {meter} de 7
          <input type="range" min={0} max={7} step={1} value={meter} onChange={(e) => setMeter(Number(e.target.value))} />
        </label>
      </section>

      <section style={card}>
        <h2 style={h2}>RfaParty</h2>
        <button type="button" style={chip(true)} onClick={() => setParty(true)}>
          Abrir la fiesta
        </button>
        <RfaParty
          open={party}
          onClose={() => setParty(false)}
          title="Fiesta de la RFA"
          message="Encontraste los 7 corazones. Todo el equipo vino a celebrar contigo."
          cta={{ label: 'Ver proyectos', to: '#proyectos' }}
        />
      </section>

      <section style={card}>
        <h2 style={h2}>SpaceShip</h2>
        <SpaceShip onClick={() => setShipClicks((n) => n + 1)} />
        <p style={label}>
          Clics en la nave: {shipClicks}. Deriva en el ancho del contenedor; suelta chips cada 12 a 20 s.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>PropIcon</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 16 }}>
          {PROP_NAMES.map((name) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6, height: 52 }}>
                <PropIcon name={name} size={16} />
                <PropIcon name={name} size={24} />
                <PropIcon name={name} size={48} />
              </div>
              <div style={label}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={label}>heart con color:</span>
          {HEART_ORDER.map((id) => (
            <PropIcon key={id} name="heart" size={32} color={HEART_COLORS[id]} title={`Corazón de ${HEART_NAMES[id]}`} />
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>ProgressHourglass (ya no va en el HUD)</h2>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 12 }}>
          <ProgressHourglass value={rooms} max={7} />
          <ProgressHourglass value={rooms} max={7} size={88} />
          <ProgressHourglass value={7} max={7} size={44} />
        </div>
        <label style={{ ...label, display: 'flex', gap: 10, alignItems: 'center' }}>
          Salas: {rooms} de 7
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
          />
        </label>
      </section>

      <section style={card}>
        <h2 style={h2}>HeartRow (HUD)</h2>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <HeartRow visited={visited} labels={SECTION_LABELS} />
          <HeartRow visited={visited} labels={SECTION_LABELS} size={32} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {HEART_ORDER.map((id) => (
            <button key={id} type="button" style={chip(visited.includes(id))} onClick={() => toggle(id)}>
              {HEART_NAMES[id]}
            </button>
          ))}
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>Collectible</h2>
        <p style={label}>
          Aquí aparece cada 5 s aprox. (en el sitio, cada 25 s) en un punto al azar del viewport y se va a los 8 s.
          Recogidos: {collected}.
        </p>
        <Collectible everyMs={5000} onCollect={() => setCollected((n) => n + 1)} />
      </section>
    </div>
  )
}
