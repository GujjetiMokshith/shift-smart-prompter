import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.15;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.1;
      
      // Dynamic color shift
      const material = ref.current.material as THREE.PointsMaterial;
      if (material) {
        const hue = (Math.sin(state.clock.elapsedTime * 0.3) + 1) * 0.5;
        material.color.setHSL(0.6 + hue * 0.2, 0.8, 0.4);
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
};

const WaveGeometry = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.8;
    }
    
    if (mesh2.current) {
      mesh2.current.rotation.y = state.clock.elapsedTime * 0.1;
      mesh2.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
      mesh2.current.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 2;
    }
  });

  return (
    <>
      <mesh ref={mesh} position={[0, 0, -8]}>
        <torusGeometry args={[4, 0.15, 20, 120]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      <mesh ref={mesh2} position={[0, 0, -12]}>
        <ringGeometry args={[2, 3, 32]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.2}
          wireframe
        />
      </mesh>
    </>
  );
};

const WebGLBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ParticleField />
        <WaveGeometry />
      </Canvas>
    </div>
  );
};

export default WebGLBackground;