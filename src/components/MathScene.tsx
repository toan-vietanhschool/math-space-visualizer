import { Canvas } from '@react-three/fiber';
import {
  OrbitControls, PerspectiveCamera, Grid, Environment, Float,
  Sparkles, ContactShadows, Html, Text, Billboard,
} from '@react-three/drei';
import { Surface } from './Surface';
import { Suspense, useMemo } from 'react';
import { generateSurfaceData } from '../lib/math-parser';
import { explainFormula } from '../lib/formula-info';

interface MathSceneProps {
  formula: string;
  range: number;
}

const SEGMENTS = 80;

export const MathScene = ({ formula, range }: MathSceneProps) => {
  const surface = useMemo(() => generateSurfaceData(formula, range, SEGMENTS), [formula, range]);
  const info = useMemo(() => explainFormula(formula), [formula]);
  const labelY = surface.maxHeight + range * 0.18 + 0.5;

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
          <Surface data={surface} range={range} />
        </Float>

        {/* Nhãn công thức + tên, nổi ngay trên đỉnh bề mặt */}
        <Html position={[0, labelY, 0]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
          <div className="formula-label-3d">
            <span className="fl-eq">z = {formula}</span>
            <span className="fl-title">{info.title}</span>
          </div>
        </Html>

        {/* Nhãn trục (luôn hướng về camera) */}
        <Billboard position={[range + 1.2, 0, 0]}>
          <Text fontSize={0.9} color="#00f2ff" anchorX="center" anchorY="middle">x</Text>
        </Billboard>
        <Billboard position={[0, 0, range + 1.2]}>
          <Text fontSize={0.9} color="#00f2ff" anchorX="center" anchorY="middle">y</Text>
        </Billboard>
        <Billboard position={[0, labelY * 0.55, range * 0.08]}>
          <Text fontSize={0.9} color="#b388ff" anchorX="center" anchorY="middle">z</Text>
        </Billboard>

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

        <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
      </Suspense>
    </Canvas>
  );
};
