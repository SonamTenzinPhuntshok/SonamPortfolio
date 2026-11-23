import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../data/profile'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Frame from '../components/Frame'
import { SCREENS } from '../screens'

// Pinned hero: the intro, then one statement that lands in a single beat.
function Hero() {
  const ref = useRef()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Every range spans 0 → 1: framer-motion may hand these to the browser's native
  // scroll timeline, which fills any gap in the keyframes with the element's base value.
  const o1 = useTransform(p, [0, 0.3, 0.45, 1], [1, 1, 0, 0])
  const y1 = useTransform(p, [0, 0.45, 1], ['0%', '-30%', '-30%'])
  const o2 = useTransform(p, [0, 0.4, 0.58, 1], [0, 0, 1, 1])
  const y2 = useTransform(p, [0, 0.4, 0.58, 1], ['24%', '24%', '0%', '0%'])
  const hint = useTransform(p, [0, 0.1, 1], [1, 0, 0])

  return (
    <section ref={ref} className="hero" aria-label="Introduction">
      <div className="hero-sticky">
        <motion.div className="hero-line" style={{ opacity: o1, y: y1 }}>
          <p className="eyebrow">{profile.title}</p>
          <h1 className="display">
            Hi, I’m <span className="grad">STee.</span>
          </h1>
          <p className="hero-sub">{profile.fullName} — designing from Thimphu, Bhutan.</p>
        </motion.div>
        <motion.div className="hero-line" style={{ opacity: o2, y: y2 }}>
          <h2 className="display hero-statement">
            I design <em>calm</em> interfaces for <span className="grad">messy</span> problems.
          </h2>
          <div className="hero-actions">
            <a href="#work" className="btn btn-primary">See my case studies ↓</a>
            <Link to="/resume" className="btn btn-ghost">Résumé</Link>
          </div>
        </motion.div>
        <motion.div className="scroll-hint" style={{ opacity: hint }} aria-hidden="true">
          <em className="tap-hint">Tap anywhere to send a wind horse ✦</em>
          <span>Scroll</span>
          <i />
        </motion.div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="section intro">
      <Reveal className="intro-photo">
        <TiltCard className="photo-card">
          <img src={profile.photos.hero} alt="Portrait of Sonam Tenzin Phuntshok (STee)" />
          <span className="photo-tag">That’s me 👋</span>
        </TiltCard>
      </Reveal>
      <div className="intro-copy">
        <Reveal as="p" className="eyebrow">About</Reveal>
        <Reveal as="h2" className="h2" delay={0.05}>
          Designer who speaks <span className="grad">AI &amp; data.</span>
        </Reveal>
        <Reveal as="p" className="lead" delay={0.1}>{profile.shortBio}</Reveal>
        <Reveal className="chips" delay={0.15}>
          <span className="chip">🎓 GCIT · CS (AI &amp; DS)</span>
          <span className="chip">📍 {profile.location}</span>
          <span className="chip">🧪 {caseStudies.length} case studies</span>
        </Reveal>
        <Reveal delay={0.2}>
          <Link to="/about" className="btn btn-ghost">More about me →</Link>
        </Reveal>
      </div>
    </section>
  )
}

function WorkCard({ c, i }) {
  const S = SCREENS[c.slug]
  const Web = S[c.cover.web]
  const Phone = S[c.cover.phone]
  const url = c.cover.web === 'desk' ? c.responsive.extra?.[0]?.url : c.responsive.url
  return (
    <Reveal className={`work-item ${i % 2 ? 'flip' : ''}`}>
      <Link to={`/work/${c.slug}`} className="work-link" aria-label={`${c.title} case study`}>
        <TiltCard className="work-visual" style={{ '--a': c.accent, '--a2': c.accent2 }}>
          <div className="work-glow" />
          <div className="work-devices">
            <div className="work-web"><Frame device="desktop" url={url}><Web /></Frame></div>
            <div className="work-phone"><Frame device="phone"><Phone /></Frame></div>
          </div>
        </TiltCard>
        <div className="work-copy">
          <span className="work-index" style={{ color: c.accent }}>{c.index}</span>
          <h3 className="h3">{c.title}</h3>
          <p className="work-tagline">{c.tagline}</p>
          <p className="muted">{c.summary}</p>
          <dl className="work-facts">
            <div><dt>Role</dt><dd>{c.role.split(' — ')[0]}</dd></div>
            <div><dt>Time</dt><dd>{c.duration}</dd></div>
            <div className="wide"><dt>Result</dt><dd>{c.results.metrics[0].before} → {c.results.metrics[0].after} <small>{c.results.metrics[0].label.toLowerCase()}</small></dd></div>
          </dl>
          <div className="chips">
            <span className="chip">{c.platform}</span>
          </div>
          <span className="arrow-link" style={{ color: c.accent }}>Read case study →</span>
        </div>
      </Link>
    </Reveal>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal as="p" className="eyebrow">Projects</Reveal>
      <Reveal as="h2" className="h2">Things I’ve <span className="grad">built.</span></Reveal>
      <div className="projects">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <TiltCard className="project" style={{ '--a': p.accent, '--a2': p.accent2 }}>
              <div className="project-glow" />
              <span className="project-kind">{p.kind}</span>
              <h3 className="project-title">{p.title}</h3>
              <p className="muted">{p.summary}</p>
              <div className="chips">{p.tech.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              {p.link ? (
                <a className="arrow-link" href={p.link} target="_blank" rel="noreferrer">View on GitLab ↗</a>
              ) : (
                <span className="muted small-note">Code available on request</span>
              )}
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const SKILL_ICONS = { 'UX & Design': '✏️', Build: '🛠️', 'AI & Data': '🧠' }

function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal as="p" className="eyebrow">Skills</Reveal>
      <Reveal as="h2" className="h2">What I bring <span className="grad">to the team.</span></Reveal>
      <div className="skills">
        {Object.entries(profile.skills).map(([group, items], i) => (
          <Reveal key={group} className="skill-group" delay={i * 0.08}>
            <span className="skill-icon" aria-hidden="true">{SKILL_ICONS[group] || '•'}</span>
            <strong>{group}</strong>
            <div className="chips">{items.map((x) => <span key={x} className="chip">{x}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  ['Empathise', 'Interviews, surveys, sitting with real users.'],
  ['Define', 'Personas and one sharp problem statement.'],
  ['Ideate', 'Sketches, sitemaps, user flows.'],
  ['Prototype', 'Wireframes → mockups → clickable Figma.'],
  ['Test', 'Watch people use it. Fix. Repeat.'],
]

function Process() {
  return (
    <section className="section">
      <Reveal as="p" className="eyebrow">How I work</Reveal>
      <Reveal as="h2" className="h2">A simple, repeatable process.</Reveal>
      <ol className="process">
        {STEPS.map(([t, d], i) => (
          <Reveal as="li" key={t} delay={i * 0.06} className="process-step">
            <span className="process-num">0{i + 1}</span>
            <strong>{t}</strong>
            <span className="muted">{d}</span>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

// Horizontal gallery driven by vertical scroll.
function Gallery() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-38%'])
  const shots = [
    [profile.photos.culture, 'In gho, at home in Bhutan'],
    [profile.photos.portrait, 'Studio portrait'],
    [profile.photos.stage, 'On stage'],
    [profile.photos.hero, 'Everyday me'],
  ]
  return (
    <section ref={ref} className="gallery" aria-label="Photos">
      <div className="gallery-sticky">
        <div className="gallery-head">
          <p className="eyebrow">Beyond the screen</p>
          <h2 className="h2">The person behind <span className="grad">the pixels.</span></h2>
        </div>
        <motion.div className="gallery-track" style={{ x }}>
          {shots.map(([src, alt], i) => (
            <figure key={src} className={`gallery-shot shot-${i}`}>
              <img src={src} alt={alt} loading="lazy" />
              <figcaption>{alt}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 350)
    return () => clearTimeout(t)
  }, [hash])
  return (
    <>
      <Hero />
      <Intro />
      <section id="work" className="section work">
        <Reveal as="p" className="eyebrow">UX case studies</Reveal>
        <Reveal as="h2" className="h2">Three problems, <span className="grad">three case studies.</span></Reveal>
        {caseStudies.map((c, i) => (
          <WorkCard key={c.slug} c={c} i={i} />
        ))}
      </section>
      <Projects />
      <Skills />
      <Process />
      <Gallery />
    </>
  )
}
