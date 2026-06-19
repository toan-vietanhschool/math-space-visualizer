import { useState, useMemo } from 'react';
import { MathScene } from './components/MathScene';
import { explainFormula } from './lib/formula-info';
import { Globe, Info, Layers, Play, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [formula, setFormula] = useState('sin(sqrt(x^2 + y^2)) / (sqrt(x^2 + y^2))');
  const [inputFormula, setInputFormula] = useState(formula);
  const [range, setRange] = useState(10);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const info = useMemo(() => explainFormula(formula), [formula]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormula(inputFormula);
  };

  const presets = [
    { name: 'Ripple', formula: 'sin(sqrt(x^2 + y^2)) / (sqrt(x^2 + y^2))' },
    { name: 'Mountain', formula: 'sin(x) * cos(y)' },
    { name: 'Valley', formula: '0.1 * (x^2 + y^2)' },
    { name: 'Waves', formula: 'sin(x*0.5) + cos(y*0.5)' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MathScene formula={formula} range={range} />

      <div className="overlay">
        <div className="title-section">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge">
              <Sparkles size={12} style={{ marginRight: 6 }} />
              MATH SPACE VISUALIZER
            </div>
            <h1>Cosmic Functions</h1>
            <p>Visualizing mathematics in the fourth dimension</p>
          </motion.div>
        </div>

        <AnimatePresence>
          {isPanelVisible && (
            <motion.div 
              className="controls-panel glass-panel pointer-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <form onSubmit={handleSubmit} className="input-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Settings2 size={18} color="var(--accent)" />
                  <span className="label">Configuration</span>
                </div>

                <div className="input-container">
                  <label className="label">z = f(x, y)</label>
                  <input 
                    type="text" 
                    value={inputFormula} 
                    onChange={(e) => setInputFormula(e.target.value)}
                    placeholder="Enter formula (e.g. sin(x) + cos(y))"
                  />
                </div>

                <div className="input-container" style={{ marginTop: 12 }}>
                  <label className="label">Render Range: {range}</label>
                  <input 
                    type="range" 
                    min="2" 
                    max="20" 
                    step="0.5"
                    value={range}
                    onChange={(e) => setRange(parseFloat(e.target.value))}
                    style={{ padding: 0 }}
                  />
                </div>

                <button type="submit" className="btn" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Play size={16} fill="white" />
                  REGENERATE SPACE
                </button>
              </form>

              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Layers size={18} color="var(--accent)" />
                  <span className="label">Presets</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {presets.map((p) => (
                    <button 
                      key={p.name}
                      onClick={() => { setFormula(p.formula); setInputFormula(p.formula); }}
                      className="glass-panel pointer-auto"
                      style={{ 
                        padding: '8px', 
                        fontSize: '0.8rem', 
                        cursor: 'pointer',
                        color: formula === p.formula ? 'var(--accent)' : 'white',
                        borderColor: formula === p.formula ? 'var(--accent)' : 'var(--glass-border)'
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="stats">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Rendering 6,400 vertices</p>
            <p>Framework: React Three Fiber</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }} className="pointer-auto">
              <Globe size={20} style={{ cursor: 'pointer', opacity: 0.7 }} />
              <Info size={20} style={{ cursor: 'pointer', opacity: 0.7 }} />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="info-panel glass-panel pointer-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="badge">GIẢI THÍCH CÔNG THỨC</div>
          <h3>{info.title}</h3>
          <p className="info-summary">{info.summary}</p>
          <div className="info-tags">
            {info.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <ul className="info-details">
            {info.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <button 
        className="glass-panel pointer-auto" 
        style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 40, 
          padding: '12px', 
          zIndex: 20,
          cursor: 'pointer'
        }}
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        <Settings2 size={24} />
      </button>
    </div>
  );
}

export default App;
