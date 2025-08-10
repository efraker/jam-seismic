import React from 'react';

/**
 * Scientific Parameter Panel Component
 * Provides technical input controls with academic styling
 */
export function ParameterPanel({ 
  title, 
  children, 
  className = '',
  variant = 'primary' // 'primary', 'secondary', 'data'
}) {
  const borderColors = {
    primary: 'var(--border-primary)',
    secondary: 'var(--border-secondary)', 
    data: 'var(--border-tertiary)'
  };
  
  return (
    <div className={`parameter-panel ${className}`}>
      <div className="parameter-panel-header">
        <h3 className="text-caps text-sm font-bold">{title}</h3>
      </div>
      
      <div className="parameter-panel-content">
        {children}
      </div>
      
      <style jsx>{`
        .parameter-panel {
          background-color: var(--bg-panel);
          border: var(--border-normal) solid ${borderColors[variant]};
          margin-bottom: var(--spacing-lg);
        }
        
        .parameter-panel-header {
          background-color: var(--bg-tertiary);
          border-bottom: var(--border-thin) solid ${borderColors[variant]};
          padding: var(--spacing-sm) var(--spacing-md);
        }
        
        .parameter-panel-content {
          padding: var(--spacing-md);
        }
      `}</style>
    </div>
  );
}

/**
 * Parameter Input Component
 * Scientific-styled input with label, units, and validation
 */
export function ParameterInput({ 
  label, 
  value, 
  onChange, 
  units, 
  min, 
  max, 
  step, 
  precision = 3,
  description,
  className = ''
}) {
  const handleChange = (e) => {
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className={`parameter-input ${className}`}>
      <label className="text-data-label block mb-1">
        {label}
        {units && <span className="text-units">({units})</span>}
      </label>
      
      <input
        type="number"
        value={value.toFixed(precision)}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="parameter-input-field"
      />
      
      {description && (
        <div className="text-methodology text-xs mt-1">
          {description}
        </div>
      )}
      
      <style jsx>{`
        .parameter-input {
          margin-bottom: var(--spacing-md);
        }
        
        .parameter-input-field {
          width: 100%;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          padding: var(--spacing-sm);
          border: var(--border-thin) solid var(--border-secondary);
          background-color: var(--bg-input);
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        
        .parameter-input-field:focus {
          outline: none;
          border-color: var(--state-focus);
          box-shadow: 0 0 0 1px var(--state-focus);
        }
        
        .parameter-input-field:hover {
          background-color: var(--state-hover);
        }
      `}</style>
    </div>
  );
}

/**
 * Data Display Component
 * Shows calculated values with proper formatting
 */
export function DataDisplay({ 
  label, 
  value, 
  units, 
  precision = 3, 
  className = '' 
}) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toFixed(precision);
    }
    return val;
  };

  return (
    <div className={`data-display ${className}`}>
      <div className="data-display-label text-data-label">
        {label}:
      </div>
      <div className="data-display-value">
        <span className="text-data-value font-mono">
          {formatValue(value)}
        </span>
        {units && <span className="text-units">{units}</span>}
      </div>
      
      <style jsx>{`
        .data-display {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: var(--spacing-xs) 0;
          border-bottom: var(--border-thin) solid var(--border-light);
        }
        
        .data-display:last-child {
          border-bottom: none;
        }
        
        .data-display-label {
          flex: 1;
        }
        
        .data-display-value {
          flex: 0 0 auto;
          text-align: right;
        }
      `}</style>
    </div>
  );
}

/**
 * Control Button Component
 * Scientific-styled buttons for simulation controls
 */
export function ControlButton({ 
  children, 
  onClick, 
  variant = 'primary', // 'primary', 'secondary', 'success', 'danger'
  disabled = false,
  className = '' 
}) {
  const variants = {
    primary: {
      bg: 'var(--bg-tertiary)',
      border: 'var(--border-primary)',
      text: 'var(--text-primary)'
    },
    secondary: {
      bg: 'var(--bg-secondary)',
      border: 'var(--border-secondary)', 
      text: 'var(--text-secondary)'
    },
    success: {
      bg: 'var(--data-series-3)',
      border: 'var(--border-primary)',
      text: 'var(--text-inverse)'
    },
    danger: {
      bg: 'var(--data-series-1)',
      border: 'var(--border-primary)',
      text: 'var(--text-inverse)'
    }
  };
  
  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`control-button ${className}`}
    >
      {children}
      
      <style jsx>{`
        .control-button {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: ${style.bg};
          border: var(--border-normal) solid ${style.border};
          color: ${style.text};
          cursor: pointer;
          transition: all var(--transition-fast) var(--transition-easing);
        }
        
        .control-button:hover:not(:disabled) {
          background-color: var(--state-hover);
          transform: translateY(-1px);
        }
        
        .control-button:active:not(:disabled) {
          background-color: var(--state-active);
          transform: translateY(0);
        }
        
        .control-button:disabled {
          background-color: var(--state-disabled);
          color: var(--text-tertiary);
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}