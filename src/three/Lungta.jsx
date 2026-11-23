import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { wind, input } from './wind'

// ─────────────────────────────────────────────────────────────
//  Lungta — small paper "wind horses" thrown into the wind for luck.
//  Tap or click any empty part of the page and a handful burst from
//  that spot, tumbling in 3D and drifting with the wind. Scroll fast and
//  the strong wind tears a few loose from the prayer-flag strings.
// ─────────────────────────────────────────────────────────────

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const FOV = 35
const MAX = 160
const PAPER = ['#3B7BE8', '#F4F1E8', '#E0473A', '#35A866', '#F4C640'].map((c) => new THREE.Color(c))

// Printed paper: a framed sheet with a little horse-and-jewel mark.
function paperTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  g.fillStyle = '#fff'
  g.fillRect(0, 0, 64, 64)
  g.strokeStyle = 'rgba(40,30,20,.55)'
  g.lineWidth = 3
  g.strokeRect(6, 6, 52, 52)
  g.fillStyle = 'rgba(40,30,20,.5)'
  // stylised horse: body, neck, head, legs, and a jewel on its back
  g.beginPath()
  g.ellipse(30, 36, 12, 6, 0, 0, Math.PI * 2)
  g.fill()
  g.fillRect(38, 24, 5, 12)
  g.fillRect(38, 22, 10, 5)
  for (const x of [21, 26, 34, 39]) g.fillRect(x, 40, 3, 10)
  g.beginPath()
  g.arc(29, 26, 4, 0, Math.PI * 2)
  g.fill()
  for (let y = 14; y < 18; y += 3) g.fillRect(12, y, 40, 1.5)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export default function Lungta() {
  const mesh = useRef()
  const { camera, size } = useThree()
  const tex = useMemo(paperTexture, [])
  const P = useMemo(() => ({
    alive: new Uint8Array(MAX),
    pos: new Float32Array(MAX * 3),
    vel: new Float32Array(MAX * 3),
    rot: new Float32Array(MAX * 3),
    spin: new Float32Array(MAX * 3),
    life: new Float32Array(MAX),
    maxLife: new Float32Array(MAX),
    size: new Float32Array(MAX),
    next: 0,
    carry: 0,
  }), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  const spawn = (x, y, z, vx, vy, vz) => {
    const i = P.next
    P.next = (P.next + 1) % MAX
    P.alive[i] = 1
    P.pos.set([x, y, z], i * 3)
    P.vel.set([vx, vy, vz], i * 3)
    P.rot.set([Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28], i * 3)
    P.spin.set([(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6], i * 3)
    P.life[i] = 0
    P.maxLife[i] = 3.5 + Math.random() * 2.5
    P.size[i] = 0.05 + Math.random() * 0.03
    const c = PAPER[Math.floor(Math.random() * 5)]
    mesh.current.setColorAt(i, color.copy(c))
    mesh.current.instanceColor.needsUpdate = true
  }

  // world position of a screen point (-1..1) on the plane at depth z
  const toWorld = (sx, sy, z) => {
    const dist = camera.position.z - z
    const hh = dist * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const hw = hh * (size.width / size.height)
    return [camera.position.x + sx * hw, camera.position.y + sy * hh]
  }

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 20)
    const m = mesh.current
    if (!m) return
    // taps → a burst of papers and a gust
    while (input.bursts.length) {
      const b = input.bursts.shift()
      if (reduced) continue
      const z = 1.2
      const [x, y] = toWorld(b.x, b.y, z)
      const n = 18
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + Math.random() * 0.4
        const sp = 0.6 + Math.random() * 0.9
        spawn(x, y, z + (Math.random() - 0.5) * 0.3, Math.cos(a) * sp + wind.dir * 0.3, Math.sin(a) * sp * 0.8 + 0.5, (Math.random() - 0.3) * 0.5)
      }
      wind.gust = Math.min(1.6, wind.gust + 1.1)
    }
    // strong scroll wind tears a few loose from the strings at the top
    if (!reduced && wind.amount > 0.75) {
      P.carry += (wind.amount - 0.75) * 26 * dt
      while (P.carry >= 1) {
        P.carry -= 1
        const z = 1.55
        const [x, y] = toWorld(Math.random() * 2.2 - 1.1, 0.8 + Math.random() * 0.15, z)
        spawn(x, y, z, wind.dir * 0.4, 0.15, (Math.random() - 0.5) * 0.3)
      }
    }

    const t = state.clock.elapsedTime
    const push = wind.dir * (wind.amount + wind.gust) * 0.95
    const dim = 0.62 * wind.dim
    for (let i = 0; i < MAX; i++) {
      if (!P.alive[i]) {
        dummy.position.set(0, -99, 0)
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        m.setMatrixAt(i, dummy.matrix)
        continue
      }
      const j = i * 3
      P.life[i] += dt
      // drag toward the wind, gentle fall and flutter
      P.vel[j] += (push - P.vel[j]) * dt * 1.1
      P.vel[j + 1] += (-0.2 - P.vel[j + 1]) * dt * 0.9 + Math.sin(t * 3.1 + i) * 0.5 * dt
      P.vel[j + 2] *= 1 - dt * 0.8
      P.pos[j] += P.vel[j] * dt
      P.pos[j + 1] += P.vel[j + 1] * dt
      P.pos[j + 2] += P.vel[j + 2] * dt
      for (let k = 0; k < 3; k++) P.rot[j + k] += P.spin[j + k] * dt
      const L = P.life[i] / P.maxLife[i]
      if (L >= 1 || Math.abs(P.pos[j]) > 6 || P.pos[j + 1] < -4) { P.alive[i] = 0; continue }
      const s = P.size[i] * Math.min(1, P.life[i] * 8) * (1 - THREE.MathUtils.smoothstep(L, 0.75, 1))
      dummy.position.set(P.pos[j], P.pos[j + 1], P.pos[j + 2])
      dummy.rotation.set(P.rot[j], P.rot[j + 1], P.rot[j + 2])
      dummy.scale.set(s, s * 0.8, s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    m.material.color.setRGB(dim * 1.05, dim * 0.92, dim * 0.78) // warm night light on the paper
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, MAX]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
      <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(MAX * 3).fill(1), 3]} />
    </instancedMesh>
  )
}
