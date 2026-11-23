// Shared building blocks for the app screens (Lam, Tshechu, Menkhang).
// Every screen is drawn at real device size (phone 390×844, tablet 834×1112,
// desktop 1440×900) and scaled down by <Frame>, so the designs stay crisp
// and readable — like a Figma frame.

const P = {
  bus: <><rect x="5" y="3" width="14" height="15" rx="3" /><path d="M5 11h14M7.5 18v2.5M16.5 18v2.5" /><circle cx="8.5" cy="14.5" r=".9" /><circle cx="15.5" cy="14.5" r=".9" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  ticket: <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z M14 7v10" />,
  home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  bell: <><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.2 2.2 3.8 5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cal: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7.6" r=".6" /></>,
  camera: <><rect x="3" y="7" width="18" height="13" rx="3" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
  chev: <path d="M9 6l6 6-6 6" />,
  back: <path d="M15 6l-6 6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  map: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></>,
  shirt: <path d="M8 4L3 7l2 4 2-1v10h10V10l2 1 2-4-5-3a4 4 0 0 1-8 0z" />,
  sms: <path d="M4 5h16v11H9l-5 4z M8 10h8" />,
  card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sound: <><path d="M4 10v4h4l5 4V6L8 10z" /><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" /></>,
  flash: <><path d="M13 3L5 14h6l-1 7 8-11h-6z" /><path d="M3 3l18 18" /></>,
  seat: <path d="M7 3v10h10M7 13v8M17 13v8M7 8h9" />,
  walk: <><circle cx="13" cy="4.5" r="1.8" /><path d="M10 21l2-6-2.5-2.5L11 8l3 3 3 1M8.5 11L7 14M14 15l2 6" /></>,
  sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
  offline: <><path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4-2.4M19 12.5a10 10 0 0 0-3.2-2.1M2 9a14 14 0 0 1 4-2.5M22 9A14 14 0 0 0 11 5.1" /><circle cx="12" cy="20" r=".8" /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  hospital: <><path d="M4 21V8l8-5 8 5v13z" /><path d="M12 9v6M9 12h6M9 21v-3h6v3" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4" /></>,
  text: <path d="M4 18L9 6l5 12M5.8 14h6.4M15 18l3-7 3 7M15.9 16h4.2" />,
}

export function Icon({ n, s = 22, w = 1.9, style, className }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth={w}
      strokeLinecap="round" strokeLinejoin="round" style={style} className={className} aria-hidden="true">
      {P[n]}
    </svg>
  )
}

export function Status({ time = '9:41', light }) {
  return (
    <div className={`ux-status ${light ? 'light' : ''}`}>
      <span>{time}</span>
      <span className="ux-status-r">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="currentColor"><rect x=".5" y=".5" width="22" height="11" rx="3.5" opacity=".45" /><rect x="2.5" y="2.5" width="16" height="7" rx="2" fill="currentColor" stroke="none" /><path d="M24.5 4v4" strokeWidth="1.6" strokeLinecap="round" opacity=".45" /></svg>
      </span>
    </div>
  )
}

export function TabBar({ tabs, active = 0 }) {
  return (
    <nav className="ux-tabbar">
      {tabs.map(([icon, label], i) => (
        <span key={label} className={i === active ? 'on' : ''}>
          <Icon n={icon} s={24} w={i === active ? 2.2 : 1.8} />
          {label}
        </span>
      ))}
    </nav>
  )
}

export function Toggle({ on = true }) {
  return <span className={`ux-toggle ${on ? 'on' : ''}`}><i /></span>
}

// Deterministic QR-like code (decorative).
export function QR({ size = 180, seed = 7, color = '#111' }) {
  const N = 25
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const finder = (x, y) => (x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)
  const cells = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  const F = ({ x, y }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x=".5" y=".5" width="6" height="6" fill="none" stroke={color} strokeWidth="1" />
      <rect x="2" y="2" width="3" height="3" />
    </g>
  )
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} width={size} height={size} fill={color} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      {cells}
      <F x={0} y={0} /><F x={N - 7} y={0} /><F x={0} y={N - 7} />
    </svg>
  )
}

// Original geometric artwork used instead of photos (no copyrighted imagery).
export function Pattern({ a = '#7A1F2B', b = '#E8A317', c = '#FBF6EE', seed = 1, style, className }) {
  const r = (k) => ((Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1
  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" style={style} className={`ux-fill ${className || ''}`} aria-hidden="true">
      <rect width="200" height="120" fill={a} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${40 + i * 60 + r(i) * 20} ${50 + r(i + 4) * 30})`}>
          <circle r={38 - i * 6} fill="none" stroke={b} strokeWidth="2" opacity=".55" />
          <circle r={24 - i * 4} fill={b} opacity=".22" />
          {Array.from({ length: 8 }, (_, k) => (
            <path key={k} d="M0 -16 L4 -4 L0 0 L-4 -4Z" fill={c} opacity=".5" transform={`rotate(${k * 45})`} />
          ))}
        </g>
      ))}
      <path d="M0 105 Q50 85 100 100 T200 92 V120 H0Z" fill={c} opacity=".12" />
    </svg>
  )
}
