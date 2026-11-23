import { scrollStore } from './scrollStore'

// The five night landmarks, in scroll order on the home page.
// focus = which part of the photo to keep when cropping (uv 0..1, v up).
export const SCENES = [
  { id: 'punakha', name: 'Punakha Dzong', aspect: 2400 / 1210, focus: [0.55, 0.5] },
  { id: 'tadzong', name: 'Ta Dzong, Paro', aspect: 2400 / 1597, focus: [0.5, 0.52] },
  { id: 'taktsang', name: 'Paro Taktsang', aspect: 2400 / 1571, focus: [0.45, 0.5] },
  { id: 'simtokha', name: 'Simtokha Dzong', aspect: 1280 / 853, focus: [0.5, 0.5] },
  { id: 'buddha', name: 'Buddha Dordenma', aspect: 1800 / 1955, focus: [0.5, 0.56] },
]

// Which landmark each inner page shows.
export const PAGE_SCENE = {
  about: 1,
  resume: 4,
  'work/lam': 3,
  'work/tshechu': 0,
  'work/menkhang': 2,
}

const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export const routeKey = () => (scrollStore.path || '/').replace(/^\//, '')

// What the background should show right now (ignoring route transitions).
export function sceneTarget() {
  if (scrollStore.route === 'home') {
    const s = scrollStore.progress * (SCENES.length - 1)
    const a = Math.min(Math.floor(s), SCENES.length - 2)
    const local = s - a
    return { a, b: a + 1, t: smooth(local, 0.62, 1), local }
  }
  const k = PAGE_SCENE[routeKey()] ?? 2
  return { a: k, b: k, t: 0, local: scrollStore.progress }
}
