import { Icon, Status, TabBar, QR } from './kit'

// LAM — Thimphu city bus companion. Primary #1F5EFF, live-green #12A150.
const TABS = [['pin', 'Nearby'], ['map', 'Map'], ['route', 'Routes'], ['ticket', 'Tickets'], ['star', 'Saved']]
const Badge = ({ n, c = '#1F5EFF' }) => <span className="lam-route" style={{ background: c }}>{n}</span>
const Live = () => <span className="lam-live"><i />Live</span>

function MiniMap({ h = 300, full, pins, bus = true }) {
  return (
    <svg className="lam-map ux-fill" viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" style={{ height: h }} aria-hidden="true">
      <rect width="390" height="300" fill="#EAF0F7" />
      <path d="M-10 230 C 80 200, 120 260, 210 220 S 330 170, 400 200 L400 300 L-10 300Z" fill="#DCE8F3" />
      <path d="M-10 250 C 90 215, 130 275, 215 238 S 330 190, 400 218" stroke="#B9D3EC" strokeWidth="10" fill="none" />
      <g stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round">
        <path d="M20 40 L370 70" /><path d="M60 0 L120 300" /><path d="M250 0 L230 300" /><path d="M0 150 L390 120" />
      </g>
      <path d="M30 60 C 120 70, 140 140, 200 140 S 300 150, 350 240" stroke="#1F5EFF" strokeWidth="6" fill="none" strokeLinecap="round" />
      {[[30, 60], [118, 92], [200, 140], [282, 160], [350, 240]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 9 : 6} fill="#fff" stroke="#1F5EFF" strokeWidth={i === 2 ? 4 : 3} />
      ))}
      {bus && (
        <g transform="translate(140 104)">
          <circle r="22" fill="#1F5EFF" opacity=".15" />
          <rect x="-15" y="-13" width="30" height="26" rx="8" fill="#1F5EFF" />
          <path d="M-8 -5h16M-8 2h16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}
      <g transform="translate(200 140)"><circle r="20" fill="#12A150" opacity=".18" /></g>
      {pins && pins.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}><path d="M0 0 C -9 -12 -9 -22 0 -24 C 9 -22 9 -12 0 0Z" fill="#E5484D" /><circle cy="-15" r="3.4" fill="#fff" /></g>
      ))}
      {full && <text x="200" y="175" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16325C">Clock Tower</text>}
    </svg>
  )
}

export function LamOnboard() {
  return (
    <div className="ux lam">
      <Status />
      <div className="ux-body">
        <div className="lam-hero ux-fill">
          <svg viewBox="0 0 350 230" width="100%" height="100%" aria-hidden="true">
            <path d="M0 170 L60 90 L110 140 L170 60 L240 150 L290 100 L350 160 V230 H0Z" fill="#fff" opacity=".16" />
            <path d="M0 200 L80 150 L150 190 L230 140 L350 190 V230 H0Z" fill="#fff" opacity=".22" />
            <rect x="0" y="196" width="350" height="34" fill="#0B2A6B" opacity=".35" />
            <g transform="translate(115 128)">
              <rect width="120" height="70" rx="16" fill="#FFD23F" />
              <rect x="12" y="12" width="28" height="24" rx="5" fill="#0B2A6B" opacity=".85" />
              <rect x="46" y="12" width="28" height="24" rx="5" fill="#0B2A6B" opacity=".85" />
              <rect x="80" y="12" width="28" height="24" rx="5" fill="#0B2A6B" opacity=".85" />
              <circle cx="28" cy="72" r="10" fill="#0B2A6B" /><circle cx="92" cy="72" r="10" fill="#0B2A6B" />
            </g>
            <g fill="#fff"><circle cx="290" cy="46" r="16" opacity=".9" /></g>
          </svg>
        </div>
        <h1 className="ux-h1 lam-big">Know when your bus is coming.</h1>
        <p className="ux-p">Live arrivals for every Thimphu city bus. No account needed.</p>
        <div className="ux-card lam-setting">
          <span className="ux-row"><Icon n="text" /> <b>Text size</b></span>
          <span className="ux-seg"><i>Standard</i><i className="on">Large</i></span>
        </div>
        <div className="ux-card lam-setting">
          <span className="ux-row"><Icon n="globe" /> <b>Language</b></span>
          <span className="ux-sub">English · Dzongkha soon</span>
        </div>
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill"><Icon n="pin" /> Use my location</div>
        <div className="ux-btn ghost">Choose my stop instead</div>
        <p className="ux-note">Continue as a guest — sign up later if you want.</p>
      </div>
    </div>
  )
}

export function LamHome({ official }) {
  const stop = official ? ['Stop 14', 'Norzin Lam North (NL-14)'] : ['Clock Tower', 'Opposite the Clock Tower Square · 120 m']
  const stop2 = official ? ['Stop 09', 'Norzin Lam South (NL-09)'] : ['Norzin Lam', 'Beside Hotel Druk · 350 m']
  return (
    <div className="ux lam">
      <Status />
      <div className="ux-body">
        <div className="ux-row between">
          <div><p className="ux-sub">Good morning</p><h1 className="ux-h1">Nearby stops</h1></div>
          <span className="ux-avatar">K</span>
        </div>
        <div className="ux-input"><Icon n="search" /> Where are you going?</div>
        <div className="ux-card lam-stop">
          <div className="ux-row between">
            <div className="ux-row"><span className="lam-pin"><Icon n="pin" s={20} /></span><div><b className="lam-stopname">{stop[0]}</b><small className="ux-sub">{stop[1]}</small></div></div>
            <Live />
          </div>
          {[['3', 'Babesa', '3', '#1F5EFF'], ['7', 'Dechencholing', '8', '#7C3AED'], ['11', 'Changzamtog', '14', '#E8590C']].map(([n, to, m, c], i) => (
            <div key={n} className={`lam-arr ${i === 0 ? 'first' : ''}`}>
              <Badge n={n} c={c} /><span className="lam-to">{to}</span><span className="lam-min"><b>{m}</b> min</span>
            </div>
          ))}
          <span className="ux-link">See all departures <Icon n="chev" s={16} /></span>
        </div>
        <div className="ux-card lam-stop compact">
          <div className="ux-row"><span className="lam-pin alt"><Icon n="pin" s={20} /></span><div><b className="lam-stopname">{stop2[0]}</b><small className="ux-sub">{stop2[1]}</small></div></div>
          <span className="lam-min"><b>7</b> min</span>
        </div>
        <div>
          <p className="ux-label">Saved</p>
          <div className="ux-row wrap"><span className="ux-chip"><Icon n="home" s={16} /> Home · Babesa</span><span className="ux-chip"><Icon n="star" s={16} /> College · Motithang</span></div>
        </div>
      </div>
      <TabBar tabs={TABS} />
    </div>
  )
}

export function LamHomeV1() {
  return (
    <div className="ux lam">
      <Status />
      <div className="lam-v1map">
        <MiniMap h={844} full pins={[[90, 70], [210, 90], [300, 200], [120, 220]]} bus={false} />
        <div className="ux-input floating"><Icon n="search" /> Search stops</div>
      </div>
      <div className="lam-sheet">
        <span className="lam-grab" />
        <b className="lam-stopname">Stop 14</b>
        <p className="ux-sub">Tap a stop on the map to see bus times.</p>
        <div className="ux-btn ghost sm">View timetable (PDF)</div>
      </div>
      <TabBar tabs={[['map', 'Map'], ['route', 'Routes'], ['ticket', 'Tickets'], ['user', 'Account']]} />
    </div>
  )
}

export function LamLive() {
  const stops = [['Bus Terminal', 'Passed', 'past'], ['Norzin Lam', 'Bus is here', 'bus'], ['Clock Tower', 'Your stop · 3 min', 'you'], ['Changzamtog', '9 min', ''], ['Babesa', '21 min', '']]
  return (
    <div className="ux lam">
      <Status />
      <div className="ux-top"><Icon n="back" /><b>Route 3 · to Babesa</b><Icon n="bell" /></div>
      <MiniMap h={250} />
      <div className="ux-body tight">
        <div className="ux-card lam-eta">
          <div><Live /><h2 className="ux-h2">Bus is 2 stops away</h2><p className="ux-sub">Arrives at Clock Tower at 9:44</p></div>
          <div className="lam-eta-num"><b>3</b><small>min</small></div>
        </div>
        <ol className="lam-stops">
          {stops.map(([s, t, k]) => (
            <li key={s} className={k}><i>{k === 'bus' && <Icon n="bus" s={14} w={2.4} />}</i><span><b>{s}</b><small>{t}</small></span></li>
          ))}
        </ol>
        <div className="ux-row gap">
          <div className="ux-btn ghost half"><Icon n="bell" /> Remind me</div>
          <div className="ux-btn ux-fill half">Buy ticket · Nu. 20</div>
        </div>
      </div>
    </div>
  )
}

export function LamPlan() {
  const opts = [
    ['Route 3 · direct', '22 min', 'Leaves Clock Tower in 3 min', ['walk', '3'], true],
    ['Route 7 + short walk', '28 min', 'Leaves in 8 min · 400 m walk', ['7', 'walk'], false],
    ['Route 11 → Route 3', '35 min', '1 change at Changzamtog', ['11', '3'], false],
  ]
  return (
    <div className="ux lam">
      <Status />
      <div className="ux-top"><Icon n="back" /><b>Plan a trip</b><span /></div>
      <div className="ux-body">
        <div className="ux-card lam-fromto">
          <div className="ux-row"><i className="dot from" /><span><small className="ux-sub">From</small><b>Clock Tower</b></span></div>
          <div className="ux-row"><i className="dot to" /><span><small className="ux-sub">To</small><b>Babesa · near Bhutan Post</b></span></div>
        </div>
        <div className="ux-row wrap"><span className="ux-chip on">Leave now</span><span className="ux-chip">Fewest changes</span><span className="ux-chip">Less walking</span></div>
        {opts.map(([t, d, s, legs, best]) => (
          <div key={t} className={`ux-card lam-opt ${best ? 'best' : ''}`}>
            <div className="ux-row between"><b>{t}</b><b className="lam-dur">{d}</b></div>
            <div className="ux-row lam-legs">
              {legs.map((l, i) => (
                <span key={i} className="ux-row">{i > 0 && <Icon n="chev" s={14} />}{l === 'walk' ? <Icon n="walk" s={20} /> : <Badge n={l} c={l === '7' ? '#7C3AED' : l === '11' ? '#E8590C' : '#1F5EFF'} />}</span>
              ))}
              <span className="ux-sub">{s}</span>
            </div>
            {best && <span className="ux-tag">Fastest · Nu. 20</span>}
          </div>
        ))}
      </div>
      <TabBar tabs={TABS} active={2} />
    </div>
  )
}

export function LamPay({ login }) {
  if (login)
    return (
      <div className="ux lam">
        <Status />
        <div className="ux-top"><Icon n="back" /><b>Tickets</b><span /></div>
        <div className="ux-body center">
          <span className="lam-lock"><Icon n="lock" s={40} /></span>
          <h2 className="ux-h2">Sign in to buy tickets</h2>
          <p className="ux-p">Create an account with your CID number, email and a password to continue.</p>
          <div className="ux-input">CID number</div>
          <div className="ux-input">Email</div>
          <div className="ux-input">Password</div>
          <div className="ux-btn ux-fill">Create account</div>
          <p className="ux-note">Already have an account? Sign in</p>
        </div>
      </div>
    )
  return (
    <div className="ux lam">
      <Status />
      <div className="ux-top"><Icon n="back" /><b>Buy ticket</b><span /></div>
      <div className="ux-body">
        <div className="ux-card lam-trip"><Badge n="3" /><div><b>Clock Tower → Babesa</b><small className="ux-sub">Valid 60 min from purchase</small></div></div>
        <div className="ux-card">
          {[['Adult', 'Nu. 20', 1], ['Student', 'Nu. 10', 0], ['Senior citizen', 'Free', 0]].map(([t, p, n]) => (
            <div key={t} className="lam-pax"><span><b>{t}</b><small className="ux-sub">{p}</small></span><span className="ux-step"><i>−</i><b>{n}</b><i className="on">+</i></span></div>
          ))}
        </div>
        <p className="ux-label">Pay with</p>
        {[['mBoB', 'Bank of Bhutan', true], ['mPay', 'Bhutan National Bank', false], ['Card', 'Visa / Mastercard', false]].map(([t, s, on]) => (
          <div key={t} className={`ux-card lam-payopt ${on ? 'on' : ''}`}><span className="lam-paylogo">{t[0]}</span><span><b>{t}</b><small className="ux-sub">{s}</small></span><i className="ux-radio" /></div>
        ))}
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill">Pay Nu. 20 with mBoB</div>
        <p className="ux-note">No account needed — the ticket is saved on this phone.</p>
      </div>
    </div>
  )
}

export function LamTicket() {
  return (
    <div className="ux lam dark">
      <Status light />
      <div className="ux-top light"><Icon n="x" /><b>Your ticket</b><Icon n="sun" /></div>
      <div className="ux-body center">
        <div className="lam-ticket">
          <div className="ux-row between"><span className="ux-row"><span className="lam-route" style={{ background: '#1F5EFF' }}>3</span><b>Babesa</b></span><span className="ux-tag ok">Valid</span></div>
          <div className="lam-qr"><QR size={210} seed={11} color="#0B1A3A" /></div>
          <p className="lam-tc">Show this to the driver</p>
          <div className="lam-timer"><span>Expires in</span><b>58:12</b></div>
          <div className="lam-bar"><i style={{ width: '96%' }} /></div>
          <div className="lam-perf" />
          <div className="ux-row between lam-meta"><span><small>Passenger</small><b>1 Adult</b></span><span><small>Fare</small><b>Nu. 20</b></span><span><small>Ticket</small><b>#LM-48213</b></span></div>
        </div>
        <p className="ux-note light">Screen brightness raised for scanning.</p>
      </div>
    </div>
  )
}

// Responsive web — renders correctly at 1440, 834 and 390 wide (container queries).
export function LamWeb() {
  return (
    <div className="ux lam lamweb">
      <header className="w-nav">
        <b className="w-logo"><span className="ux-fill"><Icon n="bus" s={18} w={2.2} /></span>Lam</b>
        <nav className="w-links"><span className="on">Live map</span><span>Routes</span><span>Fares</span><span>Help</span></nav>
        <span className="ux-btn sm ux-fill w-cta">Get the app</span>
        <span className="w-burger"><Icon n="menu" /></span>
      </header>
      <div className="lamweb-main">
        <aside className="lamweb-side">
          <h1 className="ux-h1">Where to?</h1>
          <div className="ux-card lam-fromto">
            <div className="ux-row"><i className="dot from" /><span><small className="ux-sub">From</small><b>Clock Tower</b></span></div>
            <div className="ux-row"><i className="dot to" /><span><small className="ux-sub">To</small><b>Babesa</b></span></div>
          </div>
          <div className="ux-row between"><p className="ux-label">Departures · Clock Tower</p><Live /></div>
          {[['3', 'Babesa', '3', '#1F5EFF'], ['7', 'Dechencholing', '8', '#7C3AED'], ['11', 'Changzamtog', '14', '#E8590C'], ['3', 'Babesa', '23', '#1F5EFF']].map(([n, to, m, c], i) => (
            <div key={i} className="ux-card lamweb-dep"><span className="lam-route" style={{ background: c }}>{n}</span><span className="lam-to">{to}</span><span className="lam-min"><b>{m}</b> min</span></div>
          ))}
        </aside>
        <div className="lamweb-map">
          <MiniMap h="100%" full />
          <div className="lamweb-float ux-card"><Live /><b>Route 3 is 2 stops away</b><small className="ux-sub">Arrives 9:44 · 4 seats free</small></div>
        </div>
      </div>
    </div>
  )
}

export const lamScreens = {
  onboard: LamOnboard, home: LamHome, live: LamLive, plan: LamPlan, pay: LamPay, ticket: LamTicket,
  homeV1: LamHomeV1, homeOfficial: () => <LamHome official />, payV1: () => <LamPay login />, web: LamWeb,
}
