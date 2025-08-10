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

  // Draw the structure and ground motion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);
    
    // Scale factor for visualization
    const scale = 0.5;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Ground motion (horizontal displacement)
    const groundDisp = parameters.groundAccel * Math.sin(2 * Math.PI * parameters.frequency * time) * scale;
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, centerY + 100 + groundDisp, width, 50);
    
    // Foundation
    ctx.fillStyle = '#666666';
    ctx.fillRect(centerX - 30 + groundDisp, centerY + 80, 60, 20);
    
    // Structure (building)
    const structureX = centerX + groundDisp + displacement * scale;
    
    // Main structure
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(structureX - 25, centerY - 20, 50, 100);
    
    // Roof
    ctx.fillStyle = '#1E40AF';
    ctx.beginPath();
    ctx.moveTo(structureX - 35, centerY - 20);
    ctx.lineTo(structureX, centerY - 50);
    ctx.lineTo(structureX + 35, centerY - 20);
    ctx.closePath();
    ctx.fill();
    
    // Spring/damper representation
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + groundDisp, centerY + 80);
    ctx.lineTo(structureX, centerY + 80);
    ctx.stroke();
    
    // Displacement indicator
    if (Math.abs(displacement) > 0.1) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX + groundDisp, centerY - 60);
      ctx.lineTo(structureX, centerY - 60);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Displacement value
      ctx.fillStyle = '#F59E0B';
      ctx.font = '14px monospace';
      ctx.fillText(`${displacement.toFixed(1)} mm`, centerX + 20, centerY - 65);
    }
    
    // Time display
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px monospace';
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 30);
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-block mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← Back to Simulations
          </Link>
          
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Earthquake Simulation</h1>
          <p className="text-gray-300 text-lg">
            Interactive structural dynamics demonstration showing how buildings respond to seismic forces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Animation Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/70 backdrop-blur-sm border border-blue-500/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">Structure Response Visualization</h2>
              
              <canvas 
                ref={canvasRef}
                width={600}
                height={400}
                className="border border-gray-600 rounded-lg w-full bg-gray-900"
              />
              
              <div className="flex gap-4 mt-4">
                <button
                  onClick={startSimulation}
                  disabled={isPlaying}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isPlaying}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Stop
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                    className="rounded"
                  />
                  Voice narration
                </label>
              </div>
            </div>
          </div>

          {/* Parameter Controls */}
          <div className="space-y-6">
            {/* Structural Parameters */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-blue-500/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">Structural Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Mass (kg)
                  </label>
                  <input
                    type="number"
                    value={parameters.mass}
                    onChange={(e) => handleParameterChange('mass', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="100"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Stiffness (N/m)
                  </label>
                  <input
                    type="number"
                    value={parameters.stiffness}
                    onChange={(e) => handleParameterChange('stiffness', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1000"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Damping Ratio
                  </label>
                  <input
                    type="number"
                    value={parameters.damping}
                    onChange={(e) => handleParameterChange('damping', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.01"
                    max="1.0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Earthquake Parameters */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-red-500/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-red-300 mb-4">Earthquake Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Ground Acceleration (m/s²)
                  </label>
                  <input
                    type="number"
                    value={parameters.groundAccel}
                    onChange={(e) => handleParameterChange('groundAccel', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Frequency (Hz)
                  </label>
                  <input
                    type="number"
                    value={parameters.frequency}
                    onChange={(e) => handleParameterChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-green-500/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-green-300 mb-4">Calculated Properties</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Natural Frequency:</span>
                  <span className="text-green-400 font-mono">{parameters.naturalFreq.toFixed(3)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Natural Period:</span>
                  <span className="text-green-400 font-mono">{parameters.period.toFixed(3)} s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Frequency Ratio:</span>
                  <span className="text-green-400 font-mono">{(parameters.frequency / parameters.naturalFreq).toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Displacement:</span>
                  <span className="text-green-400 font-mono">{displacement.toFixed(1)} mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Notes */}
        <div className="mt-6 bg-gray-800/70 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Engineering Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Resonance Effect</h3>
              <p>When earthquake frequency matches the structure's natural frequency, amplification is maximum. This is why understanding natural periods is critical in seismic design.</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Damping Importance</h3>
              <p>Higher damping reduces structural response amplitude. Modern buildings incorporate various damping systems to limit earthquake damage.</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Mass vs. Stiffness</h3>
              <p>The natural frequency depends on the square root of stiffness-to-mass ratio. Stiffer structures have higher natural frequencies.</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Design Strategy</h3>
              <p>Engineers design buildings to avoid resonance with expected ground motion frequencies, typically 0.5-10 Hz for earthquakes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}