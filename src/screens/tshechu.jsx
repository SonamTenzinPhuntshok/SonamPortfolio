import { Icon, Status, TabBar, Pattern, Toggle } from './kit'

// TSHECHU — festival companion. Maroon #7A1F2B, saffron #E8A317, cream #FBF6EE.
const TABS = [['sparkle', 'Today'], ['cal', 'Dances'], ['map', 'Map'], ['star', 'My day']]
const TABS_V1 = [['sparkle', 'Today'], ['cal', 'Dances'], ['map', 'Map'], ['info', 'Etiquette']]
const Off = () => <span className="ts-off"><Icon n="check" s={14} w={2.6} /> Offline ready</span>

export function TsFestivals({ v1 }) {
  const fests = [
    ['Paro Tshechu', 'Rinpung Dzong · Day 2 of 5', 'now', 1],
    ['Thimphu Tshechu', 'Tashichho Dzong · 3 days', '18 MB', 2],
    ['Punakha Drubchen', 'Punakha Dzong · 3 days', '15 MB', 3],
    ['Jambay Lhakhang Drup', 'Bumthang · 5 days', '21 MB', 4],
  ]
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-body">
        <p className="ux-label">Kuzuzangpo 🙏</p>
        <h1 className="ux-h1">Choose your festival</h1>
        {!v1 && <div className="ts-banner"><Icon n="offline" /><span><b>Signal is weak in the courtyard.</b> Download before you go — everything works offline.</span></div>}
        {fests.map(([t, s, st, seed]) => (
          <div key={t} className="ux-card ts-fest">
            <Pattern seed={seed} a={seed % 2 ? '#7A1F2B' : '#2F6B4F'} className="ts-thumb" />
            <div className="ts-fest-body">
              <b>{t}</b><small className="ux-sub">{s}</small>
              {v1 ? (
                <span className="ux-link">View schedule <Icon n="chev" s={14} /></span>
              ) : st === 'now' ? (
                <span className="ux-row"><span className="ux-tag live">● Happening now</span><Off /></span>
              ) : (
                <span className="ux-link"><Icon n="download" s={16} /> Download · {st}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <TabBar tabs={v1 ? TABS_V1 : TABS} />
    </div>
  )
}

export function TsToday() {
  const next = [['11:30', 'Dance of the Stag and Hounds', 'Shawa Shachi · 45 min'], ['13:00', 'Atsara break', 'Masked jesters · lunch time'], ['14:30', 'Judgement of the Dead', 'Raksha Mangcham · 90 min'], ['16:30', 'Closing blessing', 'Whole courtyard']]
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-body">
        <div className="ux-row between"><div><p className="ux-sub">Paro Tshechu · Day 2</p><h1 className="ux-h1">Today</h1></div><Off /></div>
        <div className="ts-now ux-fill">
          <Pattern seed={5} className="ts-now-art" />
          <div className="ts-now-body">
            <span className="ts-livechip"><i /> Now dancing</span>
            <h2>Dance of the Black Hats</h2>
            <p>Zhana Cham · Main courtyard · 10:40 – 11:30</p>
            <div className="ts-prog"><i style={{ width: '62%' }} /></div>
            <span className="ts-now-cta">Read the story in 60 seconds <Icon n="chev" s={16} /></span>
          </div>
        </div>
        <div className="ts-tip"><Icon n="seat" /><span>During this dance, stay behind the seated rows — the dancers need the full circle.</span></div>
        <p className="ux-label">Next up</p>
        <ol className="ts-timeline">
          {next.map(([t, n, s], i) => (
            <li key={t}><time>{t}</time><i className={i === 0 ? 'on' : ''} /><span><b>{n}</b><small className="ux-sub">{s}</small></span>{i === 0 && <span className="ts-bell"><Icon n="bell" s={18} /></span>}</li>
          ))}
        </ol>
      </div>
      <TabBar tabs={TABS} />
    </div>
  )
}

export function TsTodayV1() {
  const rows = [['09:00', 'Pacham'], ['10:40', 'Zhana Cham'], ['11:30', 'Shawa Shachi'], ['13:00', 'Atsara'], ['14:30', 'Raksha Mangcham'], ['16:30', 'Blessing']]
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-top"><span /><b>Schedule</b><span /></div>
      <div className="ux-body">
        <h1 className="ux-h1">Paro Tshechu</h1>
        <div className="ux-seg wide"><i className="on">Day 1</i><i>Day 2</i><i>Day 3</i><i>Day 4</i></div>
        <table className="ts-table"><thead><tr><th>Time</th><th>Dance</th></tr></thead>
          <tbody>{rows.map(([t, d]) => <tr key={t}><td>{t}</td><td>{d}</td></tr>)}</tbody>
        </table>
        <p className="ux-note">Times may change. Tap a dance name to read about it.</p>
      </div>
      <TabBar tabs={TABS_V1} />
    </div>
  )
}

export function TsDance({ v1 }) {
  if (v1)
    return (
      <div className="ux ts">
        <Status />
        <div className="ux-top"><Icon n="back" /><b>Shawa Shachi</b><span /></div>
        <div className="ux-body">
          <h1 className="ux-h1">Shawa Shachi</h1>
          {[0, 1, 2, 3].map((k) => (
            <p key={k} className="ts-wall">
              The Shawa Shachi is performed on the second day of the festival and recounts the conversion of the hunter Gonpo Dorji by the great yogi Milarepa in the eleventh century. The hunter, pursuing a stag with his dogs, encounters the saint, who protects the animal and sings to the hunter about the suffering caused by killing, after which the hunter renounces hunting and becomes his disciple…
            </p>
          ))}
        </div>
      </div>
    )
  return (
    <div className="ux ts">
      <div className="ts-art"><Pattern seed={8} a="#2F6B4F" /><Status light /><div className="ux-top light"><Icon n="back" /><span /><Icon n="star" /></div></div>
      <div className="ux-body ts-sheet">
        <div><p className="ux-sub">Shawa Shachi · about 45 min</p><h1 className="ux-h1">Dance of the Stag and Hounds</h1></div>
        <div className="ux-row wrap"><span className="ts-ok"><Icon n="camera" s={16} /> Photos OK · no flash</span><span className="ts-ok warn"><Icon n="seat" s={16} /> Stay outside the circle</span></div>
        <p className="ux-label">The story in 60 seconds</p>
        <ol className="ts-beats">
          <li><b>1</b><span>A hunter, Gonpo Dorji, chases a stag with his hounds.</span></li>
          <li><b>2</b><span>The saint Milarepa protects the stag and sings to the hunter.</span></li>
          <li><b>3</b><span>Moved, the hunter gives up hunting and becomes his follower.</span></li>
        </ol>
        <div className="ux-card ts-watch"><Icon n="sparkle" /><span><b>Watch for</b> the hunter’s servant and the hounds — their clowning is meant to make you laugh.</span></div>
        <div className="ux-spacer" />
        <div className="ux-row gap"><div className="ux-btn ghost half"><Icon n="sound" /> Listen · 1:00</div><div className="ux-btn ux-fill half">Save to my day</div></div>
      </div>
    </div>
  )
}

export function TsEtiquette() {
  const items = [
    ['shirt', 'Dress', 'Long sleeves and modest clothes. A gho or kira is welcome.'],
    ['flash', 'Photos', 'No flash. Never step into the dance ground for a shot.'],
    ['seat', 'Seating', 'Leave the front rows for elders and monks.'],
    ['sparkle', 'Atsaras', 'Masked jesters may tease you — smile, it’s part of the blessing.'],
  ]
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-top"><Icon n="back" /><b>Before you go</b><span /></div>
      <div className="ux-body">
        <h1 className="ux-h1">4 things to know</h1>
        <p className="ux-p">Read once, then we’ll remind you on the right dance.</p>
        {items.map(([i, t, d], k) => (
          <div key={t} className="ux-card ts-et"><span className="ts-et-ic"><Icon n={i} /></span><span><b>{t}</b><small className="ux-sub">{d}</small></span><span className={`ux-check ${k < 2 ? 'on' : ''}`}><Icon n="check" s={16} w={3} /></span></div>
        ))}
        <div className="ux-spacer" />
        <div className="ux-btn ux-fill">Got it — show today’s dances</div>
      </div>
    </div>
  )
}

export function TsMap() {
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-top"><span /><b>Courtyard map</b><Icon n="info" /></div>
      <div className="ts-mapwrap">
        <svg viewBox="0 0 390 470" className="ux-fill" aria-hidden="true">
          <rect width="390" height="470" fill="#F3EADB" />
          <rect x="20" y="20" width="350" height="430" rx="18" fill="#E9DCC6" stroke="#C9B48F" strokeWidth="3" />
          <rect x="40" y="40" width="310" height="70" rx="10" fill="#7A1F2B" opacity=".9" />
          <text x="195" y="82" textAnchor="middle" fill="#FBF6EE" fontSize="15" fontWeight="700">Temple steps · monk orchestra</text>
          <ellipse cx="195" cy="240" rx="120" ry="95" fill="#FBF6EE" stroke="#E8A317" strokeWidth="4" strokeDasharray="10 8" />
          <text x="195" y="236" textAnchor="middle" fontSize="18" fontWeight="800" fill="#7A1F2B">Dance ground</text>
          <text x="195" y="258" textAnchor="middle" fontSize="12" fill="#6B5B4B">Keep clear</text>
          <rect x="40" y="350" width="140" height="60" rx="10" fill="#2F6B4F" opacity=".85" /><text x="110" y="385" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Seating</text>
          <rect x="210" y="350" width="140" height="60" rx="10" fill="#2F6B4F" opacity=".85" /><text x="280" y="385" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Seating</text>
          <rect x="30" y="150" width="34" height="170" rx="8" fill="#D9C7A6" /><rect x="326" y="150" width="34" height="170" rx="8" fill="#D9C7A6" />
          <g transform="translate(330 300)"><circle r="16" fill="#1F5EFF" opacity=".2" /><circle r="8" fill="#1F5EFF" stroke="#fff" strokeWidth="3" /></g>
          <text x="345" y="440" textAnchor="end" fontSize="12" fill="#6B5B4B">Main gate ↓</text>
        </svg>
      </div>
      <div className="ux-body tight">
        <div className="ts-legend">
          <span><i style={{ background: '#E8A317' }} />Dance ground</span><span><i style={{ background: '#2F6B4F' }} />Seating</span>
          <span><i style={{ background: '#7A1F2B' }} />Orchestra</span><span><i style={{ background: '#1F5EFF' }} />You are here</span>
        </div>
        <div className="ux-card ts-et"><span className="ts-et-ic"><Icon n="info" /></span><span><b>Toilets & water</b><small className="ux-sub">Outside the main gate, left · 2 min walk</small></span></div>
      </div>
      <TabBar tabs={TABS} active={2} />
    </div>
  )
}

export function TsMyDay() {
  return (
    <div className="ux ts">
      <Status />
      <div className="ux-body">
        <div className="ux-row between"><h1 className="ux-h1">My day</h1><Off /></div>
        <p className="ux-p">We’ll nudge you 10 minutes before each saved dance.</p>
        {[['11:30', 'Dance of the Stag and Hounds', true], ['14:30', 'Judgement of the Dead', true], ['16:30', 'Closing blessing', false]].map(([t, n, on]) => (
          <div key={t} className="ux-card ts-saved"><time>{t}</time><span><b>{n}</b><small className="ux-sub">Main courtyard</small></span><Toggle on={on} /></div>
        ))}
        <div className="ux-card ts-share"><Icon n="users" /><span><b>Guiding a group?</b><small className="ux-sub">Share this plan with your guests by QR — works without internet.</small></span></div>
      </div>
      <TabBar tabs={TABS} active={3} />
    </div>
  )
}

export function TsWeb() {
  const fests = [['Paro Tshechu', 'Rinpung Dzong', 1, '#7A1F2B'], ['Thimphu Tshechu', 'Tashichho Dzong', 2, '#2F6B4F'], ['Punakha Drubchen', 'Punakha Dzong', 3, '#7A1F2B'], ['Jambay Lhakhang Drup', 'Bumthang', 4, '#2F6B4F']]
  return (
    <div className="ux ts tsweb">
      <header className="w-nav">
        <b className="w-logo"><span className="ux-fill"><Icon n="sparkle" s={18} w={2.2} /></span>Tshechu</b>
        <nav className="w-links"><span className="on">Festivals</span><span>Dances</span><span>Etiquette</span><span>For guides</span></nav>
        <span className="ux-btn sm ux-fill w-cta">Get the app</span>
        <span className="w-burger"><Icon n="menu" /></span>
      </header>
      <section className="tsweb-hero">
        <div className="tsweb-copy">
          <p className="ux-label">Festival guide · works offline</p>
          <h1>Understand the dance, not just watch it.</h1>
          <p className="ux-p">Schedules, 60-second stories and etiquette for Bhutan’s festivals.</p>
          <div className="ux-input"><Icon n="search" /> Search a festival or dance</div>
        </div>
        <Pattern seed={9} className="tsweb-art" />
      </section>
      <section className="tsweb-sec">
        <h2 className="ux-h2">Upcoming festivals</h2>
        <div className="tsweb-grid">
          {fests.map(([t, s, seed, c]) => (
            <div key={t} className="ux-card tsweb-card"><Pattern seed={seed} a={c} className="tsweb-thumb" /><b>{t}</b><small className="ux-sub">{s}</small></div>
          ))}
        </div>
      </section>
    </div>
  )
}

export const tshechuScreens = {
  festivals: TsFestivals, festivalsV1: () => <TsFestivals v1 />, today: TsToday, todayV1: TsTodayV1,
  dance: TsDance, danceV1: () => <TsDance v1 />, etiquette: TsEtiquette, map: TsMap, myday: TsMyDay, web: TsWeb,
}
