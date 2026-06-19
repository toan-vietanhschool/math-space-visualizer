import { evaluate } from 'mathjs';

export interface SurfaceData {
  positions: Float32Array;
  indices: Uint32Array;
  maxHeight: number; // đỉnh cao nhất của mặt (để đặt nhãn công thức phía trên)
}

export const generateSurfaceData = (
  formula: string,
  range: number,
  segments: number,
): SurfaceData => {
  const positions: number[] = [];
  const step = (range * 2) / segments;
  let maxHeight = -Infinity;

  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const x = -range + i * step;
      const y = -range + j * step;
      let z = 0;

      try {
        z = evaluate(formula, { x, y });
        if (isNaN(z) || !isFinite(z)) z = 0;
      } catch {
        z = 0;
      }

      if (z > maxHeight) maxHeight = z;
      positions.push(x, z, y); // Three.js: Y là chiều cao → giá trị hàm vào trục Y
    }
  }

  const indices: number[] = [];
  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < segments; i++) {
      const a = i + j * (segments + 1);
      const b = (i + 1) + j * (segments + 1);
      const c = i + (j + 1) * (segments + 1);
      const d = (i + 1) + (j + 1) * (segments + 1);
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
    maxHeight: isFinite(maxHeight) ? maxHeight : 1,
  };
};
