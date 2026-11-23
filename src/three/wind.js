import { scrollStore } from './scrollStore'

// Shared wind + pointer state, updated once per frame by the scene.
// Scrolling and pointer movement make it gust; the scroll direction
// decides which way the prayer flags fly. Tapping empty space sends a
// gust and releases paper wind horses (lungta).
export const wind = {
  amount: 0.3, // 0 calm … ~1.6 strong
  dir: 1, // +1 blowing right, -1 left
  gust: 0, // short extra puff from the pointer / taps
  dim: 1, // darker on reading pages
}

// Pointer / device tilt, in normalised screen space (-1..1, y up).
export const input = {
  x: 0, y: 0, speed: 0, lastX: 0, lastY: 0, tilt: false,
  hover: 0, // 1 while the pointer is moving over the page, fades when idle
  lastMove: -1e9,
  bursts: [], // queued taps: { x, y }
}

if (typeof window !== 'undefined') {
  const now = () => performance.now() / 1000
  window.addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -((e.clientY / window.innerHeight) * 2 - 1)
    input.speed += Math.hypot(x - input.lastX, y - input.lastY)
    input.lastX = x
    input.lastY = y
    input.lastMove = now()
    if (!input.tilt || e.pointerType === 'mouse') { input.x = x; input.y = y }
  }, { passive: true })
  // phones: tilting the phone moves the camera (where the browser allows it without a prompt)
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return
    input.tilt = true
    input.x = Math.max(-1, Math.min(1, e.gamma / 25))
    input.y = Math.max(-1, Math.min(1, (e.beta - 45) / 25))
  }, { passive: true })
  // tap / click on empty space of the home page → gust + lungta
  // ('click' so a scroll gesture on a phone never triggers it)
  window.addEventListener('click', (e) => {
    if (scrollStore.route !== 'home') return
    if (e.target.closest?.('a, button, input, textarea, select, label, [role="button"], .lightbox, .work-link, .project, .photo-card')) return
    if (window.getSelection?.().toString()) return
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -((e.clientY / window.innerHeight) * 2 - 1)
    if (input.bursts.length < 6) input.bursts.push({ x, y })
    input.lastX = x
    input.lastY = y
  }, { passive: true })
}
