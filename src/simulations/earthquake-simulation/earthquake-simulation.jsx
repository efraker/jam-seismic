import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function EarthquakeSimulation() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  
  // Structural parameters - user can modify these
  const [parameters, setParameters] = useState({
    mass: 1000,           // Mass of structure (kg)
    stiffness: 50000,     // Stiffness coefficient (N/m)
    damping: 0.05,        // Damping ratio (unitless)
    groundAccel: 5.0,     // Ground acceleration amplitude (m/s²)
    frequency: 1.5,       // Earthquake frequency (Hz)
    naturalFreq: 0,       // Calculated natural frequency
    period: 0             // Calculated period
  });
  
  const [displacement, setDisplacement] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Speech synthesis functionality (preserved from original)
  const speak = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.7;
    speechSynthesis.speak(utterance);
  };

  // Calculate derived parameters
  useEffect(() => {
    const naturalFreq = Math.sqrt(parameters.stiffness / parameters.mass) / (2 * Math.PI);
    const period = 1 / naturalFreq;
    
    setParameters(prev => ({
      ...prev,
      naturalFreq: naturalFreq,
      period: period
    }));
  }, [parameters.mass, parameters.stiffness]);

  // Animation loop for earthquake simulation
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setTime(prevTime => {
        const newTime = prevTime + 0.02; // 20ms increment
        
        // Simplified equation of motion solution for a damped oscillator
        const omega = 2 * Math.PI * parameters.naturalFreq;
        const excitationRatio = parameters.frequency / parameters.naturalFreq;
        
        // Dynamic amplification factor
        const denominator = Math.sqrt(
          Math.pow(1 - excitationRatio * excitationRatio, 2) +
          Math.pow(2 * parameters.damping * excitationRatio, 2)
        );
        const amplificationFactor = 1 / denominator;
        
        // Calculate structural displacement relative to ground
        const structuralDisplacement = amplificationFactor * 
          (parameters.groundAccel / (omega * omega)) * 
          Math.sin(2 * Math.PI * parameters.frequency * newTime - 
          Math.atan2(2 * parameters.damping * excitationRatio, 1 - excitationRatio * excitationRatio));
        
        setDisplacement(structuralDisplacement * 1000); // Convert to mm for display
        
        return newTime;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, parameters]);

  // Draw the academic-style visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines (academic paper style)
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    const gridSize = 20;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Major grid lines
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Scale factor for visualization
    const scale = 1.0;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Ground motion (horizontal displacement)
    const groundDisp = parameters.groundAccel * Math.sin(2 * Math.PI * parameters.frequency * time) * scale;
    
    // Ground (hatched pattern like academic figures)
    ctx.fillStyle = '#000000';
    const groundY = centerY + 120;
    ctx.fillRect(0, groundY, width, 20);
    
    // Add hatching pattern to ground
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i + groundDisp * 0.1, groundY);
      ctx.lineTo(i + 2 + groundDisp * 0.1, groundY + 20);
      ctx.stroke();
    }
    
    // Foundation (solid black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(centerX - 40 + groundDisp, centerY + 100, 80, 20);
    
    // Structure (building) - outlined box with hatching
    const structureX = centerX + groundDisp + displacement * scale;
    
    // Main structure outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(structureX - 30, centerY - 30, 60, 130);
    ctx.strokeRect(structureX - 30, centerY - 30, 60, 130);
    
    // Add diagonal hatching to show this is the structure
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    for (let i = -30; i < 30; i += 8) {
      ctx.beginPath();
      ctx.moveTo(structureX + i, centerY - 30);
      ctx.lineTo(structureX + i + 30, centerY + 0);
      ctx.stroke();
    }
    
    // Mass symbol at top (filled circle)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(structureX, centerY - 40, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Spring representation (simplified)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + groundDisp, centerY + 100);
    ctx.lineTo(structureX, centerY + 100);
    ctx.stroke();
    
    // Add spring coils
    const springStartX = centerX + groundDisp;
    const springEndX = structureX;
    const springY = centerY + 100;
    const coilCount = 6;
    const coilWidth = (springEndX - springStartX) / coilCount;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    for (let i = 0; i < coilCount; i++) {
      const x1 = springStartX + i * coilWidth;
      const x2 = springStartX + (i + 0.5) * coilWidth;
      const x3 = springStartX + (i + 1) * coilWidth;
      
      ctx.beginPath();
      ctx.moveTo(x1, springY);
      ctx.lineTo(x2, springY - 8);
      ctx.lineTo(x2, springY + 8);
      ctx.lineTo(x3, springY);
      ctx.stroke();
    }
    
    // Displacement measurement line
    if (Math.abs(displacement) > 0.1) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(centerX + groundDisp, centerY - 70);
      ctx.lineTo(structureX, centerY - 70);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Arrow heads
      const arrowSize = 4;
      ctx.fillStyle = '#000000';
      
      // Left arrow
      ctx.beginPath();
      ctx.moveTo(centerX + groundDisp, centerY - 70);
      ctx.lineTo(centerX + groundDisp + arrowSize, centerY - 70 - arrowSize);
      ctx.lineTo(centerX + groundDisp + arrowSize, centerY - 70 + arrowSize);
      ctx.closePath();
      ctx.fill();
      
      // Right arrow
      ctx.beginPath();
      ctx.moveTo(structureX, centerY - 70);
      ctx.lineTo(structureX - arrowSize, centerY - 70 - arrowSize);
      ctx.lineTo(structureX - arrowSize, centerY - 70 + arrowSize);
      ctx.closePath();
      ctx.fill();
      
      // Displacement value
      ctx.fillStyle = '#000000';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`δ = ${displacement.toFixed(1)} mm`, (centerX + groundDisp + structureX) / 2, centerY - 75);
      ctx.textAlign = 'start';
    }
    
    // Time and parameters display (academic style)
    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.fillText(`t = ${time.toFixed(2)} s`, 10, 20);
    ctx.fillText(`f = ${parameters.frequency.toFixed(1)} Hz`, 10, 35);
    ctx.fillText(`f₀ = ${parameters.naturalFreq.toFixed(2)} Hz`, 10, 50);
    
    // Axes labels
    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.fillText('Ground Motion →', 10, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('↑ Structure Response', 0, 0);
    ctx.restore();
    
  }, [time, displacement, parameters]);

  const handleParameterChange = (param, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setParameters(prev => ({
        ...prev,
        [param]: numValue
      }));
    }
  };

  const startSimulation = () => {
    setIsPlaying(true);
    setTime(0);
    speak("Starting earthquake simulation. Observe how the structure responds to ground motion.");
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    speak("Simulation stopped.");
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setTime(0);
    setDisplacement(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-mono-white text-mono-black font-mono p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Academic Paper Style */}
        <header className="border-b-2 border-mono-black pb-6 mb-8">
          <Link 
            to="/" 
            className="btn-scientific mb-4 inline-block text-xs"
          >
            ← BACK TO SIMULATIONS
          </Link>
          
          <h1 className="heading-primary text-caps tracking-scientific mb-2">Figure 1. Earthquake Response Simulation</h1>
          <p className="text-methodology">
            Interactive structural dynamics demonstration of single-degree-of-freedom system response to harmonic ground excitation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <div className="panel-scientific p-6 border-precise-2">
              <h2 className="text-figure-title mb-4">A. DYNAMIC RESPONSE VISUALIZATION</h2>
              
              <canvas 
                ref={canvasRef}
                width={600}
                height={400}
                className="border-2 border-mono-black w-full bg-mono-white chart-grid"
              />
              
              <div className="flex gap-2 mt-4 text-xs">
                <button
                  onClick={startSimulation}
                  disabled={isPlaying}
                  className="btn-scientific disabled:bg-mono-300 disabled:text-mono-500"
                >
                  START
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isPlaying}
                  className="btn-scientific disabled:bg-mono-300 disabled:text-mono-500"
                >
                  STOP
                </button>
                <button
                  onClick={resetSimulation}
                  className="btn-scientific"
                >
                  RESET
                </button>
                <label className="flex items-center gap-2 ml-4 text-data-label">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                    className="border border-mono-black"
                  />
                  NARRATION
                </label>
              </div>
            </div>
          </div>

          {/* Parameter Controls */}
          <div className="space-y-6">
            {/* Structural Parameters */}
            <div className="panel-scientific p-4 border-precise-2">
              <h3 className="text-figure-title mb-4">B. STRUCTURAL PARAMETERS</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-data-label block mb-1">
                    MASS (kg)
                  </label>
                  <input
                    type="number"
                    value={parameters.mass}
                    onChange={(e) => handleParameterChange('mass', e.target.value)}
                    className="input-scientific w-full text-tabular"
                    min="100"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="text-data-label block mb-1">
                    STIFFNESS (N/m)
                  </label>
                  <input
                    type="number"
                    value={parameters.stiffness}
                    onChange={(e) => handleParameterChange('stiffness', e.target.value)}
                    className="input-scientific w-full text-tabular"
                    min="1000"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="text-data-label block mb-1">
                    DAMPING RATIO (ζ)
                  </label>
                  <input
                    type="number"
                    value={parameters.damping}
                    onChange={(e) => handleParameterChange('damping', e.target.value)}
                    className="input-scientific w-full text-tabular"
                    min="0.01"
                    max="1.0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Earthquake Parameters */}
            <div className="panel-scientific p-4 border-precise-2">
              <h3 className="text-figure-title mb-4">C. EXCITATION PARAMETERS</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-data-label block mb-1">
                    GROUND ACCEL (m/s²)
                  </label>
                  <input
                    type="number"
                    value={parameters.groundAccel}
                    onChange={(e) => handleParameterChange('groundAccel', e.target.value)}
                    className="input-scientific w-full text-tabular"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="text-data-label block mb-1">
                    FREQUENCY (Hz)
                  </label>
                  <input
                    type="number"
                    value={parameters.frequency}
                    onChange={(e) => handleParameterChange('frequency', e.target.value)}
                    className="input-scientific w-full text-tabular"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="panel-scientific p-4 border-precise-2">
              <h3 className="text-figure-title mb-4">D. CALCULATED PROPERTIES</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-mono-300 pb-1">
                  <span className="text-data-label">NATURAL FREQ:</span>
                  <span className="text-data-value">{parameters.naturalFreq.toFixed(3)} Hz</span>
                </div>
                <div className="flex justify-between border-b border-mono-300 pb-1">
                  <span className="text-data-label">PERIOD:</span>
                  <span className="text-data-value">{parameters.period.toFixed(3)} s</span>
                </div>
                <div className="flex justify-between border-b border-mono-300 pb-1">
                  <span className="text-data-label">FREQ RATIO:</span>
                  <span className="text-data-value">{(parameters.frequency / parameters.naturalFreq).toFixed(3)}</span>
                </div>
                <div className="flex justify-between border-b border-mono-300 pb-1">
                  <span className="text-data-label">DISPLACEMENT:</span>
                  <span className="text-data-value">{displacement.toFixed(1)} mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Notes */}
        <div className="mt-8 panel-scientific p-6 border-precise-2">
          <h2 className="text-figure-title mb-4">ENGINEERING ANALYSIS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="text-data-value mb-2">RESONANCE PHENOMENON</h4>
              <p className="text-methodology leading-relaxed">Maximum amplification occurs when excitation frequency (f) approaches natural frequency (f₀). Critical for seismic design considerations.</p>
            </div>
            <div>
              <h4 className="text-data-value mb-2">DAMPING EFFECTS</h4>
              <p className="text-methodology leading-relaxed">Damping ratio (ζ) controls response amplitude. Typical values: 0.02-0.05 for steel, 0.03-0.08 for concrete structures.</p>
            </div>
            <div>
              <h4 className="text-data-value mb-2">FREQUENCY RELATIONSHIP</h4>
              <p className="text-methodology leading-relaxed">Natural frequency: f₀ = (1/2π)√(k/m). Higher stiffness-to-mass ratio increases natural frequency.</p>
            </div>
            <div>
              <h4 className="text-data-value mb-2">DESIGN IMPLICATIONS</h4>
              <p className="text-methodology leading-relaxed">Structures designed to avoid resonance with dominant earthquake frequencies (0.5-10 Hz typical range).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}