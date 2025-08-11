import React, { useState, useRef, useEffect } from 'react';
import { SimulationLayout } from '../../components/layout/AcademicPage';
import { ParameterInput, ParameterPanel, DataDisplay, ControlButton } from '../../components/scientific/ParameterPanel';
import { Figure } from '../../components/scientific/Figure';
import { SOIL_PROPERTIES, FORMULAS } from '../../constants/engineering';
import { FOUNDATION_ANALYSIS } from '../../services/wolframAlpha';
import { createCanvasProps, clearCanvas, setupCanvasContext } from '../../utils/canvasUtils';

export default function SoilStructureInteraction() {
  const canvasRef = useRef(null);
  const [soilType, setSoilType] = useState('dense_sand');
  const [foundationType, setFoundationType] = useState('spread');
  // Future enhancement: seismic zone selection
  // const [seismicZone, setSeismicZone] = useState('moderate');
  const [showStresses, setShowStresses] = useState(true);
  const [showSettlement, setShowSettlement] = useState(true);
  
  // Foundation and loading parameters
  const [parameters, setParameters] = useState({
    columnLoad: 1000, // kN
    foundationWidth: 2.0, // m
    foundationLength: 2.0, // m
    foundationDepth: 1.5, // m
    groundwaterDepth: 5.0, // m
    seismicAcceleration: 0.25 // g
  });

  // Calculated values
  const [results, setResults] = useState({
    bearingPressure: 0,
    allowableBearing: 0,
    safetyFactor: 0,
    settlement: 0,
    seismicResponse: 0
  });

  // Foundation type configurations
  const foundationTypes = {
    spread: {
      name: 'Spread Footing',
      description: 'Shallow foundation for column loads',
      minWidth: 1.0,
      maxWidth: 5.0,
      applicableLoads: [100, 5000]
    },
    strip: {
      name: 'Strip Footing',
      description: 'Continuous footing for wall loads',
      minWidth: 0.5,
      maxWidth: 3.0,
      applicableLoads: [50, 2000]
    },
    mat: {
      name: 'Mat Foundation',
      description: 'Large area foundation for heavy structures',
      minWidth: 5.0,
      maxWidth: 50.0,
      applicableLoads: [1000, 50000]
    },
    pile: {
      name: 'Pile Foundation',
      description: 'Deep foundation through weak soils',
      minWidth: 0.3,
      maxWidth: 2.0,
      applicableLoads: [500, 20000]
    }
  };

  // Calculate foundation performance
  useEffect(() => {
    const SOIL = SOIL_PROPERTIES[soilType];
    const foundationArea = parameters.foundationWidth * parameters.foundationLength;
    
    // Bearing pressure
    const bearingPressure = parameters.columnLoad / foundationArea;
    
    // Allowable bearing capacity (simplified)
    let allowableBearing = SOIL.bearing_capacity;
    
    // Depth factor (simplified)
    const depthFactor = 1 + 0.2 * parameters.foundationDepth;
    allowableBearing *= depthFactor;
    
    // Groundwater reduction
    if (parameters.groundwaterDepth < parameters.foundationDepth + 2) {
      allowableBearing *= 0.8; // Reduce for high groundwater
    }
    
    // Safety factor
    const safetyFactor = allowableBearing / bearingPressure;
    
    // Settlement estimation (simplified)
    const elasticModulus = SOIL.bearing_capacity * 300; // Rough correlation
    const settlement = (bearingPressure * parameters.foundationWidth * 1000) / elasticModulus; // mm
    
    // Seismic response (simplified)
    const seismicResponse = parameters.seismicAcceleration * (800 / SOIL.shearWaveVelocity);
    
    setResults({
      bearingPressure: bearingPressure,
      allowableBearing: allowableBearing,
      safetyFactor: safetyFactor,
      settlement: settlement,
      seismicResponse: seismicResponse
    });
  }, [soilType, parameters]);

  // Canvas drawing
  const drawSoilFoundation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with utility function
    clearCanvas(canvas);
    
    // Set up standard drawing context with larger font for bigger canvas
    setupCanvasContext(ctx, {
      lineWidth: 2,
      font: '16px Courier New'
    });

    // Ground surface
    const groundLevel = height * 0.4;
    
    // Draw soil layers
    drawSoilLayers(ctx, width, height, groundLevel);
    
    // Draw foundation
    drawFoundation(ctx, width, groundLevel);
    
    // Draw structure above ground
    drawStructureAbove(ctx, width, groundLevel);
    
    // Draw stress distribution
    if (showStresses) {
      drawStressDistribution(ctx, width, groundLevel);
    }
    
    // Draw settlement
    if (showSettlement) {
      drawSettlementProfile(ctx, width, groundLevel);
    }
    
    // Draw labels and annotations
    drawLabels(ctx, width, groundLevel);
  };

  const drawSoilLayers = (ctx, width, height, groundLevel) => {
    // const soil = SOIL_PROPERTIES[soilType]; // Currently unused, kept for future enhancements
    
    // Soil layer colors based on type
    const soilColors = {
      rock: '#8B7355',
      dense_sand: '#DEB887',
      soft_clay: '#A0522D'
    };
    
    // Draw main soil layer
    ctx.fillStyle = soilColors[soilType] || '#DEB887';
    ctx.fillRect(0, groundLevel, width, height - groundLevel);
    
    // Add texture/pattern
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, groundLevel + i * 20);
      ctx.lineTo(width, groundLevel + i * 20);
      ctx.stroke();
    }
    
    // Groundwater level
    if (parameters.groundwaterDepth < height / 40) { // Convert to canvas scale
      const gwLevel = groundLevel + parameters.groundwaterDepth * 40;
      ctx.strokeStyle = '#4169E1';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, gwLevel);
      ctx.lineTo(width, gwLevel);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#4169E1';
      ctx.font = '12px Courier New';
      ctx.fillText('Groundwater Level', 10, gwLevel - 5);
    }
    
    // Ground surface line
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundLevel);
    ctx.lineTo(width, groundLevel);
    ctx.stroke();
  };

  const drawFoundation = (ctx, width, groundLevel) => {
    const foundationScale = 40; // pixels per meter
    const foundationWidth = parameters.foundationWidth * foundationScale;
    const foundationDepth = parameters.foundationDepth * foundationScale;
    const foundationX = (width - foundationWidth) / 2;
    const foundationY = groundLevel;

    // Draw foundation
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(foundationX, foundationY, foundationWidth, foundationDepth);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(foundationX, foundationY, foundationWidth, foundationDepth);

    // Foundation reinforcement pattern
    ctx.strokeStyle = '#800000';
    ctx.lineWidth = 1;
    const spacing = 10;
    for (let i = spacing; i < foundationWidth; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(foundationX + i, foundationY);
      ctx.lineTo(foundationX + i, foundationY + foundationDepth);
      ctx.stroke();
    }
    for (let j = spacing; j < foundationDepth; j += spacing) {
      ctx.beginPath();
      ctx.moveTo(foundationX, foundationY + j);
      ctx.lineTo(foundationX + foundationWidth, foundationY + j);
      ctx.stroke();
    }

    // Foundation dimensions
    ctx.fillStyle = '#000000';
    ctx.font = '10px Courier New';
    ctx.fillText(`${parameters.foundationWidth}m × ${parameters.foundationLength}m`, 
                foundationX, foundationY - 5);
    ctx.fillText(`D = ${parameters.foundationDepth}m`, 
                foundationX + foundationWidth + 5, foundationY + foundationDepth/2);
  };

  const drawStructureAbove = (ctx, width, groundLevel) => {
    const foundationScale = 40;
    const foundationWidth = parameters.foundationWidth * foundationScale;
    const foundationX = (width - foundationWidth) / 2;
    
    // Column or wall above foundation
    const structureWidth = foundationWidth * 0.3;
    const structureHeight = 80;
    const structureX = foundationX + (foundationWidth - structureWidth) / 2;
    
    ctx.fillStyle = '#D3D3D3';
    ctx.fillRect(structureX, groundLevel - structureHeight, structureWidth, structureHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(structureX, groundLevel - structureHeight, structureWidth, structureHeight);
    
    // Load arrow
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    const loadX = structureX + structureWidth / 2;
    ctx.beginPath();
    ctx.moveTo(loadX, groundLevel - structureHeight - 40);
    ctx.lineTo(loadX, groundLevel - structureHeight - 5);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(loadX - 5, groundLevel - structureHeight - 10);
    ctx.lineTo(loadX, groundLevel - structureHeight - 5);
    ctx.lineTo(loadX + 5, groundLevel - structureHeight - 10);
    ctx.stroke();
    
    // Load label
    ctx.fillStyle = '#FF0000';
    ctx.font = '12px Courier New';
    ctx.fillText(`P = ${parameters.columnLoad} kN`, loadX - 30, groundLevel - structureHeight - 50);
  };

  const drawStressDistribution = (ctx, width, groundLevel) => {
    const foundationScale = 40;
    const foundationWidth = parameters.foundationWidth * foundationScale;
    const foundationX = (width - foundationWidth) / 2;
    // const stressScale = results.bearingPressure / 10; // Scale for visualization (future use)
    
    // Stress bulb under foundation
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    
    // Draw stress distribution lines
    const numLines = 5;
    for (let i = 1; i <= numLines; i++) {
      const depth = groundLevel + parameters.foundationDepth * foundationScale + i * 20;
      const stressWidth = foundationWidth * (1 + i * 0.3);
      // const stressX = foundationX - (stressWidth - foundationWidth) / 2; // Future use
      
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(foundationX + foundationWidth/2, depth, stressWidth/2, 10, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Stress values
    ctx.fillStyle = '#FF0000';
    ctx.font = '10px Courier New';
    ctx.fillText(`σ = ${results.bearingPressure.toFixed(0)} kPa`, 
                foundationX + foundationWidth + 10, groundLevel + 20);
  };

  const drawSettlementProfile = (ctx, width, groundLevel) => {
    if (results.settlement <= 0) return;
    
    const foundationScale = 40;
    const foundationWidth = parameters.foundationWidth * foundationScale;
    const foundationX = (width - foundationWidth) / 2;
    
    // Settlement profile (simplified)
    ctx.strokeStyle = '#0066CC';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    const settlementScale = Math.min(results.settlement / 2, 20); // Limit visual settlement
    
    ctx.beginPath();
    ctx.moveTo(foundationX - 50, groundLevel);
    
    // Settlement bowl
    for (let x = foundationX - 50; x <= foundationX + foundationWidth + 50; x += 5) {
      let settlement = 0;
      if (x >= foundationX && x <= foundationX + foundationWidth) {
        settlement = settlementScale; // Maximum under foundation
      } else {
        const distance = Math.min(Math.abs(x - foundationX), Math.abs(x - (foundationX + foundationWidth)));
        settlement = settlementScale * Math.exp(-distance / 30);
      }
      ctx.lineTo(x, groundLevel + settlement);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Settlement label
    ctx.fillStyle = '#0066CC';
    ctx.font = '10px Courier New';
    ctx.fillText(`Settlement = ${results.settlement.toFixed(1)} mm`, 
                foundationX, groundLevel + settlementScale + 20);
  };

  const drawLabels = (ctx, width, _groundLevel) => {
    const SOIL = SOIL_PROPERTIES[soilType];
    
    // Soil properties
    ctx.fillStyle = '#000000';
    ctx.font = '12px Courier New';
    ctx.fillText(`Soil: ${SOIL.name}`, 10, 20);
    ctx.fillText(`Vs = ${SOIL.shearWaveVelocity} m/s`, 10, 35);
    ctx.fillText(`qallow = ${SOIL.bearing_capacity} kPa`, 10, 50);
    
    // Foundation type
    ctx.fillText(`Foundation: ${foundationTypes[foundationType].name}`, 10, 80);
    
    // Safety factor indication
    const safetyColor = results.safetyFactor >= 2.5 ? '#00AA00' : 
                       results.safetyFactor >= 2.0 ? '#FFA500' : '#FF0000';
    ctx.fillStyle = safetyColor;
    ctx.fillText(`SF = ${results.safetyFactor.toFixed(2)}`, width - 80, 20);
  };

  // Redraw when parameters change
  useEffect(() => {
    drawSoilFoundation();
  }, [soilType, foundationType, parameters, results, showStresses, showSettlement, drawSoilFoundation]);

  const parameterPanel = (
    <div>
      {/* Soil Type Selection */}
      <ParameterPanel title="Soil Conditions">
        {Object.entries(SOIL_PROPERTIES).map(([key, soil]) => (
          <ControlButton
            key={key}
            onClick={() => setSoilType(key)}
            variant={soilType === key ? 'primary' : 'secondary'}
            className="text-xs mb-2 w-full"
          >
            {soil.name}
          </ControlButton>
        ))}
        
        <div className="mt-3 p-2 bg-mono-200 border">
          <div className="text-data-label text-xs">Selected Soil Properties:</div>
          <div className="text-methodology text-xs">
            • Vs = {SOIL_PROPERTIES[soilType].shearWaveVelocity} m/s<br/>
            • Bearing = {SOIL_PROPERTIES[soilType].bearing_capacity} kPa<br/>
            • {SOIL_PROPERTIES[soilType].description}
          </div>
        </div>
        
        <ParameterInput
          label="Groundwater Depth"
          value={parameters.groundwaterDepth}
          onChange={(value) => setParameters(prev => ({ ...prev, groundwaterDepth: value }))}
          units="m"
          min={1}
          max={20}
          step={0.5}
        />
      </ParameterPanel>

      {/* Foundation Type */}
      <ParameterPanel title="Foundation Type">
        {Object.entries(foundationTypes).map(([key, type]) => (
          <ControlButton
            key={key}
            onClick={() => setFoundationType(key)}
            variant={foundationType === key ? 'primary' : 'secondary'}
            className="text-xs mb-2 w-full"
          >
            {type.name}
          </ControlButton>
        ))}
      </ParameterPanel>

      {/* Foundation Dimensions */}
      <ParameterPanel title="Foundation Sizing">
        <ParameterInput
          label="Width"
          value={parameters.foundationWidth}
          onChange={(value) => setParameters(prev => ({ ...prev, foundationWidth: value }))}
          units="m"
          min={foundationTypes[foundationType].minWidth}
          max={foundationTypes[foundationType].maxWidth}
          step={0.1}
        />
        
        <ParameterInput
          label="Length"
          value={parameters.foundationLength}
          onChange={(value) => setParameters(prev => ({ ...prev, foundationLength: value }))}
          units="m"
          min={foundationTypes[foundationType].minWidth}
          max={foundationTypes[foundationType].maxWidth}
          step={0.1}
        />
        
        <ParameterInput
          label="Depth"
          value={parameters.foundationDepth}
          onChange={(value) => setParameters(prev => ({ ...prev, foundationDepth: value }))}
          units="m"
          min={0.5}
          max={5.0}
          step={0.1}
        />
      </ParameterPanel>

      {/* Loading */}
      <ParameterPanel title="Structural Loading">
        <ParameterInput
          label="Column Load"
          value={parameters.columnLoad}
          onChange={(value) => setParameters(prev => ({ ...prev, columnLoad: value }))}
          units="kN"
          min={foundationTypes[foundationType].applicableLoads[0]}
          max={foundationTypes[foundationType].applicableLoads[1]}
          step={50}
        />
        
        <ParameterInput
          label="Seismic Acceleration"
          value={parameters.seismicAcceleration}
          onChange={(value) => setParameters(prev => ({ ...prev, seismicAcceleration: value }))}
          units="g"
          min={0.1}
          max={0.8}
          step={0.05}
          precision={2}
        />
      </ParameterPanel>
    </div>
  );

  const resultsPanel = (
    <div>
      <ParameterPanel title="Foundation Analysis" variant="data">
        <DataDisplay
          label="Bearing Pressure"
          value={results.bearingPressure}
          units="kPa"
          precision={1}
        />
        
        <DataDisplay
          label="Allowable Bearing"
          value={results.allowableBearing}
          units="kPa"
          precision={1}
        />
        
        <DataDisplay
          label="Safety Factor"
          value={results.safetyFactor}
          precision={2}
        />
        
        <DataDisplay
          label="Settlement"
          value={results.settlement}
          units="mm"
          precision={1}
        />
        
        <DataDisplay
          label="Seismic Amplification"
          value={results.seismicResponse}
          precision={2}
        />
        
        <div className="mt-4 p-3 border" style={{
          backgroundColor: results.safetyFactor >= 2.5 ? '#e6ffe6' : 
                          results.safetyFactor >= 2.0 ? '#fff2e6' : '#ffe6e6',
          borderColor: results.safetyFactor >= 2.5 ? '#00aa00' : 
                      results.safetyFactor >= 2.0 ? '#ff8800' : '#ff0000'
        }}>
          <div className="text-xs font-semibold">
            {results.safetyFactor >= 2.5 ? '✓ ADEQUATE' : 
             results.safetyFactor >= 2.0 ? '⚠ MARGINAL' : '✗ INADEQUATE'}
          </div>
          <div className="text-xs text-methodology mt-1">
            Minimum SF = 2.5 recommended
          </div>
        </div>
      </ParameterPanel>

      {/* Display Options */}
      <ParameterPanel title="Display Options">
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showStresses}
              onChange={(e) => setShowStresses(e.target.checked)}
              className="mr-2"
            />
            <span className="text-data-label text-sm">Show Stress Distribution</span>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showSettlement}
              onChange={(e) => setShowSettlement(e.target.checked)}
              className="mr-2"
            />
            <span className="text-data-label text-sm">Show Settlement Profile</span>
          </div>
        </div>
        
        <div className="mt-4">
          <a
            href={FOUNDATION_ANALYSIS.bearingCapacity(
              0, // cohesion (simplified)
              results.bearingPressure,
              SOIL_PROPERTIES[soilType].density || 1800,
              parameters.foundationDepth
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-data-label hover:text-mono-black text-sm underline"
          >
            Verify with Wolfram Alpha →
          </a>
        </div>
      </ParameterPanel>
    </div>
  );

  const visualization = (
    <Figure
      title="Soil-Structure Interaction Model"
      caption="Foundation behavior under structural loads considering soil properties and seismic effects"
    >
      <canvas
        ref={canvasRef}
        {...createCanvasProps('large')}
      />
    </Figure>
  );

  return (
    <div className="academic-page min-h-screen bg-mono-100 text-mono-black font-mono leading-snug">
      {/* Header */}
      <header className="text-center py-8 border-b-2 border-mono-400 bg-mono-white">
        <h1 className="text-3xl font-bold mb-2">Soil-Structure Interaction</h1>
        <p className="text-lg text-mono-600">Foundation Design with Geotechnical Considerations</p>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Large Visualization Section */}
        <section className="mb-8">
          {visualization}
        </section>

        {/* Controls Section Below */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parameters */}
          <div className="lg:col-span-2">
            {parameterPanel}
          </div>
          
          {/* Results */}
          <div>
            {resultsPanel}
          </div>
        </section>
      
      {/* Educational Content */}
      <section className="panel-scientific p-6 border-precise-2 mt-8">
        <h3 className="text-data-value text-lg mb-4">Foundation Design Principles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-data-label mb-2">Key Design Factors</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• <strong>Bearing Capacity:</strong> Maximum pressure soil can support</li>
              <li>• <strong>Settlement:</strong> Vertical deformation under load</li>
              <li>• <strong>Safety Factor:</strong> Margin against bearing failure</li>
              <li>• <strong>Seismic Response:</strong> Dynamic amplification effects</li>
              <li>• <strong>Groundwater:</strong> Reduces effective stress and capacity</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-data-label mb-2">Foundation Selection</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• <strong>Spread Footings:</strong> Good soil, moderate loads</li>
              <li>• <strong>Strip Footings:</strong> Walls, uniform loading</li>
              <li>• <strong>Mat Foundations:</strong> Poor soil, heavy structures</li>
              <li>• <strong>Pile Foundations:</strong> Very poor surface soils</li>
              <li>• <strong>Deep Foundations:</strong> High loads, weak soils</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-mono-200 border border-mono-400">
          <h4 className="text-data-label mb-2">Seismic Considerations</h4>
          <p className="text-methodology text-sm">
            Seismic forces modify foundation design through soil amplification effects. 
            Softer soils amplify ground motion more than stiff soils. The shear wave velocity 
            (Vs) is a key parameter for determining site amplification factors used in seismic design.
          </p>
        </div>
      </section>
      
      </div>
    </div>
  );
}