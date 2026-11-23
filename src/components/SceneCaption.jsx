import { useEffect, useRef } from 'react'
import { SCENES, sceneTarget } from '../three/sceneConfig'

// Small caption naming the landmark currently in the background.
export default function SceneCaption() {
  const ref = useRef()
  useEffect(() => {
    let raf
    let last = ''
    const tick = () => {
      const { a, b, t } = sceneTarget()
      const name = SCENES[t < 0.5 ? a : b].name
      if (name !== last && ref.current) {
        last = name
        ref.current.classList.remove('show')
        void ref.current.offsetWidth
        ref.current.querySelector('span').textContent = name
        ref.current.classList.add('show')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div ref={ref} className="scene-caption" aria-hidden="true">
      <i /> <span /> · by night
    </div>
  )
}
