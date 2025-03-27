import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Group, BufferGeometry, Material } from "three";

interface CrowdModelProps {
  position?: [number, number, number];
}

function CrowdModel({ position = [0, 0, 0] }: CrowdModelProps) {
  const group = useRef<Group>(null);

  // Memoize the crowd particles to improve performance
  const crowdParticles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 3 + Math.sin(i * 0.5) * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return {
          position: [x, Math.sin(i * 0.5) * 0.2, z] as [number, number, number],
          color: `hsl(${(i * 10) % 360}, 70%, 70%)`,
          key: i,
        };
      }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 4;
    group.current.position.y = Math.sin(t / 2) / 2 + position[1];
  });

  return (
    <group ref={group} position={position}>
      {/* Create abstract representation of crowd using basic shapes */}
      {crowdParticles.map(({ position: particlePosition, color, key }) => (
        <mesh key={key} position={particlePosition} scale={0.2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.8} />
        </mesh>
      ))}
      {/* Central platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 32]} />
        <meshStandardMaterial color="#1d1d1f" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export const CrowdVisualization: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 50 }}
      style={{
        height: "100vh",
        background:
          "radial-gradient(circle at center, #1d1d1f 0%, #000000 100%)",
      }}
      // Improve performance with these settings
      dpr={[1, 2]} // Limit pixel ratio for better performance
      performance={{ min: 0.5 }} // Allow frame rate to drop for better performance
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <CrowdModel position={[0, 0, 0]} />
      </Float>

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};
