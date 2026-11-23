import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollStore } from './scrollStore'
import { SCENES, sceneTarget as target, routeKey } from './sceneConfig'
import { wind, input } from './wind'
import PrayerFlags from './PrayerFlags'
import Lungta from './Lungta'

// ─────────────────────────────────────────────────────────────
//  Night-time Bhutan, in 3D.
//  Each landmark photo was turned into a night scene and given a depth
//  map (tools/make-night-scenes.py). Here every photo is drawn on a
//  finely divided plane pushed toward the camera by its depth, so the
//  camera's movement gives real parallax. Scroll dissolves from one
//  landmark to the next; stars twinkle in the sky, floodlights flicker,
//  mist drifts and butter-lamp embers float in front.
//  Windows glow warm from inside (tools/make-window-lights.py) and switch
//  on one by one when a landmark appears. Prayer flags fly in front:
//  scrolling makes the wind pick up, the pointer ruffles the flags it
//  passes, and a tap on empty space sends paper wind horses flying.
// ─────────────────────────────────────────────────────────────

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isSmall = typeof window !== 'undefined' && window.innerWidth < 760

const D = 5 // camera distance

const FOV = 35

const vert = /* glsl */ `
  uniform sampler2D dataA; uniform sampler2D dataB;
  uniform vec4 crA; uniform vec4 crB;   // cover-crop: scale.xy, offset.xy
  uniform float mixT; uniform float depthScale;
  varying vec2 vUv; varying vec2 vUvA; varying vec2 vUvB; varying float vDepth;
  void main() {
    vUv = uv;
    vUvA = uv * crA.xy + crA.zw;
    vUvB = uv * crB.xy + crB.zw;
    float dA = texture2D(dataA, vUvA).r;
    float dB = texture2D(dataB, vUvB).r;
    float d = mix(dA, dB, mixT);
    vDepth = d;
    vec3 p = position;
    p.z += d * depthScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const frag = /* glsl */ `
  uniform sampler2D texA; uniform sampler2D texB;
  uniform sampler2D dataA; uniform sampler2D dataB;
  uniform sampler2D lightsA; uniform sampler2D lightsB; uniform float litA; uniform float litB;
  uniform float mixT; uniform float time; uniform vec2 res; uniform vec3 tint; uniform float motion;
  varying vec2 vUv; varying vec2 vUvA; varying vec2 vUvB; varying float vDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }

  vec3 shade(sampler2D tex, sampler2D data, sampler2D lights, vec2 uv, float seed, float lit) {
    vec3 col = texture2D(tex, uv).rgb;
    vec3 dat = texture2D(data, uv).rgb;   // r depth, g sky, b warm lights
    float t = time * motion;
    // twinkling stars, only in the sky
    vec2 g = uv * vec2(res.x / res.y, 1.0) * 140.0;
    vec2 cell = floor(g);
    float h = hash(cell + seed);
    float star = step(0.985, h) * smoothstep(0.35, 0.0, length(fract(g) - 0.5));
    star *= 0.55 + 0.45 * sin(t * (1.5 + h * 4.0) + h * 40.0);
    col += star * dat.g * vec3(0.85, 0.9, 1.0) * 1.4;
    // floodlights breathe a little
    float flick = 0.92 + 0.08 * sin(t * 2.3 + uv.x * 30.0) * noise(vec2(t * 0.7, uv.y * 10.0));
    col *= mix(1.0, flick * 1.08, dat.b);
    // drifting valley mist, thicker far away
    float m = fbm(uv * vec2(3.0, 6.0) + vec2(t * 0.015, 0.0));
    float far = smoothstep(0.45, 0.95, 1.0 - dat.r);
    col += vec3(0.32, 0.36, 0.55) * smoothstep(0.5, 0.85, m) * far * (1.0 - dat.g * 0.6) * 0.14;
    // lamp-lit windows: each switches on in turn (lit climbs 0 → 1 as the landmark appears)
    vec3 L = texture2D(lights, uv).rgb;            // r window, g halo, b window id
    float id = L.b;
    float on = smoothstep(id - 0.025, id, lit * 0.93) * step(0.01, id);
    float fl = 0.86 + 0.14 * sin(t * (1.7 + id * 8.0) + id * 91.0) * (0.6 + 0.4 * noise(vec2(t * 1.9, id * 37.0)));
    vec3 warm = mix(vec3(1.0, 0.36, 0.05), vec3(1.0, 0.55, 0.12), fract(id * 13.7));
    col *= 1.0 + L.g * 0.45 * lit;                  // warm spill on the walls around
    col += warm * L.g * 0.09 * lit;
    // inside each window: a lamp glow with soft shadows from frames and curtains
    float inner = 0.62 + 0.38 * noise(uv * res * vec2(0.12, 0.05) + id * 30.0);
    vec3 glass = warm * (0.8 + 0.35 * fl) * inner;
    glass += vec3(1.0, 0.7, 0.3) * 0.22 * fl * smoothstep(0.65, 1.0, inner);
    col = mix(col, glass, clamp(L.r * on, 0.0, 1.0) * 0.92);
    return col;
  }

  void main() {
    vec3 a = shade(texA, dataA, lightsA, vUvA, 1.0, litA);
    vec3 b = shade(texB, dataB, lightsB, vUvB, 7.0, litB);
    // organic dissolve: far parts change first, edges follow a noise pattern
    float n = fbm(vUv * 4.0) * 0.6 + (1.0 - vDepth) * 0.4;
    float k = smoothstep(n - 0.18, n + 0.18, mixT * 1.36 - 0.18);
    vec3 col = mix(a, b, k);
    col *= tint * 1.35;
    // cinematic vignette
    vec2 q = vUv - 0.5;
    col *= 1.0 - dot(q, q) * 0.7;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

function coverCrop(imgAspect, planeAspect, focus) {
  // returns [scaleX, scaleY, offsetX, offsetY] for uv → image uv
  let sx = 1
  let sy = 1
  if (imgAspect > planeAspect) sx = planeAspect / imgAspect
  else sy = imgAspect / planeAspect
  const ox = THREE.MathUtils.clamp(focus[0] - sx / 2, 0, 1 - sx)
  const oy = THREE.MathUtils.clamp(focus[1] - sy / 2, 0, 1 - sy)
  return new THREE.Vector4(sx, sy, ox, oy)
}

function useSceneTextures() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader()
    const base = (import.meta.env.BASE_URL || './') + 'scenes/'
    return SCENES.map((s) => {
      const color = loader.load(`${base}${s.id}.webp`)
      color.colorSpace = THREE.SRGBColorSpace
      color.anisotropy = 4
      const data = loader.load(`${base}${s.id}-depth.png`)
      data.colorSpace = THREE.NoColorSpace
      const lights = loader.load(`${base}${s.id}-lights.png`)
      lights.colorSpace = THREE.NoColorSpace
      return { color, data, lights }
    })
  }, [])
}

function PhotoPlane() {
  const tex = useSceneTextures()
  const { size, camera } = useThree()
  const mat = useRef()
  const trans = useRef({ key: null, from: 0, start: -10 })
  const lit = useRef(SCENES.map(() => 0)) // how many windows are on, per landmark
  const lastY = useRef(scrollStore.y)
  const planeAspect = size.width / size.height

  // plane fills the view with a margin for camera moves
  const visH = 2 * D * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  const planeH = visH * 1.1
  const planeW = planeH * planeAspect
  const geo = useMemo(
    () => new THREE.PlaneGeometry(planeW, planeH, isSmall ? 160 : 300, isSmall ? 220 : 200),
    [planeW, planeH]
  )

  const uniforms = useMemo(
    () => ({
      texA: { value: tex[0].color },
      texB: { value: tex[1].color },
      dataA: { value: tex[0].data },
      dataB: { value: tex[1].data },
      lightsA: { value: tex[0].lights },
      lightsB: { value: tex[1].lights },
      litA: { value: 0 },
      litB: { value: 0 },
      crA: { value: new THREE.Vector4(1, 1, 0, 0) },
      crB: { value: new THREE.Vector4(1, 1, 0, 0) },
      mixT: { value: 0 },
      depthScale: { value: 0.6 },
      time: { value: 0 },
      res: { value: new THREE.Vector2(1, 1) },
      tint: { value: new THREE.Color(1, 1, 1) },
      motion: { value: reduced ? 0 : 1 },
    }),
    [tex]
  )

  const set = (slot, i) => {
    const u = mat.current.uniforms
    u[`tex${slot}`].value = tex[i].color
    u[`data${slot}`].value = tex[i].data
    u[`lights${slot}`].value = tex[i].lights
    u[`lit${slot}`].value = lit.current[i]
    u[`cr${slot}`].value.copy(coverCrop(SCENES[i].aspect, planeAspect, SCENES[i].focus))
  }

  useFrame((state, dt) => {
    const u = mat.current.uniforms
    const now = state.clock.elapsedTime
    u.time.value = now
    u.res.value.set(state.size.width, state.size.height)

    // route changed → dissolve from whatever was showing to the new scene
    const key = scrollStore.route === 'home' ? 'home' : routeKey()
    const tg = target()
    if (trans.current.key !== key) {
      const prev = trans.current
      const shown = prev.key == null ? tg.a : prev.shown ?? tg.a
      trans.current = { key, from: shown, start: prev.key == null ? -10 : now }
    }
    const tp = (now - trans.current.start) / 1.4
    let a = tg.a
    let b = tg.b
    let t = tg.t
    if (tp < 1) {
      const to = tg.t < 0.5 ? tg.a : tg.b
      a = trans.current.from
      b = to
      t = THREE.MathUtils.smootherstep(tp, 0, 1)
    }
    trans.current.shown = t < 0.5 ? a : b
    // windows switch on while a landmark is on screen, and reset once it has gone
    for (let i = 0; i < SCENES.length; i++) {
      const vis = (i === a ? 1 - t : 0) + (i === b ? t : 0)
      const L = lit.current
      if (reduced) L[i] = 1
      else if (vis > 0.25) L[i] = Math.min(1, L[i] + dt * 0.32)
      else if (vis < 0.02) L[i] = Math.max(0, L[i] - dt * 0.5)
    }
    set('A', a)
    set('B', b)
    u.mixT.value = t

    // camera: slow dolly + drift within each scene, plus pointer parallax
    const l = tg.local
    // wind: scrolling makes it blow, the scroll direction sets which way
    const dy = scrollStore.y - lastY.current
    lastY.current = scrollStore.y
    const v = dt > 0 ? dy / dt : 0
    const windTarget = reduced ? 0.25 : 0.28 + Math.min(1.35, Math.abs(v) / 1400)
    wind.amount = THREE.MathUtils.damp(wind.amount, windTarget, Math.abs(v) > 50 ? 4 : 1.2, dt)
    if (Math.abs(v) > 60) wind.dir = THREE.MathUtils.damp(wind.dir, Math.sign(v), 2.5, dt)
    wind.gust = THREE.MathUtils.damp(wind.gust, reduced ? 0 : Math.min(0.9, input.speed * 6), 3, dt)
    // pointer hovering: fades out a second after the last movement
    const idle = performance.now() / 1000 - input.lastMove
    input.hover = THREE.MathUtils.damp(input.hover, idle < 1.2 ? 1 : 0, idle < 1.2 ? 6 : 1.5, dt)
    input.speed *= Math.pow(0.02, dt)
    wind.dim = THREE.MathUtils.damp(wind.dim, scrollStore.route === 'home' ? 1 : 0.72, 3, dt)

    const px = reduced ? 0 : input.x
    const py = reduced ? 0 : input.y
    const sway = reduced ? 0 : Math.sin(now * 0.12) * 0.06
    const tx = THREE.MathUtils.lerp(-0.22, 0.22, l) + px * 0.36 + sway
    const ty = THREE.MathUtils.lerp(0.06, -0.05, l) + py * 0.2
    const tz = D + 0.45 - 0.3 * l
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.6, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.6, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, 3, dt)
    camera.lookAt(px * 0.08, py * 0.05, 0)

    // inner pages sit a touch darker for reading
    const dim = scrollStore.route === 'home' ? 1 : 0.8
    u.tint.value.lerp(new THREE.Color(dim, dim, dim), 0.05)
  })

  return (
    <mesh geometry={geo}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} />
    </mesh>
  )
}

// Butter-lamp embers floating in front of the photo (a real 3D layer).
function Embers({ count = isSmall ? 70 : 160 }) {
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = 0.6 + Math.random() * 2.6
      speeds[i] = 0.04 + Math.random() * 0.12
    }
    return { positions, speeds }
  }, [count])
  useFrame((state, dt) => {
    if (reduced) return
    const arr = ref.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt * (1 + wind.amount * 0.6)
      arr[i * 3] += Math.sin(t * 0.5 + i) * 0.0015 + wind.dir * (wind.amount - 0.25 + wind.gust) * 0.35 * dt
      if (arr[i * 3] > 4.2) arr[i * 3] = -4.2
      if (arr[i * 3] < -4.2) arr[i * 3] = 4.2
      if (arr[i * 3 + 1] > 2.2) arr[i * 3 + 1] = -2.2
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffbf66" transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, D], fov: FOV, near: 0.1, far: 50 }} gl={{ antialias: true }}>
        <color attach="background" args={['#05060c']} />
        <PhotoPlane />
        <PrayerFlags />
        <Lungta />
        <Embers />
      </Canvas>
    </div>
  )
}
