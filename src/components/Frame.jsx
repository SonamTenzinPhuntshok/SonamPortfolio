import { useLayoutEffect, useRef, useState } from 'react'

// Renders a screen at its real size (like a Figma frame) and scales it to
// fit the available width, so designs stay sharp on laptop and phone.
export const DEVICES = {
  phone: { w: 390, h: 844, bezel: 12, bar: 0, radius: 54 },
  tablet: { w: 834, h: 1112, bezel: 20, bar: 0, radius: 44 },
  desktop: { w: 1440, h: 900, bezel: 0, bar: 40, radius: 14 },
}

export default function Frame({ device = 'phone', url, wire, children, label, scale: fixed }) {
  const d = DEVICES[device]
  const W = d.w + d.bezel * 2
  const H = d.h + d.bezel * 2 + d.bar
  const ref = useRef(null)
  const [s, setS] = useState(fixed || 0)

  useLayoutEffect(() => {
    if (fixed) return
    const el = ref.current
    const set = () => setS(el.clientWidth / W)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [W, fixed])

  return (
    <div
      ref={ref}
      className={`frame frame-${device} ${wire ? 'frame-wire' : ''}`}
      style={fixed ? { width: W * fixed, height: H * fixed } : { aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label={label}
    >
      <div
        className="frame-inner"
        aria-hidden="true"
        style={{ width: W, height: H, padding: d.bezel, borderRadius: d.radius, transform: `scale(${s})`, visibility: s ? 'visible' : 'hidden' }}
      >
        {d.bar > 0 && (
          <div className="frame-bar">
            <i /><i /><i />
            <span>{url || 'stee.design'}</span>
          </div>
        )}
        <div className="frame-screen" style={{ width: d.w, height: d.h, borderRadius: d.radius - d.bezel }}>
          <div className={`frame-ui ${wire ? 'is-wire' : ''}`}>{children}</div>
        </div>
      </div>
    </div>
  )
}
