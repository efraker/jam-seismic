import React, { useState, useRef, useEffect } from 'react';
import { SimulationLayout } from '../../components/layout/AcademicPage';
import { ParameterInput, ParameterPanel, DataDisplay, ControlButton } from '../../components/scientific/ParameterPanel';
import { Figure } from '../../components/scientific/Figure';

export default function LoadPathTracer() {
  const canvasRef = useRef(null);
  const [structureType, setStructureType] = useState('frame');
  // Future enhancement: different load types
  // const [loadType, setLoadType] = useState('point');
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [showForces, setShowForces] = useState(true);
  const [showMoments, setShowMoments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  
  // Load and structural parameters
  const [parameters, setParameters] = useState({
    appliedLoad: 50, // kN
    loadPosition: 0.5, // normalized position along span
    beamLength: 8, // meters
    columnHeight: 4, // meters
    elasticModulus: 200000, // MPa
    momentOfInertia: 0.0002 // m^4
  });

  // Structure configurations
  const structureTypes = {
    frame: {
      name: 'Rigid Frame',
      description: 'Moment-resisting frame with fixed connections',
      components: ['beam', 'columns', 'connections']
    },
    truss: {
      name: 'Truss System',
      description: 'Pin-connected members in tension and compression',
      components: ['top_chord', 'bottom_chord', 'web_members']
    },
    shear_wall: {
      name: 'Shear Wall',
      description: 'Cantilever wall resisting lateral forces',
      components: ['wall', 'foundation', 'coupling_beams']
    },
    simple_beam: {
      name: 'Simple Beam',
      description: 'Simply supported beam with point or distributed loads',
      components: ['beam', 'supports']
    }
  };

  // Animation loop for load path visualization
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setAnimationTime(prev => (prev + 0.02 * animationSpeed) % 1);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isAnimating, animationSpeed]);

  // Canvas drawing function
  const drawStructure = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Set drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = '12px Courier New';

    switch (structureType) {
      case 'frame':
        drawRigidFrame(ctx, width, height);
        break;
      case 'truss':
        drawTruss(ctx, width, height);
        break;
      case 'shear_wall':
        drawShearWall(ctx, width, height);
        break;
      case 'simple_beam':
        drawSimpleBeam(ctx, width, height);
        break;
    }
  };

  const drawRigidFrame = (ctx, width, height) => {
    const frameWidth = width * 0.6;
    const frameHeight = height * 0.6;
    const startX = width * 0.2;
    const startY = height * 0.7;
    const beamY = startY - frameHeight;

    // Draw columns
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, beamY);
    ctx.moveTo(startX + frameWidth, startY);
    ctx.lineTo(startX + frameWidth, beamY);
    ctx.stroke();

    // Draw beam
    ctx.beginPath();
    ctx.moveTo(startX, beamY);
    ctx.lineTo(startX + frameWidth, beamY);
    ctx.stroke();

    // Draw moment connections (small squares)
    const connectionSize = 8;
    ctx.fillStyle = '#000000';
    ctx.fillRect(startX - connectionSize/2, beamY - connectionSize/2, connectionSize, connectionSize);
    ctx.fillRect(startX + frameWidth - connectionSize/2, beamY - connectionSize/2, connectionSize, connectionSize);

    // Draw applied load
    const loadX = startX + frameWidth * parameters.loadPosition;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    
    // Load arrow
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

    // Draw load path with animation
    if (isAnimating) {
      drawLoadPath(ctx, startX, startY, frameWidth, frameHeight, loadX, beamY);
    }

    // Labels
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`P = ${parameters.appliedLoad} kN`, loadX - 20, beamY - 50);
    ctx.fillStyle = '#000000';
    ctx.fillText(`L = ${parameters.beamLength}m`, startX + frameWidth/2 - 20, beamY + 20);
    ctx.fillText(`H = ${parameters.columnHeight}m`, startX - 40, beamY + frameHeight/2);
    
    // Reactions
    if (showForces) {
      drawReactions(ctx, startX, startY, startX + frameWidth, startY);
    }
  };

  const drawTruss = (ctx, width, height) => {
    const trussWidth = width * 0.7;
    const trussHeight = height * 0.3;
    const startX = width * 0.15;
    const topY = height * 0.3;
    const bottomY = topY + trussHeight;

    // Number of panels
    const panels = 4;
    const panelWidth = trussWidth / panels;

    // Draw top chord
    ctx.beginPath();
    ctx.moveTo(startX, topY);
    ctx.lineTo(startX + trussWidth, topY);
    ctx.stroke();

    // Draw bottom chord
    ctx.beginPath();
    ctx.moveTo(startX, bottomY);
    ctx.lineTo(startX + trussWidth, bottomY);
    ctx.stroke();

    // Draw web members
    for (let i = 0; i <= panels; i++) {
      const x = startX + i * panelWidth;
      
      // Vertical members
      if (i < panels) {
        ctx.beginPath();
        ctx.moveTo(x + panelWidth/2, topY);
        ctx.lineTo(x + panelWidth/2, bottomY);
        ctx.stroke();
      }
      
      // Diagonal members
      if (i < panels) {
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x + panelWidth, bottomY);
        ctx.moveTo(x + panelWidth, topY);
        ctx.lineTo(x, bottomY);
        ctx.stroke();
      }
    }

    // Draw supports
    drawTrussSupports(ctx, startX, bottomY, startX + trussWidth, bottomY);

    // Applied loads at joints
    for (let i = 1; i < panels; i++) {
      const loadX = startX + i * panelWidth;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(loadX, topY - 30);
      ctx.lineTo(loadX, topY - 5);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(loadX - 3, topY - 10);
      ctx.lineTo(loadX, topY - 5);
      ctx.lineTo(loadX + 3, topY - 10);
      ctx.stroke();
    }

    // Show member forces with animation
    if (isAnimating && showForces) {
      drawTrussForces(ctx, startX, topY, trussWidth, trussHeight, panels);
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  };

  const drawShearWall = (ctx, width, height) => {
    const wallWidth = width * 0.15;
    const wallHeight = height * 0.6;
    const wallX = width * 0.4;
    const wallY = height * 0.7;

    // Draw wall
    ctx.strokeRect(wallX, wallY - wallHeight, wallWidth, wallHeight);

    // Draw foundation
    const foundationHeight = 20;
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(wallX - wallWidth * 0.5, wallY, wallWidth * 2, foundationHeight);
    ctx.strokeRect(wallX - wallWidth * 0.5, wallY, wallWidth * 2, foundationHeight);

    // Draw lateral load
    const loadY = wallY - wallHeight * 0.7;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(wallX - 60, loadY);
    ctx.lineTo(wallX - 10, loadY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(wallX - 15, loadY - 4);
    ctx.lineTo(wallX - 10, loadY);
    ctx.lineTo(wallX - 15, loadY + 4);
    ctx.stroke();

    // Draw deformed shape with animation
    if (isAnimating) {
      ctx.strokeStyle = '#666666';
      ctx.setLineDash([5, 5]);
      
      const maxDeflection = 20; // pixels
      ctx.beginPath();
      ctx.moveTo(wallX, wallY);
      
      for (let i = 0; i <= 20; i++) {
        const y = wallY - (wallHeight * i / 20);
        const heightRatio = i / 20;
        const deflection = maxDeflection * Math.pow(heightRatio, 2) * animationTime;
        ctx.lineTo(wallX + deflection, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`H = ${parameters.appliedLoad} kN`, wallX - 80, loadY - 10);
  };

  const drawSimpleBeam = (ctx, width, height) => {
    const beamLength = width * 0.6;
    const beamY = height * 0.5;
    const startX = width * 0.2;

    // Draw beam
    ctx.strokeRect(startX, beamY - 5, beamLength, 10);

    // Draw supports
    drawSimpleSupports(ctx, startX, beamY, startX + beamLength, beamY);

    // Draw load
    const loadX = startX + beamLength * parameters.loadPosition;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    
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

    // Draw deflected shape
    if (isAnimating) {
      ctx.strokeStyle = '#666666';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      const maxDeflection = 15;
      for (let i = 0; i <= 50; i++) {
        const x = startX + (beamLength * i / 50);
        const position = i / 50;
        let deflection;
        
        if (position <= parameters.loadPosition) {
          deflection = maxDeflection * position * (3 * parameters.loadPosition - position) / (6 * parameters.loadPosition) * animationTime;
        } else {
          deflection = maxDeflection * (1 - position) * (3 * (1 - parameters.loadPosition) - (1 - position)) / (6 * (1 - parameters.loadPosition)) * animationTime;
        }
        
        if (i === 0) ctx.moveTo(x, beamY + deflection);
        else ctx.lineTo(x, beamY + deflection);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  };

  // Helper functions for drawing supports and load paths
  const drawLoadPath = (ctx, startX, startY, frameWidth, frameHeight, loadX, beamY) => {
    const progress = animationTime;
    
    // Path 1: Load to left support
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    
    const path1Length = (loadX - startX) + frameHeight;
    const path1Progress = Math.min(progress * path1Length, path1Length);
    
    ctx.beginPath();
    ctx.moveTo(loadX, beamY);
    if (path1Progress > (loadX - startX)) {
      ctx.lineTo(startX, beamY);
      ctx.lineTo(startX, beamY + Math.min(path1Progress - (loadX - startX), frameHeight));
    } else {
      ctx.lineTo(loadX - path1Progress, beamY);
    }
    ctx.stroke();
    
    // Path 2: Load to right support
    ctx.strokeStyle = '#0066ff';
    const path2Length = (startX + frameWidth - loadX) + frameHeight;
    const path2Progress = Math.min(progress * path2Length, path2Length);
    
    ctx.beginPath();
    ctx.moveTo(loadX, beamY);
    if (path2Progress > (startX + frameWidth - loadX)) {
      ctx.lineTo(startX + frameWidth, beamY);
      ctx.lineTo(startX + frameWidth, beamY + Math.min(path2Progress - (startX + frameWidth - loadX), frameHeight));
    } else {
      ctx.lineTo(loadX + path2Progress, beamY);
    }
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawReactions = (ctx, leftX, leftY, rightX, rightY) => {
    const reactionScale = 2; // Scale factor for reaction arrows
    const leftReaction = parameters.appliedLoad * (1 - parameters.loadPosition) * reactionScale;
    const rightReaction = parameters.appliedLoad * parameters.loadPosition * reactionScale;
    
    // Left reaction
    ctx.strokeStyle = '#00aa00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX, leftY);
    ctx.lineTo(leftX, leftY - leftReaction);
    ctx.stroke();
    
    // Right reaction
    ctx.beginPath();
    ctx.moveTo(rightX, rightY);
    ctx.lineTo(rightX, rightY - rightReaction);
    ctx.stroke();
    
    ctx.fillStyle = '#00aa00';
    ctx.font = '10px Courier New';
    ctx.fillText(`R₁=${(parameters.appliedLoad * (1 - parameters.loadPosition)).toFixed(1)}kN`, leftX - 20, leftY - leftReaction - 5);
    ctx.fillText(`R₂=${(parameters.appliedLoad * parameters.loadPosition).toFixed(1)}kN`, rightX - 20, rightY - rightReaction - 5);
  };

  const drawSimpleSupports = (ctx, leftX, leftY, rightX, rightY) => {
    const supportHeight = 20;
    
    // Left support (pin)
    ctx.beginPath();
    ctx.moveTo(leftX - 10, leftY + 10);
    ctx.lineTo(leftX, leftY + 10 + supportHeight);
    ctx.lineTo(leftX + 10, leftY + 10);
    ctx.closePath();
    ctx.stroke();
    
    // Right support (roller)
    ctx.beginPath();
    ctx.moveTo(rightX - 10, rightY + 10);
    ctx.lineTo(rightX, rightY + 10 + supportHeight);
    ctx.lineTo(rightX + 10, rightY + 10);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(rightX, rightY + 10 + supportHeight + 5, 3, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawTrussSupports = (ctx, leftX, leftY, rightX, rightY) => {
    drawSimpleSupports(ctx, leftX, leftY, rightX, rightY);
  };

  const drawTrussForces = (ctx, startX, topY, trussWidth, trussHeight, panels) => {
    // Simplified truss force visualization
    const panelWidth = trussWidth / panels;
    
    ctx.font = '10px Courier New';
    
    for (let i = 0; i < panels; i++) {
      const x = startX + i * panelWidth + panelWidth/2;
      
      // Top chord (compression - red)
      ctx.fillStyle = '#ff0000';
      ctx.fillText('C', x - 5, topY - 5);
      
      // Bottom chord (tension - blue)  
      ctx.fillStyle = '#0000ff';
      ctx.fillText('T', x - 5, topY + trussHeight + 15);
      
      // Web members alternate
      ctx.fillStyle = i % 2 === 0 ? '#ff0000' : '#0000ff';
      ctx.fillText(i % 2 === 0 ? 'C' : 'T', x - 5, topY + trussHeight/2);
    }
  };

  // Redraw when parameters change
  useEffect(() => {
    drawStructure();
  }, [structureType, parameters, animationTime, showForces, showMoments, drawStructure]);

  const parameterPanel = (
    <div>
      {/* Structure Type Selection */}
      <ParameterPanel title="Structure Type">
        {Object.entries(structureTypes).map(([key, type]) => (
          <ControlButton
            key={key}
            onClick={() => setStructureType(key)}
            variant={structureType === key ? 'primary' : 'secondary'}
            className="text-xs mb-2 w-full"
          >
            {type.name}
          </ControlButton>
        ))}
        
        <div className="mt-3 p-2 bg-mono-200 border">
          <div className="text-data-label text-xs mb-1">Description:</div>
          <div className="text-methodology text-xs">
            {structureTypes[structureType]?.description}
          </div>
        </div>
      </ParameterPanel>

      {/* Load Parameters */}
      <ParameterPanel title="Loading">
        <ParameterInput
          label="Applied Load"
          value={parameters.appliedLoad}
          onChange={(value) => setParameters(prev => ({ ...prev, appliedLoad: value }))}
          units="kN"
          min={10}
          max={200}
          step={5}
        />
        
        <ParameterInput
          label="Load Position"
          value={parameters.loadPosition}
          onChange={(value) => setParameters(prev => ({ ...prev, loadPosition: value }))}
          units="(0=left, 1=right)"
          min={0}
          max={1}
          step={0.1}
          precision={2}
        />
      </ParameterPanel>

      {/* Display Options */}
      <ParameterPanel title="Display Options">
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showForces}
              onChange={(e) => setShowForces(e.target.checked)}
              className="mr-2"
            />
            <span className="text-data-label text-sm">Show Forces</span>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showMoments}
              onChange={(e) => setShowMoments(e.target.checked)}
              className="mr-2"
            />
            <span className="text-data-label text-sm">Show Moments</span>
          </div>
        </div>
        
        <ParameterInput
          label="Animation Speed"
          value={animationSpeed}
          onChange={setAnimationSpeed}
          min={0.1}
          max={3.0}
          step={0.1}
          precision={1}
        />
        
        <ControlButton
          onClick={() => setIsAnimating(!isAnimating)}
          variant={isAnimating ? 'danger' : 'success'}
          className="w-full mt-3"
        >
          {isAnimating ? 'Stop Animation' : 'Start Load Path Animation'}
        </ControlButton>
      </ParameterPanel>
    </div>
  );

  const visualization = (
    <Figure
      title="Load Path Visualization"
      caption="Interactive demonstration of how forces travel through different structural systems"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border-2 border-mono-400 bg-mono-100 w-full"
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center">
          <div className="w-4 h-1 bg-red-600 mr-2"></div>
          <span>Applied Load</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-orange-600 mr-2"></div>
          <span>Load Path 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-600 mr-2"></div>
          <span>Load Path 2</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-green-600 mr-2"></div>
          <span>Reactions</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 border border-gray-600" style={{borderStyle: 'dashed'}}></div>
          <span className="ml-2">Deformed Shape</span>
        </div>
      </div>
    </Figure>
  );

  return (
    <SimulationLayout
      title="Load Path Tracer"
      subtitle="Visualizing Force Flow Through Structural Systems"
      parameterPanel={parameterPanel}
      visualization={visualization}
    >
      
      {/* Educational Content */}
      <section className="panel-scientific p-6 border-precise-2 mt-8">
        <h3 className="text-data-value text-lg mb-4">Understanding Load Paths</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-data-label mb-2">Key Concepts</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• <strong>Load Path:</strong> Route forces take from application to foundation</li>
              <li>• <strong>Stiffness:</strong> Controls distribution of forces between elements</li>
              <li>• <strong>Continuity:</strong> Ensures forces have complete path to supports</li>
              <li>• <strong>Redundancy:</strong> Multiple paths provide backup if one fails</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-data-label mb-2">Structural Systems</h4>
            <ul className="text-methodology text-sm space-y-1">
              <li>• <strong>Frames:</strong> Moment connections allow force redistribution</li>
              <li>• <strong>Trusses:</strong> Pin connections create predictable force paths</li>
              <li>• <strong>Shear Walls:</strong> Resist lateral forces through cantilever action</li>
              <li>• <strong>Simple Beams:</strong> Direct load transfer to supports</li>
            </ul>
          </div>
        </div>
      </section>
      
    </SimulationLayout>
  );
}