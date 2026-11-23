import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { wind, input } from './wind'

// ─────────────────────────────────────────────────────────────
//  Lungta prayer flags in real 3D, strung beside the dzongs.
//  Colours run blue · white · red · green · yellow (sky, wind, fire,
//  water, earth). Every flag is a small subdivided cloth; the vertex
//  shader hangs it from a swaying string and lets the wind lift and
//  ripple it. Scrolling (and moving the pointer) makes the wind blow
//  harder, and the scroll direction sets which way the flags fly.
// ─────────────────────────────────────────────────────────────

const COLORS = ['#2E6BD8', '#F1EEE4', '#D7392B', '#2F9E5A', '#F0BE2C'].map((c) => new THREE.Color(c))
const FOV = 35

// Shared GLSL: where a point on the string is right now.
const STRING_GLSL = /* glsl */ `
  uniform float time; uniform float windAmt; uniform float windDir; uniform float gust;
  uniform vec3 pA; uniform vec3 pB; uniform float sag;
  uniform vec2 ptr; uniform float ptrAmt;   // pointer on this string's plane
  vec3 stringPoint(float s, float seed) {
    vec3 p = mix(pA, pB, s);
    float belly = 4.0 * s * (1.0 - s);
    p.y -= sag * belly * (1.0 - 0.25 * min(windAmt, 1.2));
    float sw = sin(time * (0.9 + windAmt * 0.6) + seed * 3.0 + s * 2.4);
    p.z += belly * (0.05 + 0.09 * windAmt) * sw;
    p.x += belly * 0.04 * windDir * windAmt;
    p.y += belly * 0.025 * sin(time * 1.7 + s * 6.0 + seed);
    return p;
  }
`

const flagVert = /* glsl */ `
  ${STRING_GLSL}
  attribute vec2 local;     // u across the flag, v down from the string
  attribute float sMid; attribute float sHalf; attribute float phase; attribute vec3 tint;
  uniform float flagH;
  varying vec2 vLocal; varying vec3 vTint; varying float vShade; varying float vPhase; varying vec3 vW;
  void main() {
    float u = local.x, v = local.y;
    float s = sMid + (u - 0.5) * 2.0 * sHalf;
    vec3 top = stringPoint(s, phase);
    // the pointer ruffles the flags it passes over
    float near = ptrAmt * smoothstep(0.6, 0.0, length(top.xy - ptr));
    float w = windAmt + gust + near * 1.3;
    // wind lifts the flag out of the hang and toward the camera / wind side
    float th = clamp(0.25 + w * 0.85, 0.0, 1.35) * (0.85 + 0.15 * sin(time * 2.1 + phase * 7.0));
    float hv = v * flagH;
    vec3 p = top;
    p.y -= cos(th) * hv;
    p.z += sin(th) * hv * 0.75;
    p.x += sin(th) * hv * 0.55 * windDir;
    // travelling ripple, stronger toward the free bottom edge
    float rip = sin(v * 7.0 - time * (5.0 + w * 6.0) + phase * 11.0 + u * 2.2);
    p.z += rip * (0.022 + near * 0.03) * v * (0.35 + w);
    p.x += cos(v * 5.0 - time * (4.0 + w * 5.0) + phase * 5.0) * 0.012 * v * (0.3 + w);
    vShade = 0.72 + 0.28 * cos(v * 7.0 - time * (5.0 + w * 6.0) + phase * 11.0 + u * 2.2);
    vLocal = local; vTint = tint; vPhase = phase; vW = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const flagFrag = /* glsl */ `
  uniform float time; uniform float dim; uniform vec3 warm;
  varying vec2 vLocal; varying vec3 vTint; varying float vShade; varying float vPhase; varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = vLocal;
    // frayed, uneven bottom edge
    float fray = 0.9 + 0.08 * hash(vec2(floor(uv.x * 26.0), vPhase));
    if (uv.y > fray) discard;
    // woodblock-print look: a framed panel, a wind-horse medallion and rows of mantra marks
    float frame = step(0.08, uv.x) * step(uv.x, 0.92) * step(0.1, uv.y) * step(uv.y, 0.84);
    float rows = step(0.55, fract(uv.y * 9.0)) * step(0.3, hash(floor(uv * vec2(14.0, 9.0)) + vPhase));
    float centre = smoothstep(0.2, 0.17, length((uv - vec2(0.5, 0.46)) * vec2(1.0, 1.25)));
    float ring = smoothstep(0.02, 0.0, abs(length((uv - vec2(0.5, 0.46)) * vec2(1.0, 1.25)) - 0.24));
    float ink = frame * max(max(rows * 0.55, centre * 0.7), ring * 0.6);
    vec3 col = vTint * (1.0 - ink * 0.5);
    col *= 0.9 + 0.1 * hash(floor(uv * vec2(90.0, 110.0)));       // cloth weave
    // real 3D shading from the rippling surface
    vec3 N = normalize(cross(dFdx(vW), dFdy(vW)));
    if (N.z < 0.0) N = -N;
    vec3 Lf = normalize(vec3(0.15, -0.55, 1.0));                   // dzong floodlights, from below
    vec3 Lm = normalize(vec3(-0.45, 0.8, 0.35));                    // moon, from above-left
    float df = max(dot(N, Lf), 0.0);
    float dm = max(dot(N, Lm), 0.0);
    vec3 moon = vec3(0.5, 0.58, 0.85);
    vec3 lit = col * moon * (0.07 + 0.16 * dm);
    lit += col * warm * df * (0.2 + 0.42 * uv.y);
    // light glowing through thin cloth where it turns away
    lit += col * warm * 0.16 * pow(1.0 - abs(N.z), 2.0) * (0.4 + 0.6 * uv.y);
    // faint sheen on the crests of the ripple
    lit += warm * 0.05 * pow(max(dot(reflect(-Lf, N), vec3(0.0, 0.0, 1.0)), 0.0), 12.0);
    gl_FragColor = vec4(lit * dim, 1.0);
    #include <colorspace_fragment>
  }
`

const lineVert = /* glsl */ `
  ${STRING_GLSL}
  attribute float s; attribute float side;
  uniform float thick;
  void main() {
    vec3 p = stringPoint(s, 0.0);
    p.y += side * thick;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const lineFrag = /* glsl */ `
  uniform float dim;
  void main() { gl_FragColor = vec4(vec3(0.16, 0.13, 0.11) * dim, 1.0); }
`

function buildFlags(count, gap, seed) {
  const SX = 6
  const SY = 9
  const pos = []
  const local = []
  const sMid = []
  const sHalf = []
  const phase = []
  const tint = []
  const index = []
  const step = 1 / count
  const half = (step * (1 - gap)) / 2
  let base = 0
  for (let k = 0; k < count; k++) {
    const mid = step * (k + 0.5)
    const c = COLORS[(k + seed) % 5]
    const ph = Math.random() * 6.28
    for (let j = 0; j <= SY; j++) {
      for (let i = 0; i <= SX; i++) {
        pos.push(0, 0, 0)
        local.push(i / SX, j / SY)
        sMid.push(mid)
        sHalf.push(half)
        phase.push(ph)
        tint.push(c.r, c.g, c.b)
      }
    }
    for (let j = 0; j < SY; j++) {
      for (let i = 0; i < SX; i++) {
        const a = base + j * (SX + 1) + i
        const b = a + 1
        const d = a + SX + 1
        const e = d + 1
        index.push(a, d, b, b, d, e)
      }
    }
    base += (SX + 1) * (SY + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('local', new THREE.Float32BufferAttribute(local, 2))
  g.setAttribute('sMid', new THREE.Float32BufferAttribute(sMid, 1))
  g.setAttribute('sHalf', new THREE.Float32BufferAttribute(sHalf, 1))
  g.setAttribute('phase', new THREE.Float32BufferAttribute(phase, 1))
  g.setAttribute('tint', new THREE.Float32BufferAttribute(tint, 3))
  g.setIndex(index)
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100) // shader moves vertices
  return g
}

function buildLine(n = 80) {
  const s = []
  const side = []
  const pos = []
  const index = []
  for (let i = 0; i <= n; i++) {
    for (const sd of [-1, 1]) {
      pos.push(0, 0, 0)
      s.push(i / n)
      side.push(sd)
    }
    if (i < n) {
      const a = i * 2
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('s', new THREE.Float32BufferAttribute(s, 1))
  g.setAttribute('side', new THREE.Float32BufferAttribute(side, 1))
  g.setIndex(index)
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
  return g
}

// a, b: string ends in screen space (-1..1) at depth z (world). sag in world units.
function FlagString({ a, b, z, sag, count, flagH, seed = 0 }) {
  const { size, camera } = useThree()
  const flags = useMemo(() => buildFlags(count, 0.12, seed), [count, seed])
  const line = useMemo(() => buildLine(), [])
  const uniforms = useMemo(
    () => ({
      time: { value: 0 }, windAmt: { value: 0.3 }, windDir: { value: 1 }, gust: { value: 0 },
      pA: { value: new THREE.Vector3() }, pB: { value: new THREE.Vector3() }, sag: { value: sag },
      flagH: { value: flagH }, thick: { value: 0.004 }, dim: { value: 1 }, warm: { value: new THREE.Color('#ffb25e') },
      ptr: { value: new THREE.Vector2(99, 99) }, ptrAmt: { value: 0 },
    }),
    [sag, flagH]
  )
  useFrame((state) => {
    const u = uniforms
    // keep the string's screen placement stable for any window shape
    const dist = camera.position.z - z
    const hh = dist * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const hw = hh * (size.width / size.height)
    u.pA.value.set(a[0] * hw, a[1] * hh, z)
    u.pB.value.set(b[0] * hw, b[1] * hh, z)
    u.time.value = state.clock.elapsedTime
    u.windAmt.value = wind.amount
    u.windDir.value = wind.dir
    u.gust.value = wind.gust
    u.dim.value = wind.dim
    // where the pointer sits on this string's depth plane
    u.ptr.value.set(camera.position.x + input.x * hw, camera.position.y + input.y * hh)
    u.ptrAmt.value = input.hover
  })
  return (
    <group>
      <mesh geometry={line} frustumCulled={false}>
        <shaderMaterial uniforms={uniforms} vertexShader={lineVert} fragmentShader={lineFrag} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={flags} frustumCulled={false}>
        <shaderMaterial uniforms={uniforms} vertexShader={flagVert} fragmentShader={flagFrag} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Darshing: a tall pole with one long vertical flag fixed along it, its free
// edge flapping in the wind. A small gilded finial tops the pole.
const poleVert = /* glsl */ `
  uniform float time; uniform float windAmt; uniform float windDir; uniform float gust; uniform float seed;
  uniform vec3 base; uniform float poleH; uniform float flagW; uniform float flagH;
  uniform vec2 ptr; uniform float ptrAmt;
  attribute vec2 local;
  varying vec2 vLocal; varying vec3 vW;
  void main() {
    float u = local.x, v = local.y;       // u: out from the pole, v: down from the top
    float near = ptrAmt * smoothstep(0.7, 0.0, length(base.xy + vec2(0.0, poleH * 0.7) - ptr));
    float w = windAmt + gust + near;
    vec3 p = base + vec3(0.0, poleH - 0.06 - v * flagH, 0.0);
    // the cloth swings out from the pole: hangs in calm air, streams in wind
    float out_ = clamp(0.35 + w * 0.75, 0.0, 1.0);
    float ang = mix(1.25, 0.15, out_);                   // angle down from horizontal
    p.x += u * flagW * cos(ang) * windDir;
    p.y -= u * flagW * sin(ang) * 0.35;
    // travelling waves along the cloth, larger toward the free edge
    float ph = u * 7.0 - time * (3.5 + w * 5.5) + v * 2.2 + seed;
    p.z += sin(ph) * (0.035 + 0.06 * w) * u;
    p.x -= (1.0 - cos(ph)) * 0.012 * u * windDir;
    p.y += sin(ph * 0.7 + v * 3.0) * 0.012 * u;
    vLocal = local; vW = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const poleFrag = /* glsl */ `
  uniform float dim; uniform vec3 warm; uniform float seed;
  varying vec2 vLocal; varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = vLocal;
    // tattered free edge
    if (uv.x > 0.93 + 0.06 * hash(vec2(floor(uv.y * 40.0), seed))) discard;
    vec3 col = vec3(0.93, 0.9, 0.84);
    // printed mantra columns running down the banner
    float lines = step(0.62, fract(uv.x * 9.0)) * step(0.05, uv.y) * step(uv.y, 0.95);
    float glyph = step(0.4, hash(floor(vec2(uv.x * 9.0, uv.y * 70.0)) + seed));
    col *= 1.0 - lines * glyph * 0.4;
    // coloured hem at the top and bottom
    col = mix(col, vec3(0.75, 0.16, 0.12), step(uv.y, 0.025));
    col = mix(col, vec3(0.13, 0.4, 0.75), step(0.975, uv.y));
    vec3 N = normalize(cross(dFdx(vW), dFdy(vW)));
    if (N.z < 0.0) N = -N;
    float df = max(dot(N, normalize(vec3(0.2, -0.6, 1.0))), 0.0);
    float dm = max(dot(N, normalize(vec3(-0.45, 0.8, 0.35))), 0.0);
    vec3 lit = col * vec3(0.5, 0.58, 0.85) * (0.06 + 0.14 * dm);
    lit += col * warm * df * (0.1 + 0.3 * uv.y);
    lit += col * warm * 0.12 * pow(1.0 - abs(N.z), 2.0);
    gl_FragColor = vec4(lit * dim, 1.0);
    #include <colorspace_fragment>
  }
`

function Darshing({ nx, ny, z, poleH = 2.1, flagW = 0.24, flagH = 1.25, seed = 0 }) {
  const { size, camera } = useThree()
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 24, 40)
    const uv = g.attributes.uv
    const local = new Float32Array(uv.count * 2)
    for (let i = 0; i < uv.count; i++) { local[i * 2] = uv.getX(i); local[i * 2 + 1] = 1 - uv.getY(i) }
    g.setAttribute('local', new THREE.BufferAttribute(local, 2))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
    return g
  }, [])
  const uniforms = useMemo(() => ({
    time: { value: 0 }, windAmt: { value: 0.3 }, windDir: { value: 1 }, gust: { value: 0 }, dim: { value: 1 }, seed: { value: seed },
    base: { value: new THREE.Vector3() }, poleH: { value: poleH }, flagW: { value: flagW }, flagH: { value: flagH },
    warm: { value: new THREE.Color('#ffb25e') }, ptr: { value: new THREE.Vector2(99, 99) }, ptrAmt: { value: 0 },
  }), [poleH, flagW, flagH, seed])
  const pole = useRef()
  const top = useRef()
  useFrame((state) => {
    const dist = camera.position.z - z
    const hh = dist * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const hw = hh * (size.width / size.height)
    const x = nx * hw
    const y = ny * hh
    const t = state.clock.elapsedTime
    // the whole pole sways a touch in strong wind
    const lean = Math.sin(t * 0.9 + seed) * 0.01 * (wind.amount + wind.gust)
    uniforms.base.value.set(x, y, z)
    uniforms.time.value = t
    uniforms.windAmt.value = wind.amount
    uniforms.windDir.value = wind.dir
    uniforms.gust.value = wind.gust
    uniforms.dim.value = wind.dim
    uniforms.ptr.value.set(camera.position.x + input.x * hw, camera.position.y + input.y * hh)
    uniforms.ptrAmt.value = input.hover
    pole.current.position.set(x, y + poleH / 2, z)
    pole.current.rotation.z = lean
    pole.current.material.color.setRGB(0.16 * wind.dim, 0.14 * wind.dim, 0.12 * wind.dim)
    top.current.position.set(x, y + poleH + 0.03, z)
    top.current.material.color.setRGB(0.55 * wind.dim, 0.38 * wind.dim, 0.12 * wind.dim)
  })
  return (
    <group>
      <mesh ref={pole}>
        <cylinderGeometry args={[0.008, 0.012, poleH, 8]} />
        <meshBasicMaterial color="#29221b" />
      </mesh>
      <mesh ref={top}>
        <coneGeometry args={[0.022, 0.07, 10]} />
        <meshBasicMaterial color="#8a6020" />
      </mesh>
      <mesh geometry={geo} frustumCulled={false}>
        <shaderMaterial uniforms={uniforms} vertexShader={poleVert} fragmentShader={poleFrag} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function PrayerFlags() {
  const { size } = useThree()
  const narrow = size.width / size.height < 0.9
  if (narrow) {
    // phones: one string high across the top, one dipping down the right edge
    return (
      <group>
        <FlagString a={[-1.25, 0.9]} b={[1.25, 0.78]} z={1.7} sag={0.18} count={12} flagH={0.12} seed={0} />
        <FlagString a={[-0.1, 1.08]} b={[1.2, 0.28]} z={1.25} sag={0.2} count={11} flagH={0.12} seed={2} />
        <Darshing nx={0.8} ny={-1.12} z={0.75} poleH={1.6} flagW={0.12} flagH={1.05} seed={1.5} />
      </group>
    )
  }
  return (
    <group>
      {/* long string across the top of the valley */}
      <FlagString a={[-1.15, 0.99]} b={[1.15, 0.9]} z={1.55} sag={0.24} count={30} flagH={0.14} seed={0} />
      {/* short string from a tree on the right, beside the dzong */}
      <FlagString a={[0.6, 1.1]} b={[1.15, 0.38]} z={1.0} sag={0.16} count={9} flagH={0.15} seed={3} />
      {/* a farther string on the left for depth */}
      <FlagString a={[-1.2, 0.6]} b={[-0.5, 0.8]} z={0.75} sag={0.12} count={10} flagH={0.12} seed={1} />
      {/* a small cluster of darshing poles at the right edge, beside the dzong */}
      <Darshing nx={0.8} ny={-1.15} z={0.8} poleH={1.85} flagW={0.17} flagH={1.25} seed={1} />
      <Darshing nx={0.9} ny={-1.2} z={1.05} poleH={2.1} flagW={0.19} flagH={1.45} seed={2.7} />
    </group>
  )
}
