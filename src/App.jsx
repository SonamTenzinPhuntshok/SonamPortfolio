import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Splash from './components/Splash'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import SceneCaption from './components/SceneCaption'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'
import Resume from './pages/Resume'
import NotFound from './pages/NotFound'
import { scrollStore, refreshScroll } from './three/scrollStore'
import { getCase } from './data/caseStudies'

const Scene = lazy(() => import('./three/Scene'))

function useSceneSync(pathname) {
  useEffect(() => {
    const slug = pathname.startsWith('/work/') ? pathname.split('/')[2] : null
    const cs = slug && getCase(slug)
    scrollStore.path = pathname
    scrollStore.route = pathname === '/' ? 'home' : 'page'
    document.body.dataset.route = scrollStore.route
    scrollStore.accent = cs ? cs.accent : '#FFB020'
    scrollStore.accent2 = cs ? cs.accent2 : '#FF5A1F'
    window.scrollTo(0, 0)
    requestAnimationFrame(refreshScroll)
  }, [pathname])
}

export default function App() {
  const location = useLocation()
  const [entered, setEntered] = useState(() => {
    try {
      return sessionStorage.getItem('stee-entered') === '1'
    } catch {
      return false
    }
  })
  useSceneSync(location.pathname)

  const enter = () => {
    try {
      sessionStorage.setItem('stee-entered', '1')
    } catch {}
    setEntered(true)
  }

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <div className="scene-veil" aria-hidden="true" />
      <AnimatePresence>{!entered && <Splash key="splash" onEnter={enter} />}</AnimatePresence>
      <ScrollProgress />
      <SceneCaption />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          id="main"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </motion.main>
      </AnimatePresence>
    </>
  )
}
