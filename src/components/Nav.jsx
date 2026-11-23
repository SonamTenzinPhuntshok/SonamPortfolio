import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import Logo from './Logo'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const goContact = (e) => {
    e.preventDefault()
    setOpen(false)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`nav ${scrolled ? 'nav-solid' : ''}`}>
      <a href="#main" className="skip">Skip to content</a>
      <Link to="/" className="logo" aria-label={`${profile.brand} — home`}>
        <Logo />
      </Link>
      <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
        <span />
        <span />
        <span className="sr-only">Menu</span>
      </button>
      <nav id="nav-links" className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
        <NavLink to="/#work" className={() => (pathname === '/' || pathname.startsWith('/work') ? 'active' : '')}>Work</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/resume">Resume</NavLink>
        <a href="#contact" onClick={goContact} className="nav-cta">Contact</a>
      </nav>
    </header>
  )
}
