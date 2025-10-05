'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'

function LaptopModel() {
  const { scene } = useGLTF('/models/laptop.glb') // path to your 3D model
  return <primitive object={scene} scale={1} />
}

export default function Laptop3D() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Stage environment="city" intensity={0.6}>
        <LaptopModel />
      </Stage>
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={1} 
        enableZoom={true} 
        enablePan={false} 
      />
    </Canvas>
  )
}
