// Paper "Crazy 8s" sketches — pencil-style doodles of 8 quick ideas.
const L = {
  list: <><rect x="18" y="40" width="84" height="12" rx="3" /><path d="M18 64h84M18 80h84M18 96h84M18 112h60" /><circle cx="26" cy="64" r="3" /><circle cx="26" cy="80" r="3" /></>,
  map: <><path d="M14 32 L106 40 M30 20 L44 150 M80 20 L74 150 M14 100 L106 90" /><path d="M20 60 C 50 70 60 110 100 120" strokeWidth="3" /><circle cx="56" cy="88" r="7" /></>,
  big: <><text x="60" y="88" textAnchor="middle" fontSize="40" fontFamily="Caveat" stroke="none" fill="#3a3a3a">3</text><text x="60" y="106" textAnchor="middle" fontSize="13" fontFamily="Caveat" stroke="none" fill="#3a3a3a">min</text><circle cx="60" cy="80" r="34" /><rect x="22" y="128" width="76" height="14" rx="7" /></>,
  timeline: <><path d="M34 30 V140" /><circle cx="34" cy="40" r="5" /><circle cx="34" cy="75" r="5" /><circle cx="34" cy="110" r="5" /><path d="M48 40h50M48 75h40M48 110h46" /></>,
  cards: <><rect x="16" y="30" width="40" height="44" rx="5" /><rect x="64" y="30" width="40" height="44" rx="5" /><rect x="16" y="82" width="40" height="44" rx="5" /><rect x="64" y="82" width="40" height="44" rx="5" /></>,
  sheet: <><path d="M14 30 L106 30 M60 30 V90" /><rect x="10" y="90" width="100" height="62" rx="10" /><path d="M24 108h60M24 124h40" /></>,
  qr: <><rect x="34" y="40" width="52" height="52" /><rect x="40" y="46" width="12" height="12" /><rect x="68" y="46" width="12" height="12" /><rect x="40" y="74" width="12" height="12" /><path d="M24 112h72M36 128h48" /></>,
  form: <><rect x="16" y="34" width="88" height="16" rx="4" /><rect x="16" y="58" width="88" height="16" rx="4" /><rect x="16" y="82" width="88" height="16" rx="4" /><rect x="30" y="122" width="60" height="18" rx="9" /></>,
  chat: <><path d="M16 36h60v24H30l-8 8v-8h-6z" /><path d="M104 80H44v24h50l8 8v-8h2z" /><path d="M24 48h40M52 92h40" /></>,
  ring: <><circle cx="60" cy="78" r="36" /><path d="M60 42 A36 36 0 0 1 94 90" strokeWidth="5" /><path d="M24 136h72" /></>,
  audio: <><rect x="16" y="34" width="88" height="54" rx="6" /><path d="M30 110 L30 126 L44 118Z" /><path d="M54 118 h48" /></>,
  board: <><rect x="12" y="34" width="96" height="70" rx="6" /><path d="M24 54h40M24 72h56M24 90h30" /><rect x="70" y="112" width="34" height="16" rx="4" /></>,
}

export default function Crazy8({ ideas }) {
  return (
    <div className="crazy8">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="pencil"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="2.6" /></filter>
      </svg>
      {ideas.map((it, k) => (
        <figure key={it.title} className={`c8 ${it.pick ? 'pick' : ''}`}>
          <svg viewBox="0 0 120 165" aria-hidden="true">
            <g filter="url(#pencil)" fill="none" stroke="#3a3a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="108" height="154" rx="14" />
              <path d="M48 14h24" />
              {L[it.sketch] || L.list}
            </g>
          </svg>
          <figcaption><span>{k + 1}</span>{it.title}</figcaption>
          {it.pick && <em className="c8-pick">Picked</em>}
        </figure>
      ))}
    </div>
  )
}
