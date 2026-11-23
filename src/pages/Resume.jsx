import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { caseStudies } from '../data/caseStudies'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'

const clean = (u) => u.replace(/^https?:\/\/(www\.)?/, '')

// The CV. This page is also what the downloadable PDF is printed from.
export function CVSheet() {
  return (
    <article className="cv" aria-label="Curriculum vitae">
      <header className="cv-head">
        <img src={profile.photos.cv} alt="" className="cv-photo" />
        <div>
          <h1>{profile.fullName}</h1>
          <p className="cv-title">{profile.title}</p>
          <ul className="cv-contact">
            <li>{profile.location}</li>
            {profile.email && <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>}
            {profile.socials.slice(0, 2).map((s) => (
              <li key={s.label}><a href={s.url}>{clean(s.url).replace(/\?.*$/, '')}</a></li>
            ))}
          </ul>
        </div>
      </header>

      <div className="cv-grid">
        <div className="cv-main">
          <section>
            <h2>Profile</h2>
            <p>{profile.cvSummary}</p>
          </section>

          <section>
            <h2>UX case studies</h2>
            <p className="cv-tools cv-note">End-to-end process for each: research, personas, information architecture, wireframes, usability testing and a Figma prototype.</p>
            {caseStudies.map((c) => (
              <div key={c.slug} className="cv-item">
                <div className="cv-item-head">
                  <strong>{c.title}</strong>
                  <span>{c.platform}</span>
                </div>
                <p>{c.summary}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>Projects</h2>
            {projects.map((p) => (
              <div key={p.slug} className="cv-item">
                <div className="cv-item-head">
                  <strong>{p.title}</strong>
                  <span>{p.kind}</span>
                </div>
                <p>{p.summary}</p>
                <p className="cv-tools">{p.tech.join(' · ')}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="cv-side">
          <section>
            <h2>Education</h2>
            {profile.education.map((e) => (
              <div key={e.school} className="cv-item">
                <strong>{e.school}</strong>
                <p>{e.degree}</p>
                <small>{[e.place, e.period].filter(Boolean).join(' · ')}</small>
              </div>
            ))}
          </section>

          <section>
            <h2>Skills</h2>
            {Object.entries(profile.skills).map(([g, items]) => (
              <div key={g} className="cv-skill">
                <strong>{g}</strong>
                <p>{items.join(', ')}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>Online</h2>
            <ul className="cv-links">
              {profile.socials.map((s) => (
                <li key={s.label}><strong>{s.label}</strong> <a href={s.url}>{clean(s.url).replace(/\?.*$/, '')}</a></li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  )
}

export default function Resume() {
  return (
    <div className="page resume-page">
      <section className="section resume-top">
        <Reveal>
          <p className="eyebrow">Résumé</p>
          <h1 className="h2">The one-page <span className="grad">version.</span></h1>
        </Reveal>
        <Reveal className="footer-actions" delay={0.1}>
          <a className="btn btn-primary" href={profile.resumePdf} download>Download PDF ↓</a>
          <button className="btn btn-ghost" onClick={() => window.print()}>Print</button>
          <Link className="btn btn-ghost" to="/#work">See case studies</Link>
        </Reveal>
      </section>
      <Reveal className="cv-wrap" delay={0.15}>
        <CVSheet />
      </Reveal>
    </div>
  )
}
