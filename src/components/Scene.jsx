// src/components/Scene.jsx — Premium Three.js scene with advanced lighting & particles
import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Sparkles,
  Decal,
  RoundedBox,
} from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../context/store'

// ─── Text Texture Helper ──────────────────────────────────────────────────────
function TextTexture({ text, font = 'Syne', color = '#ffffff' }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 1024
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 1024, 1024)
    ctx.fillStyle = color
    ctx.font = `bold 120px ${font}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 512, 512)
    return c
  }, [text, font, color])

  return <canvasTexture attach="map" image={canvas} />
}

// ─── Floating T-Shirt Model ────────────────────────────────────────────────────
function TShirtModel() {
  const groupRef = useRef(null)
  const bodyRef = useRef(null)
  const leftSleeveRef = useRef(null)
  const rightSleeveRef = useRef(null)
  const collarRef = useRef(null)

  const { color, texture, roughness, metalness, envMapIntensity, decals } = useStore()

  // Shared material config
  const matProps = {
    color: color,
    map: texture || null,
    roughness: roughness,
    metalness: metalness,
    envMapIntensity: envMapIntensity,
  }

  // Sync material on store change
  useEffect(() => {
    const refs = [bodyRef, leftSleeveRef, rightSleeveRef, collarRef]
    refs.forEach(ref => {
      if (!ref.current) return
      const mat = ref.current.material
      if (!mat) return
      mat.color.set(color)
      if (texture) {
        mat.map = texture
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
        texture.flipY = true // Fix upside down textures
        texture.needsUpdate = true
      } else {
        mat.map = null
      }
      mat.roughness = roughness
      mat.metalness = metalness
      mat.envMapIntensity = envMapIntensity
      mat.needsUpdate = true
    })
  }, [color, texture, roughness, metalness, envMapIntensity])

  // Anti-gravity float animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08 + Math.sin(t * 0.3) * 0.04
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05
  })

  // Refined procedural T-shirt geometry
  // We'll use a slightly more complex shape with rounded edges (via box args)
  return (
    <group ref={groupRef}>
      {/* Body */}
      <RoundedBox 
        ref={bodyRef} 
        args={[2.4, 3.2, 0.4]} 
        radius={0.15} 
        smoothness={4} 
        castShadow 
        receiveShadow
        position={[0, 0, 0]}
      >
        <meshStandardMaterial {...matProps} />
        
        {/* Render Decals on the body */}
        {decals.map((decal) => (
          <Decal
            key={decal.id}
            position={decal.position}
            rotation={decal.rotation || [0, 0, 0]}
            scale={decal.scale}
            map={decal.texture}
          >
            {decal.type === 'text' && (
              <meshStandardMaterial transparent polygonOffset polygonOffsetFactor={-1}>
                <TextTexture text={decal.text} font={decal.font} color={decal.textColor} />
              </meshStandardMaterial>
            )}
          </Decal>
        ))}
      </RoundedBox>

      {/* Left sleeve */}
      <RoundedBox 
        ref={leftSleeveRef} 
        args={[1.1, 0.7, 0.35]} 
        radius={0.1} 
        smoothness={4} 
        position={[-1.5, 0.95, 0]} 
        rotation={[0, 0, 0.45]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </RoundedBox>

      {/* Right sleeve */}
      <RoundedBox 
        ref={rightSleeveRef} 
        args={[1.1, 0.7, 0.35]} 
        radius={0.1} 
        smoothness={4} 
        position={[1.5, 0.95, 0]} 
        rotation={[0, 0, -0.45]}
        castShadow
      >
        <meshStandardMaterial {...matProps} />
      </RoundedBox>

      {/* Collar (Refined) */}
      <mesh ref={collarRef} position={[0, 1.6, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.08, 16, 40]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}

// ─── Advanced Mouse-Reactive Particle System ──────────────────────────────────
function ParticleField({ count = 150 }) {
  const ref = useRef()
  const { mouse, viewport } = useThree()

  const { positions, colors, sizes, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const colorOptions = [
      new THREE.Color('#c8ff00'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff4d00'),
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 5

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 0.04 + 0.01
    }
    return { positions, colors, sizes, originalPositions }
  }, [count])

  useFrame((state, delta) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime
    const points = ref.current.geometry.attributes.position.array

    // Mouse interaction
    const mx = (mouse.x * viewport.width) / 2
    const my = (mouse.y * viewport.height) / 2

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Idle float
      const ix = originalPositions[i3] + Math.sin(time * 0.5 + i) * 0.2
      const iy = originalPositions[i3 + 1] + Math.cos(time * 0.3 + i) * 0.2
      const iz = originalPositions[i3 + 2] + Math.sin(time * 0.4 + i) * 0.2

      // Mouse repulsion
      const dx = mx - ix
      const dy = my - iy
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 2) {
        const force = (2 - dist) / 2
        points[i3] += (ix - dx * force - points[i3]) * 0.1
        points[i3 + 1] += (iy - dy * force - points[i3 + 1]) * 0.1
      } else {
        points[i3] += (ix - points[i3]) * 0.05
        points[i3 + 1] += (iy - points[i3 + 1]) * 0.05
        points[i3 + 2] += (iz - points[i3 + 2]) * 0.05
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={count} />
        <bufferAttribute attach="attributes-color" array={colors} itemSize={3} count={count} />
        <bufferAttribute attach="attributes-size" array={sizes} itemSize={1} count={count} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Ambient energy rings ──────────────────────────────────────────────────────
function EnergyRings() {
  const ring1 = useRef()
  const ring2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.12
      ring1.current.rotation.z = t * 0.05
      ring1.current.material.opacity = 0.03 + Math.sin(t * 0.4) * 0.01
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.08
      ring2.current.rotation.y = t * 0.1
      ring2.current.material.opacity = 0.02 + Math.sin(t * 0.3 + 2) * 0.01
    }
  })

  return (
    <>
      <mesh ref={ring1} position={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.006, 8, 100]} />
        <meshBasicMaterial color="#c8ff00" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <mesh ref={ring2} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[4.8, 0.004, 8, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </>
  )
}

// ─── Camera rig for subtle drift ──────────────────────────────────────────────
function CameraDrift() {
  const { camera } = useThree()
  const basePos = useRef(new THREE.Vector3(0, 0, 5.5))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = basePos.current.x + Math.sin(t * 0.15) * 0.1
    camera.position.y = basePos.current.y + Math.sin(t * 0.1) * 0.06
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Main Scene ────────────────────────────────────────────────────────────────
export default function Scene() {
  const { autoRotate, environment } = useStore()

  return (
    <div className="canvas-container w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 40, near: 0.1, far: 100 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* ── Lighting setup ── */}
        <ambientLight intensity={0.3} />

        {/* Key light — warm */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
          color="#fffaf4"
        />

        {/* Rim light — ice blue */}
        <pointLight position={[-6, 3, -4]} intensity={1.5} color="#00f0ff" distance={20} />

        {/* Fill light — acid */}
        <pointLight position={[6, -3, 3]} intensity={0.8} color="#c8ff00" distance={15} />

        {/* Top spotlight */}
        <spotLight
          position={[0, 10, 0]}
          intensity={1.2}
          angle={0.4}
          penumbra={1}
          castShadow
          color="#ffffff"
        />

        {/* ── Environment ── */}
        <Environment preset={environment} background={false} />

        {/* ── Atmospheric elements ── */}
        <EnergyRings />
        <ParticleField count={120} />

        <Sparkles
          count={40}
          size={1.8}
          scale={[8, 8, 8]}
          color="#c8ff00"
          speed={0.4}
          opacity={0.4}
        />

        {/* ── T-Shirt Model ── */}
        <Suspense fallback={null}>
          <Center>
            <TShirtModel />
          </Center>
        </Suspense>

        {/* ── Ground shadow ── */}
        <ContactShadows
          position={[0, -2.6, 0]}
          opacity={0.7}
          scale={12}
          blur={3}
          far={6}
          color="#000000"
        />

        {/* ── Camera drift ── */}
        <CameraDrift />

        {/* ── Orbit Controls ── */}
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          minDistance={3}
          maxDistance={9}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          dampingFactor={0.06}
          enableDamping
          makeDefault
        />
      </Canvas>
    </div>
  )
}
