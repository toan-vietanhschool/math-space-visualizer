import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import { Surface } from './Surface';
import { Suspense } from 'react';

interface MathSceneProps {
  formula: string;
  range: number;
}

export const MathScene = ({ formula, range }: MathSceneProps) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
      <OrbitControls 
        makeDefault 
        enablePan={false} 
        minDistance={5} 
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 50]} />

      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" castShadow />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={2} color="#7000ff" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Surface formula={formula} range={range} segments={80} />
        </Float>

        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          fadeStrength={5} 
          cellSize={1} 
          sectionSize={5} 
          sectionColor="#333" 
          cellColor="#111" 
          position={[0, -0.01, 0]}
        />

        <Sparkles count={100} scale={20} size={2} speed={0.2} color="#00f2ff" />
        
        <ContactShadows 
          resolution={1024} 
          scale={20} 
          blur={2} 
          opacity={0.5} 
          far={10} 
          color="#000000" 
        />
      </Suspense>
    </Canvas>
  );
};
