import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Frame from './Frame'

// One design per swipe on phones; several per view on laptops.
// items: [{ key, device, Screen, title, note, tag, wire, url }]
// per: how many slides per view on desktop / tablet / phone.
export default function Carousel({ items, per = [3, 2, 1], label, size = 'md' }) {
  const track = useRef(null)
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(per[0])
  const [zoom, setZoom] = useState(null)

  const measure = useCallback(() => {
    const t = track.current
    if (!t || !t.children[0]) return
    const w = t.children[0].getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0
    setVisible(Math.max(1, Math.round((t.clientWidth + gap) / (w + gap))))
    setIdx(Math.round(t.scrollLeft / (w + gap)))
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    return () => ro.disconnect()
  }, [measure])

  const go = (i) => {
    const t = track.current
    const max = items.length - visible
    const n = Math.max(0, Math.min(max, i))
    const slide = t.children[n]
    t.scrollTo({ left: slide.offsetLeft - t.offsetLeft, behavior: 'smooth' })
  }

  const pages = Math.max(1, items.length - visible + 1)
  const fits = items.length <= visible

  return (
    <div className={`car car-${size} ${fits ? 'car-fits' : ''}`} style={{ '--pd': per[0], '--pt': per[1], '--pm': per[2] }}>
      <ul ref={track} className="car-track" onScroll={measure} aria-label={label} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1) }}>
        {items.map((it, k) => {
          const S = it.Screen
          return (
            <li key={it.key || k} className={`car-slide car-${it.device || 'phone'}`} aria-roledescription="slide" aria-label={`${k + 1} of ${items.length}: ${it.title}`}>
              <button type="button" className="car-device" onClick={() => setZoom(it)} aria-label={`Open ${it.title} full size`}>
                <Frame device={it.device || 'phone'} wire={it.wire} url={it.url} label={it.title}><S /></Frame>
                <span className="car-zoom" aria-hidden="true">⤢</span>
              </button>
              <div className="car-cap">
                <span className="car-count">{String(k + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}{it.tag && <em>{it.tag}</em>}</span>
                <strong>{it.title}</strong>
                {it.note && <p>{it.note}</p>}
              </div>
            </li>
          )
        })}
      </ul>
      {!fits && (
        <div className="car-ctrl">
          <button type="button" className="car-btn" onClick={() => go(idx - 1)} disabled={idx <= 0} aria-label="Previous design">←</button>
          <div className="car-dots" role="tablist" aria-label="Choose design">
            {Array.from({ length: pages }, (_, k) => (
              <button key={k} type="button" role="tab" aria-selected={k === idx} aria-label={`Go to design ${k + 1}`} className={k === idx ? 'on' : ''} onClick={() => go(k)} />
            ))}
          </div>
          <span className="car-hint">Swipe</span>
          <button type="button" className="car-btn" onClick={() => go(idx + 1)} disabled={idx >= pages - 1} aria-label="Next design">→</button>
        </div>
      )}
      {zoom && <Lightbox item={zoom} onClose={() => setZoom(null)} />}
    </div>
  )
}

export function Lightbox({ item, onClose }) {
  const close = useRef(null)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k) }
  }, [onClose])
  const S = item.Screen
  const device = item.device || 'phone'
  // Fit to the viewport; wide designs on a phone are shown larger and can be panned.
  const vw = window.innerWidth, vh = window.innerHeight
  const nat = { phone: [414, 868], tablet: [874, 1152], desktop: [1440, 940] }[device]
  let scale = Math.min((vw - 40) / nat[0], (vh - 150) / nat[1])
  if (device !== 'phone' && vw < 760) scale = Math.max(scale, 0.5)
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="lightbox-head" onClick={(e) => e.stopPropagation()}>
        <div><strong>{item.title}</strong>{item.note && <p>{item.note}</p>}</div>
        <button ref={close} type="button" className="car-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <Frame device={device} wire={item.wire} url={item.url} label={item.title} scale={scale}><S /></Frame>
      </div>
      {device !== 'phone' && vw < 760 && <p className="lightbox-tip">Drag sideways to see the whole screen</p>}
    </div>,
    document.body
  )
}
