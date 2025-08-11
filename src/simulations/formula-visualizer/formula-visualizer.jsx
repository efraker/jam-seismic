import React, { useState, useRef, useEffect } from 'react';
import { SimulationLayout } from '../../components/layout/AcademicPage';
import { ParameterInput, ParameterPanel, DataDisplay, ControlButton } from '../../components/scientific/ParameterPanel';
import { Figure } from '../../components/scientific/Figure';
import { FormulaLibrary, InteractiveFormula } from '../../components/content/FormulaDisplay';
import { FORMULAS, MATERIAL_PROPERTIES } from '../../constants/engineering';
import * as WolframAlpha from '../../services/wolframAlpha';

export default function FormulaVisualizer() {
  const canvasRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('beam');
  // Future enhancement: animation and visualization modes
  // const [visualizationMode, setVisualizationMode] = useState('static');
  // const [animationTime, setAnimationTime] = useState(0);
  // const [isAnimating, setIsAnimating] = useState(false);

  // Formula categories with interactive visualizations
  const formulaCategories = {
    beam: {
      name: 'Beam Analysis',
      description: 'Deflection, bending moment, and stress analysis',
      formulas: [
        {
          title: 'Cantilever Beam Deflection',
          formula: 'δ = (P × L³) / (3 × E × I)',
          description: 'Maximum deflection at free end of cantilever beam under point load',
          interactive: true,
          parameters: [
            { name: 'P', label: 'Point Load', defaultValue: 1000, units: 'N', min: 100, max: 10000, step: 100 },
            { name: 'L', label: 'Beam Length', defaultValue: 3, units: 'm', min: 1, max: 10, step: 0.1 },
            { name: 'E', label: 'Elastic Modulus', defaultValue: 200000, units: 'MPa', min: 10000, max: 300000, step: 1000 },
            { name: 'I', label: 'Moment of Inertia', defaultValue: 0.0001, units: 'm⁴', min: 0.00001, max: 0.001, step: 0.00001, precision: 6 }
          ],
          calculation: (params) => FORMULAS.cantileverDeflection(params.P, params.L, params.E * 1e6, params.I),
          resultLabel: 'Maximum Deflection',
          resultUnits: 'm',
          wolframBuilder: (params) => WolframAlpha.BEAM_ANALYSIS.cantileverDeflection(params.P, params.L, params.E * 1e6, params.I),
          visualizationType: 'beam_deflection'
        },
        {
          title: 'Simply Supported Beam - Center Deflection (Placeholder)',
          formula: 'δ = (5 × w × L⁴) / (384 × E × I)',
          description: 'Maximum deflection at center of simply supported beam under uniform load - Interactive visualization coming soon',
          interactive: false,
          isPlaceholder: true,
          calculation: (params) => FORMULAS.simplySupported_centerDeflection(params.w, params.L, params.E * 1e6, params.I),
          resultLabel: 'Center Deflection',
          resultUnits: 'm',
          wolframBuilder: (params) => WolframAlpha.BEAM_ANALYSIS.simplySupported(params.w, params.L, params.E * 1e6, params.I),
          visualizationType: 'placeholder'
        },
        {
          title: 'Maximum Bending Moment (Placeholder)',
          formula: 'M = (w × L²) / 8',
          description: 'Maximum bending moment for simply supported beam under uniform load - Interactive visualization coming soon',
          interactive: false,
          isPlaceholder: true,
          calculation: (params) => FORMULAS.maxBendingMoment_distributedLoad(params.w, params.L),
          resultLabel: 'Maximum Moment',
          resultUnits: 'N⋅m',
          wolframBuilder: (params) => WolframAlpha.BEAM_ANALYSIS.bendingMoment(params.w, params.L),
          visualizationType: 'placeholder'
        }
      ]
    },

    column: {
      name: 'Column Analysis',
      description: 'Buckling and axial load analysis',
      formulas: [
        {
          title: 'Euler Buckling Load',
          formula: 'Pcr = (π² × E × I) / (K × L)²',
          description: 'Critical buckling load for elastic column',
          interactive: true,
          parameters: [
            { name: 'E', label: 'Elastic Modulus', defaultValue: 200000, units: 'MPa', min: 10000, max: 300000, step: 1000 },
            { name: 'I', label: 'Moment of Inertia', defaultValue: 0.0005, units: 'm⁴', min: 0.0001, max: 0.002, step: 0.0001, precision: 6 },
            { name: 'K', label: 'End Condition Factor', defaultValue: 1.0, units: '', min: 0.5, max: 2.0, step: 0.1, precision: 2 },
            { name: 'L', label: 'Column Length', defaultValue: 4, units: 'm', min: 1, max: 15, step: 0.5 }
          ],
          calculation: (params) => FORMULAS.eulerBucklingLoad(params.E * 1e6, params.I, params.L, params.K),
          resultLabel: 'Critical Load',
          resultUnits: 'N',
          wolframBuilder: (params) => WolframAlpha.COLUMN_ANALYSIS.eulerBuckling(params.E * 1e6, params.I, params.L),
          visualizationType: 'column_buckling'
        },
        {
          title: 'Slenderness Ratio',
          formula: 'λ = (K × L) / r',
          description: 'Column slenderness ratio for stability analysis',
          interactive: true,
          parameters: [
            { name: 'K', label: 'End Condition Factor', defaultValue: 1.0, units: '', min: 0.5, max: 2.0, step: 0.1 },
            { name: 'L', label: 'Column Length', defaultValue: 3, units: 'm', min: 1, max: 12, step: 0.5 },
            { name: 'r', label: 'Radius of Gyration', defaultValue: 0.1, units: 'm', min: 0.01, max: 0.5, step: 0.01 }
          ],
          calculation: (params) => FORMULAS.slendernessRatio(params.K * params.L, params.r),
          resultLabel: 'Slenderness Ratio',
          resultUnits: '',
          wolframBuilder: (params) => WolframAlpha.COLUMN_ANALYSIS.slendernessRatio(params.K * params.L, params.r),
          visualizationType: 'slenderness_chart'
        }
      ]
    },

    dynamics: {
      name: 'Structural Dynamics',
      description: 'Natural frequency and dynamic response',
      formulas: [
        {
          title: 'Natural Frequency',
          formula: 'f = (1/2π) × √(k/m)',
          description: 'Natural frequency of single degree of freedom system',
          interactive: true,
          parameters: [
            { name: 'k', label: 'Stiffness', defaultValue: 50000, units: 'N/m', min: 1000, max: 1000000, step: 1000 },
            { name: 'm', label: 'Mass', defaultValue: 1000, units: 'kg', min: 100, max: 10000, step: 100 }
          ],
          calculation: (params) => FORMULAS.naturalFrequency(params.k, params.m),
          resultLabel: 'Natural Frequency',
          resultUnits: 'Hz',
          wolframBuilder: (params) => WolframAlpha.STRUCTURAL_DYNAMICS.naturalFrequency(params.k, params.m),
          visualizationType: 'frequency_response'
        },
        {
          title: 'Dynamic Amplification Factor',
          formula: 'DAF = 1 / √[(1-r²)² + (2ζr)²]',
          description: 'Dynamic amplification for harmonic loading',
          interactive: true,
          parameters: [
            { name: 'r', label: 'Frequency Ratio', defaultValue: 1.2, units: '', min: 0.1, max: 3.0, step: 0.1 },
            { name: 'zeta', label: 'Damping Ratio', defaultValue: 0.05, units: '', min: 0.01, max: 0.3, step: 0.01 }
          ],
          calculation: (params) => FORMULAS.dynamicAmplification(params.r, params.zeta),
          resultLabel: 'Amplification Factor',
          resultUnits: '',
          wolframBuilder: (params) => WolframAlpha.STRUCTURAL_DYNAMICS.dynamicAmplification(params.r, params.zeta),
          visualizationType: 'amplification_curve'
        }
      ]
    }
  };

  // Canvas visualization based on formula type
  const drawVisualization = (canvas, formulaData, params = {}) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Set up drawing styles
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = '12px Courier New';

    const visualType = formulaData?.visualizationType;
    
    switch (visualType) {
      case 'beam_deflection':
        drawCantileverBeam(ctx, width, height, params);
        break;
      case 'beam_distributed':
        drawSimplySupported(ctx, width, height, params);
        break;
      case 'moment_diagram':
        drawMomentDiagram(ctx, width, height, params);
        break;
      case 'column_buckling':
        drawColumnBuckling(ctx, width, height, params);
        break;
      case 'frequency_response':
        drawFrequencyResponse(ctx, width, height, params);
        break;
      case 'amplification_curve':
        drawAmplificationCurve(ctx, width, height, params);
        break;
      case 'placeholder':
        drawPlaceholder(ctx, width, height, formulaData?.title || 'Formula');
        break;
      default:
        drawPlaceholder(ctx, width, height, 'Visualization');
    }
  };

  // Cantilever beam visualization
  const drawCantileverBeam = (ctx, width, height, params) => {
    const beamY = height * 0.6;
    const beamLength = width * 0.6;
    const beamStart = width * 0.15;
    
    // Draw support (fixed end)
    ctx.fillRect(beamStart - 10, beamY - 30, 20, 60);
    
    // Draw beam
    ctx.strokeRect(beamStart, beamY - 5, beamLength, 10);
    
    // Draw load arrow
    const loadX = beamStart + beamLength;
    ctx.beginPath();
    ctx.moveTo(loadX, beamY - 40);
    ctx.lineTo(loadX, beamY - 10);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(loadX - 5, beamY - 15);
    ctx.lineTo(loadX, beamY - 10);
    ctx.lineTo(loadX + 5, beamY - 15);
    ctx.stroke();
    
    // Draw deflected shape (exaggerated)
    if (params.P && params.L && params.E && params.I) {
      const maxDeflection = FORMULAS.cantileverDeflection(params.P, params.L, params.E * 1e6, params.I);
      const deflectionScale = Math.min(50, Math.abs(maxDeflection * 10000)); // Scale for visibility
      
      ctx.strokeStyle = '#666666';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(beamStart, beamY);
      
      for (let i = 0; i <= 20; i++) {
        const x = beamStart + (beamLength * i / 20);
        const xRatio = i / 20;
        const deflection = deflectionScale * Math.pow(xRatio, 2) * (3 - 2 * xRatio) / 3;
        ctx.lineTo(x, beamY + deflection);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#000000';
      
      // Labels
      ctx.fillText(`P = ${params.P}N`, loadX - 20, beamY - 50);
      ctx.fillText(`L = ${params.L}m`, beamStart + beamLength/2, beamY + 30);
      ctx.fillText(`Max δ = ${(maxDeflection * 1000).toFixed(2)}mm`, 20, 30);
    }
  };

  // Simply supported beam visualization
  const drawSimplySupported = (ctx, width, height, params) => {
    const beamY = height * 0.6;
    const beamLength = width * 0.6;
    const beamStart = width * 0.2;
    
    // Draw supports
    const supportHeight = 30;
    // Left support (pin)
    ctx.beginPath();
    ctx.moveTo(beamStart - 10, beamY + 10);
    ctx.lineTo(beamStart, beamY + 10 + supportHeight);
    ctx.lineTo(beamStart + 10, beamY + 10);
    ctx.closePath();
    ctx.stroke();
    
    // Right support (roller)
    ctx.beginPath();
    ctx.moveTo(beamStart + beamLength - 10, beamY + 10);
    ctx.lineTo(beamStart + beamLength, beamY + 10 + supportHeight);
    ctx.lineTo(beamStart + beamLength + 10, beamY + 10);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(beamStart + beamLength, beamY + 10 + supportHeight + 5, 5, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw beam
    ctx.strokeRect(beamStart, beamY - 5, beamLength, 10);
    
    // Draw distributed load
    const arrowSpacing = 30;
    for (let x = beamStart; x < beamStart + beamLength; x += arrowSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, beamY - 40);
      ctx.lineTo(x, beamY - 10);
      ctx.stroke();
      
      // Arrow heads
      ctx.beginPath();
      ctx.moveTo(x - 3, beamY - 15);
      ctx.lineTo(x, beamY - 10);
      ctx.lineTo(x + 3, beamY - 15);
      ctx.stroke();
    }
    
    // Labels
    if (params.w && params.L) {
      ctx.fillText(`w = ${params.w}N/m`, beamStart + beamLength/2, beamY - 50);
      ctx.fillText(`L = ${params.L}m`, beamStart + beamLength/2, beamY + 50);
      
      const maxDeflection = FORMULAS.simplySupported_centerDeflection(params.w, params.L, params.E * 1e6, params.I);
      ctx.fillText(`Max δ = ${(maxDeflection * 1000).toFixed(2)}mm`, 20, 30);
    }
  };

  // Moment diagram visualization
  const drawMomentDiagram = (ctx, width, height, params) => {
    const beamY = height * 0.4;
    const beamLength = width * 0.6;
    const beamStart = width * 0.2;
    const diagramHeight = height * 0.3;
    
    // Draw beam
    ctx.strokeRect(beamStart, beamY - 5, beamLength, 10);
    
    // Draw moment diagram (parabolic for uniform load)
    if (params.w && params.L) {
      const maxMoment = FORMULAS.maxBendingMoment_distributedLoad(params.w, params.L);
      const momentScale = Math.min(diagramHeight, maxMoment / 10000);
      
      ctx.strokeStyle = '#666666';
      ctx.fillStyle = 'rgba(102, 102, 102, 0.3)';
      
      ctx.beginPath();
      ctx.moveTo(beamStart, beamY + 10);
      
      for (let i = 0; i <= 20; i++) {
        const x = beamStart + (beamLength * i / 20);
        const xPos = (i / 20) * params.L;
        const moment = (params.w * xPos * (params.L - xPos)) / 2;
        const momentHeight = (moment / maxMoment) * momentScale;
        ctx.lineTo(x, beamY + 10 + momentHeight);
      }
      
      ctx.lineTo(beamStart + beamLength, beamY + 10);
      ctx.lineTo(beamStart, beamY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      
      // Labels
      ctx.fillText(`Max M = ${(maxMoment / 1000).toFixed(1)} kN⋅m`, 20, height - 20);
      ctx.fillText('Bending Moment Diagram', beamStart + beamLength/2 - 60, beamY + diagramHeight + 40);
    }
  };

  // Column buckling visualization
  const drawColumnBuckling = (ctx, width, height, params) => {
    const colX = width / 2;
    const colHeight = height * 0.6;
    const colStart = height * 0.15;
    
    // Draw straight column
    ctx.strokeRect(colX - 10, colStart, 20, colHeight);
    
    // Draw buckled shape
    if (params.E && params.I && params.L && params.K) {
      const criticalLoad = FORMULAS.eulerBucklingLoad(params.E * 1e6, params.I, params.L, params.K);
      
      ctx.strokeStyle = '#ff0000';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      const buckling_amplitude = 30; // Visual amplitude
      for (let i = 0; i <= 20; i++) {
        const y = colStart + (colHeight * i / 20);
        const yRatio = i / 20;
        const buckle = buckling_amplitude * Math.sin(Math.PI * yRatio);
        ctx.lineTo(colX + buckle, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#000000';
      
      // Load arrow
      ctx.beginPath();
      ctx.moveTo(colX, colStart - 30);
      ctx.lineTo(colX, colStart - 10);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(colX - 5, colStart - 15);
      ctx.lineTo(colX, colStart - 10);
      ctx.lineTo(colX + 5, colStart - 15);
      ctx.stroke();
      
      // Labels
      ctx.fillText(`L = ${params.L}m`, colX + 30, colStart + colHeight/2);
      ctx.fillText(`Pcr = ${(criticalLoad / 1000).toFixed(0)} kN`, 20, 30);
    }
  };

  // Frequency response visualization
  const drawFrequencyResponse = (ctx, width, height, params) => {
    if (!params.k || !params.m) return;
    
    const freq = FORMULAS.naturalFrequency(params.k, params.m);
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(margin, margin);
    ctx.stroke();
    
    // Draw frequency response curve (simplified)
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxFreq = freq * 3;
    for (let i = 0; i <= 100; i++) {
      const f = (i / 100) * maxFreq;
      const response = 1 / Math.sqrt(Math.pow(1 - Math.pow(f / freq, 2), 2) + Math.pow(0.1 * f / freq, 2));
      const x = margin + (i / 100) * graphWidth;
      const y = height - margin - Math.min(response / 10, 1) * graphHeight;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Mark natural frequency
    const natFreqX = margin + (freq / maxFreq) * graphWidth;
    ctx.strokeStyle = '#ff0000';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(natFreqX, margin);
    ctx.lineTo(natFreqX, height - margin);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Labels
    ctx.fillText('Frequency (Hz)', width/2 - 30, height - 10);
    ctx.save();
    ctx.translate(15, height/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Response', -30, 0);
    ctx.restore();
    
    ctx.fillText(`fn = ${freq.toFixed(2)} Hz`, natFreqX - 30, margin - 10);
  };

  // Dynamic amplification curve
  const drawAmplificationCurve = (ctx, width, height, params) => {
    if (!params.r || !params.zeta) return;
    
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(margin, margin);
    ctx.stroke();
    
    // Draw amplification curve
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxRatio = 3;
    for (let i = 0; i <= 200; i++) {
      const r = (i / 200) * maxRatio;
      const daf = FORMULAS.dynamicAmplification(r, params.zeta);
      const x = margin + (i / 200) * graphWidth;
      const y = height - margin - Math.min(daf / 5, 1) * graphHeight;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Mark current point
    const currentX = margin + (params.r / maxRatio) * graphWidth;
    const currentDAF = FORMULAS.dynamicAmplification(params.r, params.zeta);
    const currentY = height - margin - Math.min(currentDAF / 5, 1) * graphHeight;
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Labels
    ctx.fillText('Frequency Ratio (r)', width/2 - 40, height - 10);
    ctx.fillText(`DAF = ${currentDAF.toFixed(2)}`, currentX - 30, currentY - 15);
  };

  // Placeholder for unimplemented visualizations
  const drawPlaceholder = (ctx, width, height, label = 'Visualization') => {
    // Background
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, width, height);
    
    // Border
    ctx.strokeStyle = '#cccccc';
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.setLineDash([]);
    
    // Development icon
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.font = '48px Courier New';
    ctx.fillText('⚙️', width/2, height/2 - 40);
    
    // Main text
    ctx.fillStyle = '#666666';
    ctx.font = '20px Courier New';
    ctx.fillText(`${label} Visualization`, width/2, height/2 + 10);
    
    // Status text
    ctx.font = '14px Courier New';
    ctx.fillText('Interactive visualization in development', width/2, height/2 + 40);
    
    // Return to original alignment
    ctx.textAlign = 'left';
  };

  // Update canvas when parameters change
  useEffect(() => {
    if (canvasRef.current && formulaCategories[activeCategory]) {
      const activeFormula = formulaCategories[activeCategory].formulas[0]; // For now, use first formula
      drawVisualization(canvasRef.current, activeFormula, {});
    }
  }, [activeCategory, formulaCategories]);

  const categorySelection = (
    <ParameterPanel title="Formula Category">
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(formulaCategories).map(([key, category]) => (
          <ControlButton
            key={key}
            onClick={() => setActiveCategory(key)}
            variant={activeCategory === key ? 'primary' : 'secondary'}
            className="text-sm"
          >
            {category.name}
          </ControlButton>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-mono-200 border border-mono-400">
        <h4 className="text-data-label text-sm mb-1">Description</h4>
        <p className="text-methodology text-xs">
          {formulaCategories[activeCategory]?.description}
        </p>
      </div>
    </ParameterPanel>
  );

  const visualization = (
    <Figure
      title="Interactive Formula Visualization"
      caption="Visual representation of engineering formulas with parameter sensitivity"
    >
      <div className="visualization-container">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-mono-400 bg-mono-100"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </Figure>
  );

  return (
    <SimulationLayout
      title="Formula Visualizer"
      subtitle="Interactive Engineering Formula Explorer"
      parameterPanel={categorySelection}
      visualization={visualization}
    >
      
      {/* Active Formula Library */}
      {formulaCategories[activeCategory] && (
        <FormulaLibrary
          title={`${formulaCategories[activeCategory].name} Formulas`}
          formulas={formulaCategories[activeCategory].formulas}
          className="mt-8"
        />
      )}
      
    </SimulationLayout>
  );
}