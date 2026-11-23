import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { caseStudies, getCase } from '../data/caseStudies'
import { SCREENS } from '../screens'
import Reveal from '../components/Reveal'
import Frame from '../components/Frame'
import Carousel from '../components/Carousel'
import Crazy8 from '../components/Sketch'
import NotFound from './NotFound'

const SECTIONS = [
  ['overview', 'Overview'],
  ['research', 'Research'],
  ['define', 'Define'],
  ['ideate', 'Ideate'],
  ['architecture', 'Architecture'],
  ['wireframes', 'Wireframes'],
  ['testing', 'Usability testing'],
  ['iterations', 'Iterations'],
  ['system', 'Design system'],
  ['mockups', 'Hi-fi mockups'],
  ['responsive', 'Responsive'],
  ['prototype', 'Prototype'],
  ['results', 'Results'],
  ['reflection', 'Reflection'],
]

// WCAG contrast ratio between two hex colours.
const lum = (hex) => {
  const v = hex.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
const FEEL = ['', '😣', '😟', '😐', '🙂', '😄']

function Block({ id, n, title, kicker, children }) {
  return (
    <section id={id} className="cs-block">
      <Reveal className="cs-label">
        <span className="cs-n">{n}</span>
        <div>
          <h2>{title}</h2>
          {kicker && <p className="cs-kicker">{kicker}</p>}
        </div>
      </Reveal>
      <div className="cs-body">{children}</div>
    </section>
  )
}

function useActiveSection() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    )
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return active
}

const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

function SideIndex({ active }) {
  return (
    <nav className="cs-index" aria-label="Case study sections">
      {SECTIONS.map(([id, t], k) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} onClick={jump(id)} aria-current={active === id ? 'true' : undefined}>
          <span>{String(k + 1).padStart(2, '0')}</span>{t}
        </a>
      ))}
    </nav>
  )
}

// Phone/tablet: sticky, swipeable chip bar that follows your reading position.
function ChipIndex({ active }) {
  const bar = useRef(null)
  useEffect(() => {
    const el = bar.current?.querySelector('.on')
    if (el) bar.current.scrollTo({ left: el.offsetLeft - bar.current.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [active])
  const k = SECTIONS.findIndex(([id]) => id === active)
  return (
    <nav className="cs-chips" aria-label="Case study sections">
      <div className="cs-chips-prog"><i style={{ width: `${((k + 1) / SECTIONS.length) * 100}%` }} /></div>
      <div ref={bar} className="cs-chips-track">
        {SECTIONS.map(([id, t], i) => (
          <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} onClick={jump(id)}>{i + 1}. {t}</a>
        ))}
      </div>
    </nav>
  )
}

function Prototype({ c, S }) {
  const [i, setI] = useState(0)
  const steps = c.prototypeFlow
  const Cur = S[steps[i][1]]
  return (
    <div className="proto">
      <div className="proto-phone">
        <button type="button" className="proto-tap" onClick={() => setI((i + 1) % steps.length)} aria-label={`Prototype step ${i + 1}: ${steps[i][0]}. Tap for next step.`}>
          <Frame device="phone" label={steps[i][0]}><Cur /></Frame>
          <span className="proto-hint">Tap to continue →</span>
        </button>
      </div>
      <div className="proto-side">
        <p className="lead small">Try the main flow right here, or open the full Figma prototype.</p>
        <ol className="proto-steps">
          {steps.map(([t], k) => (
            <li key={t}><button type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)}><span>{k + 1}</span>{t}</button></li>
          ))}
        </ol>
        <div className="footer-actions">
          {c.prototype ? (
            <a className="btn btn-primary" href={c.prototype} target="_blank" rel="noreferrer">Open Figma prototype ↗</a>
          ) : (
            <span className="btn btn-disabled" title="Add the Figma link in src/data/caseStudies.js">Figma link — add before sharing</span>
          )}
        </div>
      </div>
    </div>
  )
}

function Responsive({ c, S }) {
  const r = c.responsive
  const Web = S[r.screen]
  const stage = (
    <div className="resp-stage" aria-label="The same page at three screen sizes">
      {r.breakpoints.map((b) => (
        <figure key={b.device} className={`resp-${b.device}`}>
          <Frame device={b.device === 'phone' ? 'phone' : b.device} url={r.url} label={b.label}><Web /></Frame>
          <figcaption><strong>{b.label}</strong>{b.note}</figcaption>
        </figure>
      ))}
    </div>
  )
  const slides = r.breakpoints.map((b) => ({ key: b.device, device: b.device, Screen: Web, title: b.label, note: b.note, url: r.url }))
  return (
    <>
      <Reveal className="resp-desk">{stage}</Reveal>
      <div className="resp-mob">
        {slides.map((it) => (
          <Reveal key={it.key} as="figure" className={`resp-item resp-item-${it.device}`}>
            <div className="resp-item-dev"><Frame device={it.device} url={it.url} label={it.title}><Web /></Frame></div>
            <figcaption><strong>{it.title}</strong>{it.note}</figcaption>
          </Reveal>
        ))}
      </div>
      {r.extra && (
        <Reveal className="resp-extra">
          <Carousel items={r.extra.map((x) => ({ ...x, key: x.screen, Screen: S[x.screen] }))} per={[1, 1, 1]} label="Extra screens" />
        </Reveal>
      )}
    </>
  )
}

function Matrix({ ideas }) {
  return (
    <div className="matrix" role="img" aria-label="Impact versus effort matrix of the eight ideas">
      <span className="mx-y">Impact ↑</span>
      <span className="mx-x">Effort →</span>
      <span className="mx-q q1">Quick wins</span>
      <span className="mx-q q2">Big bets</span>
      <span className="mx-q q3">Maybe later</span>
      <span className="mx-q q4">Avoid</span>
      {ideas.map((d, k) => (
        <span key={d.title} className={`mx-dot ${d.pick ? 'pick' : ''}`} style={{ left: `${8 + d.effort * 84}%`, bottom: `${6 + d.impact * 80}%` }}>
          <i>{k + 1}</i><em>{d.title}</em>
        </span>
      ))}
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const c = getCase(slug)
  const active = useActiveSection()
  if (!c) return <NotFound />
  const S = SCREENS[c.slug]
  const i = caseStudies.indexOf(c)
  const next = caseStudies[(i + 1) % caseStudies.length]
  const prev = caseStudies[(i + caseStudies.length - 1) % caseStudies.length]
  const CoverPhone = S[c.cover.phone]
  const CoverWeb = S[c.cover.web]
  const coverUrl = c.cover.web === 'desk' ? c.responsive.extra?.[0]?.url : c.responsive.url
  const n = (id) => String(SECTIONS.findIndex(([x]) => x === id) + 1).padStart(2, '0')
  const slides = (list, extra = {}) => list.map((m) => ({ key: m.screen, Screen: S[m.screen], device: 'phone', title: m.title, note: m.note, ...extra }))

  return (
    <article className="cs" style={{ '--a': c.accent, '--a2': c.accent2 }}>
      <header className="cs-hero">
        <Reveal>
          <Link to="/#work" className="back-link">← All case studies</Link>
          <p className="eyebrow" style={{ color: c.accent }}>Case study {c.index} of {String(caseStudies.length).padStart(2, '0')}</p>
          <h1 className="display cs-title">{c.title}</h1>
          <p className="cs-tagline">{c.tagline}</p>
        </Reveal>
        <Reveal className="cs-meta" delay={0.1}>
          <div><span>My role</span><strong>{c.role}</strong></div>
          <div><span>Team</span><strong>{c.team}</strong></div>
          <div><span>Timeline</span><strong>{c.duration}</strong></div>
          <div><span>Platform</span><strong>{c.platform}</strong></div>
          <div className="wide"><span>Tools</span><strong>{c.tools.join(' · ')}</strong></div>
        </Reveal>
        <Reveal className="cs-cover" delay={0.15}>
          <div className="cs-cover-web"><Frame device="desktop" url={coverUrl}><CoverWeb /></Frame></div>
          <div className="cs-cover-phone"><Frame device="phone"><CoverPhone /></Frame></div>
        </Reveal>
        <Reveal className="tldr" delay={0.1}>
          {[['Problem', c.tldr.problem], ['Solution', c.tldr.solution], ['Outcome', c.tldr.outcome]].map(([k, v]) => (
            <div key={k}><span>{k}</span><p>{v}</p></div>
          ))}
        </Reveal>
      </header>

      <ChipIndex active={active} />

      <div className="cs-layout">
        <SideIndex active={active} />
        <div className="cs-content">
          {/* 01 OVERVIEW */}
          <Block id="overview" n={n('overview')} title="Overview" kicker="The problem, the goal, and what success looks like.">
            <Reveal as="p" className="lead">{c.overview.goal}</Reveal>
            <Reveal className="callout"><span>The problem</span><p>{c.overview.problem}</p></Reveal>
            <div className="grid3">
              {[['What I did', c.overview.responsibilities], ['Constraints', c.overview.constraints], ['Success criteria', c.overview.success]].map(([t, l], k) => (
                <Reveal key={t} className="panel" delay={k * 0.06}>
                  <span className="panel-t">{t}</span>
                  <ul className="tick">{l.map((x) => <li key={x}>{x}</li>)}</ul>
                </Reveal>
              ))}
            </div>
          </Block>

          {/* 02 RESEARCH */}
          <Block id="research" n={n('research')} title="Research" kicker="Understanding real people before designing anything.">
            <Reveal className="panel">
              <span className="panel-t">Research questions</span>
              <ol className="qlist">{c.research.questions.map((q) => <li key={q}>{q}</li>)}</ol>
            </Reveal>
            <h3 className="sub-h">Methods</h3>
            <div className="grid3">
              {c.research.methods.map((m, k) => (
                <Reveal key={m.name} className="panel method" delay={k * 0.06}>
                  <b className="method-n">{m.n}</b>
                  <strong>{m.name}</strong>
                  <p className="muted">{m.detail}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-h">Competitive audit</h3>
            <div className="grid3">
              {c.research.competitors.map((x, k) => (
                <Reveal key={x.name} className="panel comp" delay={k * 0.06}>
                  <strong>{x.name}</strong>
                  <p><span className="pos">✓</span>{x.good}</p>
                  <p><span className="neg">✕</span>{x.gap}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-h">Affinity map</h3>
            <Reveal as="p" className="muted">I wrote every observation on a sticky note in FigJam and grouped them into themes.</Reveal>
            <div className="affinity">
              {c.research.affinity.map((g, k) => (
                <Reveal key={g.title} className={`aff aff-${k}`} delay={k * 0.05}>
                  <strong>{g.title}</strong>
                  {g.notes.map((t) => <span key={t} className="sticky">{t}</span>)}
                </Reveal>
              ))}
            </div>
            <h3 className="sub-h">Key insights</h3>
            <ol className="insights">
              {c.research.insights.map((t, k) => (
                <Reveal as="li" key={t.text} delay={k * 0.06}><span>Insight {k + 1}</span>{t.text}<small>{t.evidence}</small></Reveal>
              ))}
            </ol>
          </Block>

          {/* 03 DEFINE */}
          <Block id="define" n={n('define')} title="Define" kicker="Turning research into people, a journey and one clear problem.">
            <h3 className="sub-h first">Personas</h3>
            <div className="personas">
              {c.personas.map((p, k) => (
                <Reveal key={p.name} className="persona" delay={k * 0.08}>
                  <div className="persona-head">
                    <span className="avatar" aria-hidden="true">{p.name[0]}</span>
                    <div><strong>{p.name}</strong><small>{p.tag}</small></div>
                  </div>
                  <p className="persona-quote">{p.quote}</p>
                  <p className="persona-bio">{p.bio}</p>
                  <div className="persona-cols">
                    <div><span>Goals</span><ul>{p.goals.map((x) => <li key={x}>{x}</li>)}</ul></div>
                    <div><span>Frustrations</span><ul>{p.pains.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  </div>
                  <p className="persona-tech"><span>Tech</span>{p.tech}</p>
                </Reveal>
              ))}
            </div>
            <h3 className="sub-h">User journey map · {c.journey.persona}</h3>
            <Reveal className="journey">
              <svg className="journey-curve" viewBox="0 0 500 60" preserveAspectRatio="none" aria-hidden="true">
                <polyline points={c.journey.stages.map((s, k) => `${50 + k * 100},${60 - s.feel * 10}`).join(' ')} fill="none" stroke="var(--a)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>
              {c.journey.stages.map((s, k) => (
                <div key={s.stage} className="j-col">
                  <span className="j-step">{k + 1}</span>
                  <strong>{s.stage}</strong>
                  <span className="j-feel" aria-label={`Feeling ${s.feel} of 5`}>{FEEL[s.feel]}</span>
                  <p>{s.doing}</p>
                  <p className="j-opp"><span>Opportunity</span>{s.opp}</p>
                </div>
              ))}
            </Reveal>
            <h3 className="sub-h">Problem statement</h3>
            <Reveal as="blockquote" className="pstate">{c.problemStatement}</Reveal>
            <h3 className="sub-h">How might we…</h3>
            <div className="grid3">
              {c.hmw.map((h, k) => <Reveal key={h} className="panel hmw" delay={k * 0.06}><span>HMW {k + 1}</span>{h}</Reveal>)}
            </div>
          </Block>

          {/* 04 IDEATE */}
          <Block id="ideate" n={n('ideate')} title="Ideate" kicker={c.ideation.method}>
            <Reveal><Crazy8 ideas={c.ideation.ideas} /></Reveal>
            <Reveal as="p" className="caption">Crazy 8s · paper sketches</Reveal>
            <div className="ideate-split">
              <Reveal><Matrix ideas={c.ideation.ideas} /></Reveal>
              <Reveal className="callout"><span>Decision & rationale</span><p>{c.ideation.decision}</p></Reveal>
            </div>
          </Block>

          {/* 05 ARCHITECTURE */}
          <Block id="architecture" n={n('architecture')} title="Information architecture" kicker="Where everything lives, and the shortest path through it.">
            <Reveal className="sitemap" aria-label="Sitemap">
              <div className="sitemap-root">{c.architecture.sitemap.root}</div>
              <div className="sitemap-children">
                {c.architecture.sitemap.children.map((x) => (
                  <div key={x.name} className="sitemap-col">
                    <div className="sitemap-node">{x.name}</div>
                    {x.items.map((y) => <div key={y} className="sitemap-leaf">{y}</div>)}
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal as="p" className="caption">Sitemap</Reveal>
            <Reveal className="flow" aria-label="Core user flow">
              {c.architecture.flow.map((s, k) => <div key={s} className="flow-step"><span>{k + 1}</span>{s}</div>)}
            </Reveal>
            <Reveal as="p" className="caption">Core user flow</Reveal>
            <Reveal as="p" className="muted para">{c.architecture.flowNote}</Reveal>
          </Block>

          {/* 06 WIREFRAMES */}
          <Block id="wireframes" n={n('wireframes')} title="Wireframes" kicker="Structure before style — tap any screen to see it full size.">
            <Reveal as="p" className="para">{c.wireframes.intro}</Reveal>
            <Carousel items={slides(c.wireframes.screens, { wire: true })} label="Digital wireframes" />
          </Block>

          {/* 07 TESTING */}
          <Block id="testing" n={n('testing')} title="Usability testing" kicker="Two rounds: test, change, test again.">
            <div className="grid2">
              <Reveal className="panel"><span className="panel-t">Method</span><p>{c.testing.method}</p></Reveal>
              <Reveal className="panel" delay={0.06}><span className="panel-t">Participants</span><p>{c.testing.participants}</p></Reveal>
            </div>
            <h3 className="sub-h">Task results · Round 1 vs Round 2</h3>
            <div className="tasks">
              {c.testing.tasks.map((t, k) => (
                <Reveal key={t.task} className="task" delay={k * 0.06}>
                  <strong>Task {k + 1}: {t.task}</strong>
                  <div className="bar r1"><span>R1</span><i style={{ width: `${t.r1}%` }} /><b>{t.r1}% · {t.t1}s</b></div>
                  <div className="bar r2"><span>R2</span><i style={{ width: `${t.r2}%` }} /><b>{t.r2}% · {t.t2}s</b></div>
                </Reveal>
              ))}
              <p className="muted legend-note">Bar = task success rate · seconds = average time on task</p>
            </div>
            <h3 className="sub-h">What we found</h3>
            <div className="findings">
              {c.testing.findings.map((f, k) => (
                <Reveal key={k} className="finding" delay={k * 0.05}>
                  <span className={`sev sev-${f.sev.toLowerCase()}`}>{f.sev}</span>
                  <div>
                    <strong>{f.finding}</strong>
                    <p className="muted">{f.evidence}</p>
                  </div>
                  <div className="fix"><span>Change</span>{f.fix}</div>
                </Reveal>
              ))}
            </div>
          </Block>

          {/* 08 ITERATIONS */}
          <Block id="iterations" n={n('iterations')} title="Iterations" kicker="Before and after, with the reason behind each change.">
            {c.iterations.map((it, k) => (
              <Reveal key={it.title} className="iter">
                <div className="iter-head"><span>Change {k + 1}</span><h3>{it.title}</h3><p>{it.why}</p></div>
                <Carousel
                  per={[2, 2, 1]}
                  size="sm"
                  label={it.title}
                  items={[
                    { key: 'b', Screen: S[it.before], title: 'Before · Round 1 design' },
                    { key: 'a', Screen: S[it.after], title: 'After · Round 2 design' },
                  ]}
                />
              </Reveal>
            ))}
          </Block>

          {/* 09 DESIGN SYSTEM */}
          <Block id="system" n={n('system')} title="Design system" kicker="A small set of styles and components, built for accessibility.">
            <h3 className="sub-h first">Colour · with WCAG contrast</h3>
            <div className="swatches">
              {c.designSystem.colors.map((col) => {
                const r = contrast(col.hex, col.on)
                return (
                  <Reveal key={col.name} className="swatch">
                    <div className="swatch-chip" style={{ background: col.hex, color: col.on }}>Aa</div>
                    <strong>{col.name}</strong>
                    <span className="mono">{col.hex}</span>
                    <small className="muted">{col.role}</small>
                    <span className={`aa ${r >= 4.5 ? 'pass' : 'fail'}`}>{r.toFixed(1)}:1 · {r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'AA large'}</span>
                  </Reveal>
                )
              })}
            </div>
            <div className="grid2">
              <Reveal className="panel">
                <span className="panel-t">Type scale</span>
                {c.designSystem.type.map(([r, spec]) => <div key={r} className="type-row"><span>{r}</span><b>{spec}</b></div>)}
              </Reveal>
              <Reveal className="panel" delay={0.06}>
                <span className="panel-t">Components</span>
                <div className="chips">{c.designSystem.components.map((x) => <span key={x} className="chip">{x}</span>)}</div>
                <span className="panel-t">Accessibility decisions</span>
                <ul className="tick">{c.designSystem.a11y.map((x) => <li key={x}>{x}</li>)}</ul>
              </Reveal>
            </div>
          </Block>

          {/* 10 MOCKUPS */}
          <Block id="mockups" n={n('mockups')} title="High-fidelity mockups" kicker="Final mobile screens — each with the reason behind it.">
            <Carousel items={slides(c.mockups)} label="High-fidelity mobile mockups" />
          </Block>

          {/* 11 RESPONSIVE */}
          <Block id="responsive" n={n('responsive')} title="Responsive design" kicker="One design that adapts from laptop to phone.">
            <Reveal as="p" className="para">{c.responsive.intro}</Reveal>
            <Responsive c={c} S={S} />
          </Block>

          {/* 12 PROTOTYPE */}
          <Block id="prototype" n={n('prototype')} title="Prototype" kicker="Clickable — tap the phone to walk the main flow.">
            <Reveal><Prototype c={c} S={S} /></Reveal>
          </Block>

          {/* 13 RESULTS */}
          <Block id="results" n={n('results')} title="Results & impact" kicker="Round 1 compared with Round 2.">
            <div className="metrics">
              {c.results.metrics.map((m, k) => (
                <Reveal key={m.label} className="metric" delay={k * 0.06}>
                  <span>{m.label}</span>
                  <div><s>{m.before}</s><b>{m.after}</b></div>
                </Reveal>
              ))}
            </div>
            <ul className="results">{c.results.outcomes.map((r, k) => <Reveal as="li" key={r} delay={k * 0.05}>{r}</Reveal>)}</ul>
            <Reveal as="blockquote" className="pull">“{c.results.quote.text.replace(/[“”]/g, '')}”<cite>— {c.results.quote.who}</cite></Reveal>
          </Block>

          {/* 14 REFLECTION */}
          <Block id="reflection" n={n('reflection')} title="Reflection" kicker="What I learned and what I’d do next.">
            <div className="grid2">
              <Reveal className="panel"><span className="panel-t">What I learned</span><ul className="tick">{c.reflection.learned.map((x) => <li key={x}>{x}</li>)}</ul></Reveal>
              <Reveal className="panel" delay={0.06}><span className="panel-t">Next steps</span><ul className="tick arrow">{c.reflection.next.map((x) => <li key={x}>{x}</li>)}</ul></Reveal>
            </div>
          </Block>
        </div>
      </div>

      <nav className="case-nav" aria-label="More case studies">
        <Link to={`/work/${prev.slug}`} className="case-nav-prev" style={{ '--a': prev.accent }}>
          <span className="eyebrow">← Previous</span><strong className="display">{prev.title}</strong>
        </Link>
        <Link to={`/work/${next.slug}`} className="case-nav-next" style={{ '--a': next.accent }}>
          <span className="eyebrow">Next case study →</span><strong className="display">{next.title}</strong>
        </Link>
      </nav>
    </article>
  )
}
