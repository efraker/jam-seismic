/**
 * Grid System Utilities
 * Functions for creating precise chart gridlines and academic layouts
 */

/**
 * Draw grid lines on canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Object} options - Grid options
 */
export function drawGrid(ctx, width, height, options = {}) {
  const {
    majorSpacing = 40,
    minorSpacing = 8,
    majorColor = '#404040',
    minorColor = '#d4d4d4',
    majorLineWidth = 1,
    minorLineWidth = 0.5,
    showMinor = true,
    showMajor = true,
    offsetX = 0,
    offsetY = 0
  } = options;

  ctx.save();
  
  // Draw minor grid lines
  if (showMinor) {
    ctx.strokeStyle = minorColor;
    ctx.lineWidth = minorLineWidth;
    ctx.setLineDash([]);
    
    // Vertical minor lines
    for (let x = offsetX % minorSpacing; x < width; x += minorSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal minor lines
    for (let y = offsetY % minorSpacing; y < height; y += minorSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  // Draw major grid lines
  if (showMajor) {
    ctx.strokeStyle = majorColor;
    ctx.lineWidth = majorLineWidth;
    ctx.setLineDash([]);
    
    // Vertical major lines
    for (let x = offsetX % majorSpacing; x < width; x += majorSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal major lines
    for (let y = offsetY % majorSpacing; y < height; y += majorSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

/**
 * Create grid overlay for scientific charts
 * @param {number} width - Chart width
 * @param {number} height - Chart height
 * @param {Object} options - Grid configuration
 * @returns {HTMLCanvasElement} Grid canvas element
 */
export function createGridOverlay(width, height, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  drawGrid(ctx, width, height, options);
  
  return canvas;
}

/**
 * Calculate optimal grid spacing based on data range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} targetDivisions - Target number of divisions
 * @returns {Object} Grid spacing configuration
 */
export function calculateGridSpacing(min, max, targetDivisions = 10) {
  const range = max - min;
  const rawSpacing = range / targetDivisions;
  
  // Round to nice numbers (1, 2, 5, 10, 20, 50, etc.)
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawSpacing)));
  const normalized = rawSpacing / magnitude;
  
  let niceSpacing;
  if (normalized <= 1) {
    niceSpacing = magnitude;
  } else if (normalized <= 2) {
    niceSpacing = 2 * magnitude;
  } else if (normalized <= 5) {
    niceSpacing = 5 * magnitude;
  } else {
    niceSpacing = 10 * magnitude;
  }
  
  const gridMin = Math.floor(min / niceSpacing) * niceSpacing;
  const gridMax = Math.ceil(max / niceSpacing) * niceSpacing;
  
  return {
    spacing: niceSpacing,
    min: gridMin,
    max: gridMax,
    divisions: (gridMax - gridMin) / niceSpacing
  };
}

/**
 * Generate tick marks for axes
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} spacing - Tick spacing
 * @returns {Array} Array of tick values
 */
export function generateTicks(min, max, spacing) {
  const ticks = [];
  const start = Math.ceil(min / spacing) * spacing;
  
  for (let value = start; value <= max; value += spacing) {
    // Round to avoid floating point precision issues
    ticks.push(Math.round(value / spacing) * spacing);
  }
  
  return ticks;
}

/**
 * Format tick labels for scientific display
 * @param {number} value - Tick value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted label
 */
export function formatTickLabel(value, options = {}) {
  const {
    precision = 2,
    scientific = false,
    units = '',
    prefix = '',
    suffix = ''
  } = options;
  
  let formatted;
  
  if (scientific && (Math.abs(value) >= 1000 || Math.abs(value) < 0.01)) {
    formatted = value.toExponential(precision);
  } else {
    formatted = value.toFixed(precision);
  }
  
  return `${prefix}${formatted}${suffix}${units}`;
}

/**
 * CSS Grid utilities for academic layouts
 */
export const gridClasses = {
  // Academic figure layouts
  singleFigure: 'grid grid-cols-1 gap-4',
  dualFigure: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  tripleFigure: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  
  // Parameter panel layouts
  parameterGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  denseParameterGrid: 'grid grid-cols-2 md:grid-cols-4 gap-3',
  
  // Data table layouts
  dataTable: 'grid gap-1',
  compactTable: 'grid grid-cols-2 gap-2',
  
  // Responsive breakpoints
  responsive: {
    sm: 'grid-cols-1 sm:grid-cols-2',
    md: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    lg: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
  }
};