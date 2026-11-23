import { Icon, Status, TabBar, Toggle } from './kit'

// MENKHANG — clinic token & queue tracker. Teal #0E8C7A, deep #0B4D45, amber #F59E0B.
const TABS = [['ticket', 'My token'], ['plus', 'Book'], ['users', 'Family'], ['info', 'Help']]

function Ring({ ahead = 6, total = 12, size = 210 }) {
  const r = 88, c = 2 * Math.PI * r, done = (total - ahead) / total
  return (
    <div className="mk-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
        <circle cx="100" cy="100" r={r} stroke="#DCEDEA" strokeWidth="14" fill="none" />
        <circle cx="100" cy="100" r={r} stroke="#0E8C7A" strokeWidth="14" fill="none" strokeLinecap="round"
          strokeDasharray={`${c * done} ${c}`} transform="rotate(-90 100 100)" />
      </svg>
      <div><b>{ahead}</b><span>people ahead</span></div>
    </div>
  )
}

function HourChart({ title = 'Queue today · General OPD', now = 4 }) {
  const hrs = [['8', 34], ['9', 58], ['10', 72], ['11', 64], ['12', 40], ['13', 30], ['14', 46], ['15', 38], ['16', 20]]
  return (
    <div className="ux-card mk-chart">
      <div className="ux-row between"><b>{title}</b><span className="ux-sub">Patients waiting by hour</span></div>
      <div className="mk-bars">
        {hrs.map(([h, v], i) => (
          <span key={h} className={i === now - 1 ? 'now' : i >= now ? 'later' : ''}><i style={{ height: `${v}%` }} /><small>{h}{i === now - 1 ? ' · now' : ''}</small></span>
        ))}
      </div>
    </div>
  )
}

export function MkBook({ v1 }) {
  if (v1)
    return (
      <div className="ux mk">
        <Status />
        <div className="ux-top"><Icon n="back" /><b>Book token</b><span /></div>
        <div className="ux-body">
          <h1 className="ux-h1">Your details</h1>
          {['Full name', 'CID number', 'Date of birth', 'Hospital', 'Department', 'Phone number'].map((f) => (
            <div key={f} className="mk-field"><small className="ux-sub">{f}</small><div className="ux-input" /></div>
          ))}
          <p className="ux-note">To book for a family member, go to Settings › Dependants.</p>
          <div className="ux-btn ux-fill">Submit</div>
        </div>
      </div>
    )
  return (
    <div className="ux mk">
      <Status />
      <div className="ux-top"><Icon n="back" /><b>Get a token</b><span className="ux-sub">Step 1/2</span></div>
      <div className="ux-body">
        <h1 className="ux-h1">Who is this for?</h1>
        <div className="mk-who">
          <span className="ux-card"><span className="ux-avatar sm">P</span><b>Myself</b></span>
          <span className="ux-card on"><span className="ux-avatar sm alt">D</span><b>Ap Dorji</b><small className="ux-sub">Grandfather</small><i className="mk-tick"><Icon n="check" s={14} w={3} /></i></span>
          <span className="ux-card add"><Icon n="plus" /><b>Add family</b></span>
        </div>
        <div className="mk-field"><small className="ux-sub">Clinic</small><div className="ux-input between"><span className="ux-row"><Icon n="hospital" /> National Referral Hospital · General OPD</span><Icon n="down" s={18} /></div></div>
        <div className="mk-field"><small className="ux-sub">When</small><div className="ux-seg wide"><i className="on">Today</i><i>Tomorrow</i><i>Pick date</i></div></div>
        <div className="mk-field"><small className="ux-sub">Send SMS updates to</small><div className="ux-input between"><span className="ux-row"><Icon n="sms" /> 17 •• •• 21 · Ap Dorji’s phone</span><Icon n="chev" s={18} /></div></div>
        <div className="ux-card mk-info"><Icon n="info" /><span>Works on basic phones — he’ll get a text when 3 people are ahead.</span></div>
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill">Get token</div>
      </div>
    </div>
  )
}

export function MkToken() {
  return (
    <div className="ux mk">
      <Status />
      <div className="ux-body center">
        <span className="mk-success"><Icon n="check" s={40} w={2.6} /></span>
        <p className="ux-sub">Token booked for Ap Dorji</p>
        <div className="mk-token"><small>Your token</small><b>A-047</b><span>General OPD · Room 4</span></div>
        <div className="mk-stats">
          <span><b>6</b><small>people ahead</small></span>
          <span><b>A-041</b><small>now serving</small></span>
        </div>
        <div className="ux-card mk-info"><Icon n="sms" /><span>We’ll text <b>17 •• •• 21</b> when 3 people are ahead — no need to wait in the corridor.</span></div>
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill">Track the queue</div>
        <div className="ux-btn ghost">Share with family</div>
      </div>
    </div>
  )
}

export function MkQueue({ v1 }) {
  if (v1)
    return (
      <div className="ux mk">
        <Status />
        <div className="ux-top"><span /><b>Queue status</b><span /></div>
        <div className="ux-body center">
          <p className="ux-sub">Estimated waiting time</p>
          <div className="mk-v1time">23<small>min</small></div>
          <p className="ux-note">Updated 10:42 · may change</p>
          <div className="ux-card mk-v1row"><span>Token</span><b>A-047</b></div>
          <div className="ux-card mk-v1row"><span>Position</span><b>7</b></div>
          <div className="ux-card mk-v1row"><span>Department</span><b>General OPD</b></div>
          <div className="ux-spacer" />
          <div className="ux-btn ux-fill">Refresh</div>
        </div>
        <TabBar tabs={TABS} />
      </div>
    )
  return (
    <div className="ux mk">
      <Status />
      <div className="ux-body">
        <div className="ux-row between"><div><p className="ux-sub">A-047 · Ap Dorji</p><h1 className="ux-h1">My queue</h1></div><span className="mk-livechip"><i /> Live</span></div>
        <div className="ux-card mk-hero">
          <Ring />
          <div className="mk-serving"><span><small className="ux-sub">Now serving</small><b>A-041</b></span><span><small className="ux-sub">Usually</small><b>25–35 min</b></span></div>
        </div>
        <div className="mk-line">
          {['042', '043', '044', '045', '046', '047'].map((t, i) => <span key={t} className={i === 5 ? 'you' : ''}>{i === 5 ? 'You' : t}</span>)}
        </div>
        <div className="ux-card mk-rem"><span className="ux-row"><Icon n="bell" /><span><b>Text me when 3 are ahead</b><small className="ux-sub">SMS + notification</small></span></span><Toggle /></div>
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill"><Icon n="pin" /> I’m here — check in</div>
      </div>
      <TabBar tabs={TABS} />
    </div>
  )
}

export function MkAlert({ v1 }) {
  return (
    <div className="ux mk lock ux-fill">
      <Status light time="10:52" />
      <div className="mk-lock">
        <small>Monday, 23 November</small>
        <b>10:52</b>
      </div>
      <div className="mk-notes">
        {!v1 && (
          <div className="mk-note">
            <span className="mk-note-app sms"><Icon n="sms" s={16} /></span>
            <span><small>Messages · now</small><b>MENKHANG</b><span>Token A-047: 3 people ahead. Please come to General OPD, Room 4. Reply 1 if you are on the way.</span></span>
          </div>
        )}
        <div className="mk-note">
          <span className="mk-note-app"><Icon n="hospital" s={16} /></span>
          <span><small>Menkhang · now</small><b>{v1 ? 'Queue updated' : 'Your turn is close'}</b><span>{v1 ? 'Your position has changed.' : 'About 10–15 min. Head to the waiting hall and tap “I’m here”.'}</span></span>
        </div>
      </div>
    </div>
  )
}

export function MkFamily() {
  const fam = [['D', 'Ap Dorji', 'Grandfather', 'A-047 · 3 ahead', 'live'], ['S', 'Aum Sangay', 'Mother', 'Dental · Tomorrow 9:00', 'booked'], ['P', 'Me', 'Pema', 'No token today', '']]
  return (
    <div className="ux mk">
      <Status />
      <div className="ux-body">
        <h1 className="ux-h1">Family</h1>
        <p className="ux-p">Book and track tokens for the people you care for.</p>
        {fam.map(([a, n, r, s, st]) => (
          <div key={n} className="ux-card mk-fam"><span className={`ux-avatar sm ${st === 'live' ? 'alt' : ''}`}>{a}</span><span><b>{n}</b><small className="ux-sub">{r}</small></span><span className={`mk-pill ${st}`}>{s}</span></div>
        ))}
        <div className="ux-btn ghost"><Icon n="plus" /> Add a family member</div>
      </div>
      <TabBar tabs={TABS} active={2} />
    </div>
  )
}

export function MkCheckin() {
  return (
    <div className="ux mk">
      <Status />
      <div className="ux-body center">
        <span className="mk-success big"><Icon n="check" s={56} w={2.6} /></span>
        <h1 className="ux-h1">You’re checked in</h1>
        <p className="ux-p">Wait in the General OPD hall. Go to <b>Room 4</b> when <b>A-047</b> shows on the screen.</p>
        <div className="mk-board"><small>NOW SERVING</small><div><span>A-044</span><span>Room 4</span></div></div>
        <div className="ux-card mk-info"><Icon n="users" /><span>Need help? Show this screen at the front desk.</span></div>
        <div className="ux-spacer" />
        <div className="ux-btn ghost">I need to step out</div>
      </div>
    </div>
  )
}

// Responsive web tracker (opened from the SMS link on any phone or computer).
export function MkWeb() {
  return (
    <div className="ux mk mkweb">
      <header className="w-nav">
        <b className="w-logo"><span className="ux-fill"><Icon n="hospital" s={18} w={2.2} /></span>Menkhang</b>
        <nav className="w-links"><span className="on">My token</span><span>Clinics</span><span>Help</span></nav>
        <span className="ux-btn sm ghost w-cta">EN · Dzongkha</span>
        <span className="w-burger"><Icon n="menu" /></span>
      </header>
      <div className="mkweb-main">
        <div className="ux-card mkweb-token">
          <p className="ux-sub">Token for Ap Dorji · General OPD</p>
          <div className="mkweb-row"><Ring size={190} /><div className="mkweb-big"><small>Your token</small><b>A-047</b><span className="mk-livechip"><i /> Live</span></div></div>
          <div className="ux-btn ux-fill">I’m here — check in</div>
        </div>
        <div className="mkweb-side">
          <div className="mk-board"><small>NOW SERVING</small><div><span>A-041</span><span>Room 4</span></div><div><span>A-040</span><span>Room 2</span></div></div>
          <div className="ux-card mk-rem"><span className="ux-row"><Icon n="sms" /><span><b>SMS to 17 •• •• 21</b><small className="ux-sub">When 3 people are ahead</small></span></span><Toggle /></div>
          <div className="ux-card mk-info"><Icon n="clock" /><span>Usually <b>25–35 min</b> at this time of day.</span></div>
        </div>
        <div className="mkweb-wide"><HourChart title="Busy times · General OPD" /></div>
        <div className="ux-card mkweb-help"><Icon n="hospital" /><span><b>General OPD · Ground floor, Room 4</b><small className="ux-sub">Bring your CID and any old prescriptions. Ask the front desk if you need a wheelchair.</small></span></div>
      </div>
    </div>
  )
}

export function MkDesk() {
  const rows = [['A-042', 'Karma W.', 'Checked in', 'ok'], ['A-043', 'Dechen Y.', 'On the way', 'way'], ['A-044', 'Tandin', 'SMS sent', 'sms'], ['A-045', 'Ugyen L.', 'Checked in', 'ok'], ['A-046', 'Sonam C.', 'Booked', ''], ['A-047', 'Dorji (via Pema)', 'Booked', '']]
  return (
    <div className="ux mk mkdesk">
      <header className="w-nav"><b className="w-logo"><span className="ux-fill"><Icon n="hospital" s={18} w={2.2} /></span>Menkhang · Front desk</b><nav className="w-links"><span className="on">Queue</span><span>Rooms</span><span>Reports</span></nav><span className="ux-avatar sm">FD</span></header>
      <div className="mkdesk-main">
        <div className="mkdesk-stats">
          {[['Now serving', 'A-041'], ['Waiting', '23'], ['Checked in', '14'], ['Avg. wait', '28 min']].map(([l, v]) => <div key={l} className="ux-card"><small className="ux-sub">{l}</small><b>{v}</b></div>)}
        </div>
        <div className="mkdesk-grid">
          <div className="ux-card mkdesk-table">
            <div className="ux-row between"><h2 className="ux-h2">General OPD queue</h2><span className="ux-btn sm ux-fill">Call next · A-042</span></div>
            <table><thead><tr><th>Token</th><th>Patient</th><th>Status</th><th /></tr></thead>
              <tbody>{rows.map(([t, n, s, k]) => <tr key={t}><td><b>{t}</b></td><td>{n}</td><td><span className={`mk-pill ${k}`}>{s}</span></td><td className="ux-sub">⋯</td></tr>)}</tbody>
            </table>
          </div>
          <div className="ux-card mkdesk-rooms">
            <h2 className="ux-h2">Rooms</h2>
            {[['Room 1', 'Dr. Wangmo', 'A-039'], ['Room 2', 'Dr. Tshering', 'A-040'], ['Room 4', 'Dr. Lhamo', 'A-041'], ['Room 5', 'Break · back 11:15', '—']].map(([r, d, t]) => (
              <div key={r} className="mkdesk-room"><span><b>{r}</b><small className="ux-sub">{d}</small></span><b>{t}</b></div>
            ))}
          </div>
        </div>
        <div className="mkdesk-grid">
          <HourChart />
          <div className="ux-card mkdesk-rooms">
            <h2 className="ux-h2">SMS sent today</h2>
            {[['10:41', 'A-044', '3 ahead · delivered'], ['10:36', 'A-043', '3 ahead · replied “1”'], ['10:22', 'A-042', 'Your turn · delivered']].map(([t, k, m]) => (
              <div key={t} className="mkdesk-room"><span><b>{k}</b><small className="ux-sub">{m}</small></span><span className="ux-sub">{t}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const menkhangScreens = {
  book: MkBook, bookV1: () => <MkBook v1 />, token: MkToken, queue: MkQueue, queueV1: () => <MkQueue v1 />,
  alert: MkAlert, alertV1: () => <MkAlert v1 />, family: MkFamily, checkin: MkCheckin, web: MkWeb, desk: MkDesk,
}
