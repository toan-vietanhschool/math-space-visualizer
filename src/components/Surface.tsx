import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { SurfaceData } from '../lib/math-parser';

interface SurfaceProps {
  data: SurfaceData;
  range: number;
  color1?: string;
  color2?: string;
}

export const Surface = ({
  data,
  range,
  color1 = '#00f2ff',
  color2 = '#7000ff',
}: SurfaceProps) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Màu theo độ cao: nội suy cyan (thấp) → tím (cao)
  const colors = useMemo(() => {
    const cols = new Float32Array(data.positions.length);
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const tmp = new THREE.Color();
    for (let i = 0; i < data.positions.length; i += 3) {
      const z = data.positions[i + 1];
      const t = (z + range / 2) / range;
      tmp.lerpColors(c1, c2, Math.max(0, Math.min(1, t)));
      cols[i] = tmp.r;
      cols[i + 1] = tmp.g;
      cols[i + 2] = tmp.b;
    }
    return cols;
  }, [data, range, color1, color2]);

  useEffect(() => {
    const g = geometryRef.current;
    if (!g) return;
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setIndex(new THREE.BufferAttribute(data.indices, 1));
    g.computeVertexNormals();
  }, [data, colors]);

  return (
    <mesh>
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
