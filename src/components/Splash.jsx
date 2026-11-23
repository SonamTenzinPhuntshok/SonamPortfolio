import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { LogoMark } from './Logo'

// Splash / welcome screen — first thing a visitor sees.
export default function Splash({ onEnter }) {
  const [count, setCount] = useState(0)
  const ready = count >= 100
  const btn = useRef()

  // Time-based count, so a busy main thread can't stall the splash.
  useEffect(() => {
    const start = performance.now()
    const DURATION = 1800
    const id = setInterval(() => {
      const n = Math.min(100, Math.round(((performance.now() - start) / DURATION) * 100))
      setCount(n)
      if (n >= 100) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  // focus the button when ready so Enter / Space works from the keyboard
  useEffect(() => {
    if (ready) btn.current?.focus({ preventScroll: true })
  }, [ready])

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      role="dialog"
      aria-label="Welcome"
    >
      <div className="splash-top">
        <span>{profile.fullName}</span>
        <span>Portfolio · {new Date().getFullYear()}</span>
      </div>

      <div className="splash-center">
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.8 } }}>
          <LogoMark size={64} />
        </motion.div>
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
          Kuzuzangpo la — welcome to the
        </motion.p>
        <h1 className="splash-logo" aria-label={profile.universe}>
          {profile.universe.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: '110%' }}
              animate={{ y: 0, transition: { delay: 0.15 + i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
              className={i < 4 ? 'grad' : ''}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.button
          ref={btn}
          className="btn btn-primary"
          onClick={onEnter}
          disabled={!ready}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: ready ? 1 : 0.25, y: 0 }}
        >
          {ready ? 'Enter →' : 'Loading…'}
        </motion.button>
      </div>

      <div className="splash-bottom">
        <span className="mono">UX · AI · Data</span>
        <span className="splash-count" aria-live="polite">{String(count).padStart(3, '0')}</span>
      </div>
      <div className="splash-bar" style={{ transform: `scaleX(${count / 100})` }} />
    </motion.div>
  )
}
