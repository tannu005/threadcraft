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
} from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../context/store'

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
      <mesh ref={bodyRef} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3.2, 0.25, 32, 32, 1]} />
        <meshStandardMaterial {...matProps} />
        
        {/* Render Decals on the body */}
        {decals.map((decal) => (
          <Decal
            key={decal.id}
            position={decal.position || [0, 0.2, 0.13]}
            rotation={decal.rotation || [0, 0, 0]}
            scale={decal.scale || [0.8, 0.8, 0.8]}
            map={decal.texture}
          />
        ))}
      </mesh>

      {/* Left sleeve */}
      <mesh ref={leftSleeveRef} castShadow position={[-1.5, 0.95, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[1.1, 0.7, 0.22, 12, 8, 1]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Right sleeve */}
      <mesh ref={rightSleeveRef} castShadow position={[1.5, 0.95, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[1.1, 0.7, 0.22, 12, 8, 1]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Collar (Refined) */}
      <mesh ref={collarRef} position={[0, 1.6, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.08, 16, 40]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}

// ─── Advanced Particle System ──────────────────────────────────────────────────
function ParticleField({ count = 150 }) {
  const ref = useRef()

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const colorOptions = [
      new THREE.Color('#c8ff00'), // acid
      new THREE.Color('#00f0ff'), // ice
      new THREE.Color('#ff4d00'), // ember
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 6

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 0.03 + 0.01
    }
    return { positions, colors, sizes }
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
      ref.current.rotation.z += delta * 0.01
    }
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
        opacity={0.4}
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
