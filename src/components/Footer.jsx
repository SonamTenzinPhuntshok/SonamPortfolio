import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import Reveal from './Reveal'

// Contact information — present on every page.
export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <Reveal className="footer-inner">
        <p className="eyebrow">Contact</p>
        <h2 className="footer-title">
          Got a messy problem?<br />
          <span className="grad">Let’s make it simple.</span>
        </h2>
        <p className="muted footer-sub">
          Open to internships, design collaborations and student projects. The fastest way to reach me is LinkedIn.
        </p>
        <div className="footer-actions">
          {profile.email && (
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
          )}
          <a className="btn btn-primary" href={profile.socials[0].url} target="_blank" rel="noreferrer">Message me on LinkedIn ↗</a>
          <Link className="btn btn-ghost" to="/resume">View résumé</Link>
        </div>
        <ul className="socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer">
                <span className="social-short">{s.short}</span>
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span>{profile.location}</span>
        <button className="linklike" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
      </div>
    </footer>
  )
}
