import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

export default function About() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div>
          <Reveal as="p" className="eyebrow">About</Reveal>
          <Reveal as="h1" className="display">Sonam Tenzin <span className="grad">Phuntshok</span></Reveal>
          <Reveal as="p" className="lead" delay={0.05}>Most people call me <strong>STee</strong>.</Reveal>
          {profile.longBio.map((p, i) => (
            <Reveal as="p" key={i} className="muted para" delay={0.08 + i * 0.04}>{p}</Reveal>
          ))}
          <Reveal className="footer-actions" delay={0.2}>
            <Link to="/resume" className="btn btn-primary">View résumé</Link>
            <a href={profile.socials[1].url} target="_blank" rel="noreferrer" className="btn btn-ghost">GitLab ↗</a>
          </Reveal>
        </div>
        <Reveal className="about-photos" delay={0.1}>
          <TiltCard className="photo-card tall"><img src={profile.photos.culture} alt="STee in gho" /></TiltCard>
          <TiltCard className="photo-card"><img src={profile.photos.portrait} alt="STee, studio portrait" /></TiltCard>
        </Reveal>
      </section>

      <section className="section">
        <Reveal as="p" className="eyebrow">Education</Reveal>
        <div className="timeline">
          {profile.education.map((e, i) => (
            <Reveal key={e.school} className="timeline-item" delay={i * 0.08}>
              <span className="timeline-dot" />
              <strong>{e.school}</strong>
              <span>{e.degree}</span>
              <small className="muted">{[e.place, e.period].filter(Boolean).join(' · ')}</small>
            </Reveal>
          ))}
        </div>
      </section>

    </div>
  )
}
