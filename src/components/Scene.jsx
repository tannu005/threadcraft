// src/components/Scene.jsx — Premium Three.js scene with advanced lighting & particles
import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Sparkles,
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

  const { color, texture, roughness, metalness, envMapIntensity } = useStore()

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
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.12 + Math.sin(t * 0.3) * 0.06
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.015
  })

  // No GLTF — using premium procedural fallback
  // To use a real model, place tshirt.glb in /public/models/ and uncomment useGLTF

  // Premium procedural tshirt fallback
  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh ref={bodyRef} castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3.0, 0.14, 12, 12]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Left sleeve — angled */}
      <mesh ref={leftSleeveRef} castShadow position={[-1.62, 0.9, 0]} rotation={[0, 0, Math.PI / 7]}>
        <boxGeometry args={[1.0, 0.65, 0.12, 6, 4]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Right sleeve */}
      <mesh ref={rightSleeveRef} castShadow position={[1.62, 0.9, 0]} rotation={[0, 0, -Math.PI / 7]}>
        <boxGeometry args={[1.0, 0.65, 0.12, 6, 4]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Collar */}
      <mesh ref={collarRef} position={[0, 1.5, 0.02]}>
        <torusGeometry args={[0.42, 0.09, 10, 28, Math.PI]} />
        <meshStandardMaterial color={color} roughness={Math.min(roughness + 0.15, 1)} metalness={metalness * 0.5} envMapIntensity={envMapIntensity * 0.8} />
      </mesh>

      {/* Bottom hem detail */}
      <mesh position={[0, -1.52, 0.01]}>
        <boxGeometry args={[2.42, 0.06, 0.15]} />
        <meshStandardMaterial color={color} roughness={roughness + 0.1} />
      </mesh>
    </group>
  )
}

// ─── Advanced Particle System ──────────────────────────────────────────────────
function ParticleField({ count = 120 }) {
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
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 5

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = Math.random() * 0.025 + 0.008
    }
    return { positions, colors, sizes }
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018
      ref.current.rotation.x += delta * 0.006
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
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
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
      ring1.current.rotation.x = t * 0.15
      ring1.current.rotation.z = t * 0.08
      ring1.current.material.opacity = 0.04 + Math.sin(t * 0.5) * 0.02
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.1
      ring2.current.rotation.y = t * 0.12
      ring2.current.material.opacity = 0.03 + Math.sin(t * 0.4 + 1) * 0.02
    }
  })

  return (
    <>
      <mesh ref={ring1} position={[0, 0, 0]}>
        <torusGeometry args={[3.2, 0.008, 4, 80]} />
        <meshBasicMaterial color="#c8ff00" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <mesh ref={ring2} position={[0, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.006, 4, 80]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </>
  )
}

// ─── Animated background plane ─────────────────────────────────────────────────
function BackgroundGrid() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms?.time?.value && (meshRef.current.material.uniforms.time.value = state.clock.elapsedTime)
    }
  })
  return null // Handled via CSS
}

// ─── Camera rig for subtle drift ──────────────────────────────────────────────
function CameraDrift() {
  const { camera } = useThree()
  const basePos = useRef(new THREE.Vector3(0, 0, 5.5))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = basePos.current.x + Math.sin(t * 0.18) * 0.08
    camera.position.y = basePos.current.y + Math.sin(t * 0.12) * 0.05
  })
  return null
}

// ─── Main Scene ────────────────────────────────────────────────────────────────
export default function Scene() {
  const { autoRotate } = useStore()

  return (
    <div className="canvas-container w-full h-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 38, near: 0.1, far: 100 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* ── Lighting setup ── */}
        <ambientLight intensity={0.25} />

        {/* Key light — warm */}
        <directionalLight
          position={[4, 7, 4]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.001}
          color="#fff8f0"
        />

        {/* Rim light — ice blue */}
        <pointLight position={[-5, 2, -4]} intensity={1.2} color="#00f0ff" distance={15} decay={2} />

        {/* Fill light — acid */}
        <pointLight position={[5, -2, 3]} intensity={0.6} color="#c8ff00" distance={10} decay={2} />

        {/* Back accent — ember */}
        <pointLight position={[0, -4, -5]} intensity={0.4} color="#ff4d00" distance={12} decay={2} />

        {/* Top spot */}
        <spotLight
          position={[0, 9, 0]}
          intensity={0.8}
          angle={0.35}
          penumbra={0.9}
          castShadow
          shadow-bias={-0.001}
          color="#ffffff"
        />

        {/* ── Environment ── */}
        <Environment preset="studio" background={false} />

        {/* ── Atmospheric elements ── */}
        <EnergyRings />
        <ParticleField count={100} />

        {/* ── Sparkles (drei built-in) ── */}
        <Sparkles
          count={30}
          size={1.5}
          scale={[6, 6, 6]}
          color="#c8ff00"
          speed={0.3}
          opacity={0.3}
        />

        {/* ── T-Shirt Model ── */}
        <Suspense fallback={null}>
          <Center>
            <TShirtModel />
          </Center>
        </Suspense>

        {/* ── Ground shadow ── */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.65}
          scale={10}
          blur={3}
          far={5}
          color="#000000"
        />

        {/* ── Camera drift ── */}
        <CameraDrift />

        {/* ── Orbit Controls ── */}
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={(4 * Math.PI) / 5}
          minDistance={2.5}
          maxDistance={10}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          dampingFactor={0.08}
          enableDamping
          makeDefault
        />
      </Canvas>
    </div>
  )
}
