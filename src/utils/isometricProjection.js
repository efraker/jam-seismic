/**
 * Isometric and 3D Projection Utilities
 * For creating retro scientific 3D visualizations
 */

/**
 * Isometric projection configuration
 */
export const ISOMETRIC_CONFIG = {
  // Standard isometric angles (30° from horizontal)
  angleX: Math.PI / 6,  // 30 degrees
  angleY: -Math.PI / 6, // -30 degrees
  angleZ: Math.PI / 2,  // 90 degrees (vertical)
  
  // Scale factors for each axis
  scaleX: 0.866,  // cos(30°)
  scaleY: 0.866,  // cos(30°)
  scaleZ: 1.0,    // No scaling for Z axis
  
  // Depth reduction factor
  depthScale: 0.5
};

/**
 * Convert 3D coordinates to isometric 2D coordinates
 * @param {number} x - X coordinate (left-right)
 * @param {number} y - Y coordinate (forward-backward) 
 * @param {number} z - Z coordinate (up-down)
 * @param {Object} config - Projection configuration
 * @returns {Object} 2D coordinates {x, y}
 */
export function project3DToIsometric(x, y, z, config = ISOMETRIC_CONFIG) {
  const {
    angleX,
    angleY, 
    scaleX,
    scaleY,
    scaleZ
  } = config;
  
  // Apply isometric transformation
  const isoX = (x * Math.cos(angleX) - y * Math.cos(angleY)) * scaleX;
  const isoY = (x * Math.sin(angleX) + y * Math.sin(angleY) - z * scaleZ) * scaleY;
  
  return {
    x: isoX,
    y: isoY
  };
}

/**
 * Create a 3D point in space
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} z - Z coordinate
 * @returns {Object} 3D point
 */
export function create3DPoint(x, y, z) {
  return { x, y, z };
}

/**
 * Create a 3D box/cuboid with isometric projection
 * @param {Object} center - Center point {x, y, z}
 * @param {number} width - Width (X dimension)
 * @param {number} depth - Depth (Y dimension)
 * @param {number} height - Height (Z dimension)
 * @param {Object} config - Projection configuration
 * @returns {Object} Box vertices and faces
 */
export function create3DBox(center, width, depth, height, config = ISOMETRIC_CONFIG) {
  const { x: cx, y: cy, z: cz } = center;
  const hw = width / 2;
  const hd = depth / 2;
  const hh = height / 2;
  
  // Define 8 vertices of the box
  const vertices3D = [
    create3DPoint(cx - hw, cy - hd, cz - hh), // 0: bottom-left-back
    create3DPoint(cx + hw, cy - hd, cz - hh), // 1: bottom-right-back
    create3DPoint(cx + hw, cy + hd, cz - hh), // 2: bottom-right-front
    create3DPoint(cx - hw, cy + hd, cz - hh), // 3: bottom-left-front
    create3DPoint(cx - hw, cy - hd, cz + hh), // 4: top-left-back
    create3DPoint(cx + hw, cy - hd, cz + hh), // 5: top-right-back
    create3DPoint(cx + hw, cy + hd, cz + hh), // 6: top-right-front
    create3DPoint(cx - hw, cy + hd, cz + hh)  // 7: top-left-front
  ];
  
  // Project to 2D
  const vertices2D = vertices3D.map(v => 
    project3DToIsometric(v.x, v.y, v.z, config)
  );
  
  // Define faces (clockwise winding for visibility)
  const faces = {
    top: [4, 5, 6, 7],      // Top face
    front: [3, 2, 6, 7],    // Front face
    right: [1, 2, 6, 5],    // Right face
    bottom: [0, 1, 2, 3],   // Bottom face (usually hidden)
    back: [0, 4, 5, 1],     // Back face (usually hidden)
    left: [0, 3, 7, 4]      // Left face
  };
  
  return {
    vertices3D,
    vertices2D,
    faces,
    center: project3DToIsometric(cx, cy, cz, config)
  };
}

/**
 * Draw a 3D box on canvas with proper face ordering
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} box - Box data from create3DBox
 * @param {Object} style - Rendering style options
 */
export function draw3DBox(ctx, box, style = {}) {
  const {
    fillColors = {
      top: '#ffffff',
      front: '#e5e5e5', 
      right: '#d4d4d4'
    },
    strokeColor = '#000000',
    strokeWidth = 2,
    showHiddenEdges = false,
    hiddenEdgeStyle = '#a3a3a3'
  } = style;
  
  const { vertices2D, faces } = box;
  
  ctx.save();
  ctx.lineWidth = strokeWidth;
  
  // Draw visible faces in back-to-front order for proper occlusion
  const visibleFaces = ['right', 'front', 'top'];
  
  visibleFaces.forEach(faceName => {
    const face = faces[faceName];
    const color = fillColors[faceName];
    
    if (color) {
      // Fill face
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(vertices2D[face[0]].x, vertices2D[face[0]].y);
      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(vertices2D[face[i]].x, vertices2D[face[i]].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Stroke face outline
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(vertices2D[face[0]].x, vertices2D[face[0]].y);
    for (let i = 1; i < face.length; i++) {
      ctx.lineTo(vertices2D[face[i]].x, vertices2D[face[i]].y);
    }
    ctx.closePath();
    ctx.stroke();
  });
  
  // Optionally draw hidden edges with dashed lines
  if (showHiddenEdges) {
    ctx.strokeStyle = hiddenEdgeStyle;
    ctx.setLineDash([3, 3]);
    
    const hiddenFaces = ['back', 'left', 'bottom'];
    hiddenFaces.forEach(faceName => {
      const face = faces[faceName];
      ctx.beginPath();
      ctx.moveTo(vertices2D[face[0]].x, vertices2D[face[0]].y);
      for (let i = 1; i < face.length; i++) {
        ctx.lineTo(vertices2D[face[i]].x, vertices2D[face[i]].y);
      }
      ctx.closePath();
      ctx.stroke();
    });
    
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}

/**
 * Create a 3D ribbon/surface for data visualization
 * @param {Array} dataPoints - Array of {x, y, value} points
 * @param {Object} config - Configuration options
 * @returns {Array} 3D ribbon vertices
 */
export function create3DRibbon(dataPoints, config = {}) {
  const {
    ribbonWidth = 10,
    baseZ = 0,
    heightScale = 1
  } = config;
  
  const ribbonVertices = [];
  
  dataPoints.forEach((point) => {
    const { x, y, value } = point;
    const height = value * heightScale;
    
    // Create quad vertices for each data point
    const leftEdge = y - ribbonWidth / 2;
    const rightEdge = y + ribbonWidth / 2;
    
    // Bottom vertices
    ribbonVertices.push(create3DPoint(x, leftEdge, baseZ));
    ribbonVertices.push(create3DPoint(x, rightEdge, baseZ));
    
    // Top vertices
    ribbonVertices.push(create3DPoint(x, leftEdge, baseZ + height));
    ribbonVertices.push(create3DPoint(x, rightEdge, baseZ + height));
  });
  
  return ribbonVertices;
}

/**
 * Transform 3D coordinates with custom rotation
 * @param {Object} point - 3D point {x, y, z}
 * @param {Object} rotation - Rotation angles {rx, ry, rz} in radians
 * @returns {Object} Rotated 3D point
 */
export function rotate3DPoint(point, rotation) {
  const { x, y, z } = point;
  const { rx = 0, ry = 0, rz = 0 } = rotation;
  
  // Rotation around X axis
  let x1 = x;
  let y1 = y * Math.cos(rx) - z * Math.sin(rx);
  let z1 = y * Math.sin(rx) + z * Math.cos(rx);
  
  // Rotation around Y axis
  let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
  let y2 = y1;
  let z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
  
  // Rotation around Z axis
  let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
  let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
  let z3 = z2;
  
  return { x: x3, y: y3, z: z3 };
}