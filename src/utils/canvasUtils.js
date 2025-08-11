/**
 * Canvas Utilities for JAM Seismic Simulations
 * Provides standardized canvas sizing and configuration for consistent visualizations
 */

// Standard canvas dimensions for different simulation types
export const CANVAS_SIZES = {
  // Large canvas for complex visualizations (Load Path Tracer, Soil-Structure)
  large: {
    width: 1200,
    height: 800,
    className: "border-2 border-mono-400 bg-mono-100 w-full max-w-none"
  },
  
  // Medium canvas for formula visualizations
  medium: {
    width: 900,
    height: 600,
    className: "border-2 border-mono-400 bg-mono-100 w-full max-w-none"
  },
  
  // Small canvas for compact visualizations
  small: {
    width: 600,
    height: 400,
    className: "border-2 border-mono-400 bg-mono-100 w-full"
  }
};

/**
 * Get canvas configuration for a simulation type
 * @param {string} type - Canvas size type ('large', 'medium', 'small')
 * @returns {object} Canvas configuration object
 */
export function getCanvasConfig(type = 'medium') {
  return CANVAS_SIZES[type] || CANVAS_SIZES.medium;
}

/**
 * Apply standard drawing setup to canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {object} options - Drawing options
 */
export function setupCanvasContext(ctx, options = {}) {
  const defaults = {
    strokeStyle: '#000000',
    fillStyle: '#000000',
    lineWidth: 2,
    font: '12px Courier New',
    textAlign: 'left',
    textBaseline: 'alphabetic'
  };
  
  const settings = { ...defaults, ...options };
  
  Object.keys(settings).forEach(key => {
    ctx[key] = settings[key];
  });
}

/**
 * Clear canvas with standard background
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} backgroundColor - Background color (default: white)
 */
export function clearCanvas(canvas, backgroundColor = '#ffffff') {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw academic-style grid on canvas (optional for engineering drawings)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} gridSize - Grid spacing in pixels
 * @param {string} gridColor - Grid line color
 */
export function drawGrid(ctx, width, height, gridSize = 20, gridColor = '#f0f0f0') {
  const originalStrokeStyle = ctx.strokeStyle;
  const originalLineWidth = ctx.lineWidth;
  
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Restore original styles
  ctx.strokeStyle = originalStrokeStyle;
  ctx.lineWidth = originalLineWidth;
}

/**
 * Create a responsive canvas component props object
 * @param {string} sizeType - Canvas size type
 * @param {object} additionalProps - Additional canvas props
 * @returns {object} Canvas props object
 */
export function createCanvasProps(sizeType = 'medium', additionalProps = {}) {
  const config = getCanvasConfig(sizeType);
  
  return {
    width: config.width,
    height: config.height,
    className: config.className,
    style: { 
      width: '100%', 
      height: 'auto',
      maxWidth: 'none' // Allow full width scaling
    },
    ...additionalProps
  };
}