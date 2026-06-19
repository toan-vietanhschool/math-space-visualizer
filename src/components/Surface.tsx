import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { generateSurfaceData } from '../lib/math-parser';

interface SurfaceProps {
  formula: string;
  range: number;
  segments: number;
  color1?: string;
  color2?: string;
}

export const Surface = ({ 
  formula, 
  range = 5, 
  segments = 100,
  color1 = "#00f2ff",
  color2 = "#7000ff"
}: SurfaceProps) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const { positions, indices, colors } = useMemo(() => {
    const data = generateSurfaceData(formula, range, segments);
    const colors = new Float32Array(data.positions.length);
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const tempColor = new THREE.Color();

    for (let i = 0; i < data.positions.length; i += 3) {
      const z = data.positions[i + 1]; // Height is Y in our mesh
      const t = (z + range / 2) / range; // Normalize height for color interpolation
      tempColor.lerpColors(c1, c2, Math.max(0, Math.min(1, t)));
      colors[i] = tempColor.r;
      colors[i + 1] = tempColor.g;
      colors[i + 2] = tempColor.b;
    }

    return { ...data, colors };
  }, [formula, range, segments, color1, color2]);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometryRef.current.setIndex(new THREE.BufferAttribute(indices, 1));
      geometryRef.current.computeVertexNormals();
    }
  }, [positions, indices, colors]);

  return (
    <mesh rotation={[0, 0, 0]}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial 
        vertexColors
        emissive={color1}
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
};
