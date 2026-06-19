import { evaluate } from 'mathjs';

export const parseFormula = (formula: string, x: number, y: number) => {
  try {
    const scope = { x, y, sin: Math.sin, cos: Math.cos, tan: Math.tan, exp: Math.exp, log: Math.log, sqrt: Math.sqrt, abs: Math.abs, PI: Math.PI, e: Math.E };
    // We use mathjs evaluate but sanitize slightly for performance if needed
    // For now, standard evaluate is fine for this scale
    return evaluate(formula, scope);
  } catch (e) {
    return 0;
  }
};

export const generateSurfaceData = (formula: string, range: number, segments: number) => {
  const positions = [];
  const step = (range * 2) / segments;

  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const x = -range + i * step;
      const y = -range + j * step;
      let z = 0;
      
      try {
        const scope = { x, y };
        z = evaluate(formula, scope);
        if (isNaN(z) || !isFinite(z)) z = 0;
      } catch (e) {
        z = 0;
      }
      
      positions.push(x, z, y); // Y in Three.js is up, but math usually uses Z as height
    }
  }

  const indices = [];
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

  return { positions: new Float32Array(positions), indices: new Uint32Array(indices) };
};
