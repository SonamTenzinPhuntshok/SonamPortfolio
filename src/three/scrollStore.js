// Tiny shared store the 3D scene reads every frame (no re-renders).
export const scrollStore = {
  progress: 0, // 0 → 1 over the whole page
  route: 'home', // 'home' | 'case' | 'about' | 'resume'
  accent: '#FFB020',
  accent2: '#FF5A1F',
  y: 0, // raw scroll position (px), used for wind speed
}

function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  scrollStore.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  scrollStore.y = window.scrollY
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
}

export const refreshScroll = update
