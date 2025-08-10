import React, { useState } from 'react';
import { ParameterInput, DataDisplay, ControlButton } from '../scientific/ParameterPanel';
import * as WolframAlpha from '../../services/wolframAlpha';

/**
 * Formula Display Component
 * Shows mathematical formulas with LaTeX-style rendering using CSS
 */
export function FormulaDisplay({ 
  title,
  formula,
  description,
  variables = {},
  result,
  units,
  wolframQuery,
  className = ''
}) {
  return (
    <div className={`formula-display panel-scientific p-4 border-precise-2 mb-4 ${className}`}>
      
      {/* Formula Title */}
      <h3 className="text-data-value text-lg mb-2">{title}</h3>
      
      {/* Mathematical Formula */}
      <div className="formula-equation bg-mono-100 p-3 border border-mono-300 mb-3">
        <div className="font-mono text-center text-lg">
          {formula}
        </div>
      </div>
      
      {/* Formula Description */}
      {description && (
        <p className="text-methodology mb-3">{description}</p>
      )}
      
      {/* Variable Definitions */}
      {Object.keys(variables).length > 0 && (
        <div className="variables mb-3">
          <h4 className="text-data-label text-sm mb-2">Where:</h4>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(variables).map(([symbol, definition]) => (
              <div key={symbol} className="flex items-start gap-2 text-sm">
                <span className="font-mono text-data-value min-w-[2rem]">{symbol}</span>
                <span className="text-methodology">{definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Result Display */}
      {result !== undefined && (
        <div className="result bg-mono-200 p-2 border border-mono-400 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-data-label">Result:</span>
            <span className="font-mono text-data-value">
              {typeof result === 'number' ? result.toFixed(4) : result}
              {units && <span className="text-units ml-1">{units}</span>}
            </span>
          </div>
        </div>
      )}
      
      {/* Wolfram Alpha Verification Link */}
      {wolframQuery && (
        <div className="text-center mt-3">
          <a 
            href={wolframQuery}
            target="_blank"
            rel="noopener noreferrer"
            className="text-data-label hover:text-mono-black text-sm underline"
          >
            Verify with Wolfram Alpha →
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Formula Component
 * Allows user input and live calculation
 */
export function InteractiveFormula({
  title,
  formula,
  description,
  parameters = [],
  calculation,
  resultLabel = 'Result',
  resultUnits,
  wolframBuilder,
  className = ''
}) {
  // Initialize parameter states
  const [paramValues, setParamValues] = useState(() => {
    const initial = {};
    parameters.forEach(param => {
      initial[param.name] = param.defaultValue || 0;
    });
    return initial;
  });
  
  // Calculate result
  const result = calculation ? calculation(paramValues) : null;
  
  // Generate Wolfram Alpha link
  const wolframLink = wolframBuilder ? wolframBuilder(paramValues) : null;
  
  // Update parameter value
  const updateParameter = (name, value) => {
    setParamValues(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className={`interactive-formula panel-scientific border-precise-2 ${className}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-mono-300">
        <h3 className="text-data-value text-lg mb-2">{title}</h3>
        
        {/* Formula Display */}
        <div className="formula-equation bg-mono-100 p-3 border border-mono-300 mb-3">
          <div className="font-mono text-center">
            {formula}
          </div>
        </div>
        
        {description && (
          <p className="text-methodology">{description}</p>
        )}
      </div>
      
      {/* Parameters Section */}
      <div className="p-4 border-b border-mono-300">
        <h4 className="text-data-label mb-3">Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parameters.map(param => (
            <ParameterInput
              key={param.name}
              label={param.label}
              value={paramValues[param.name]}
              onChange={(value) => updateParameter(param.name, value)}
              units={param.units}
              min={param.min}
              max={param.max}
              step={param.step}
              precision={param.precision}
              description={param.description}
            />
          ))}
        </div>
      </div>
      
      {/* Results Section */}
      <div className="p-4">
        <h4 className="text-data-label mb-3">Result</h4>
        
        {result !== null && (
          <DataDisplay
            label={resultLabel}
            value={result}
            units={resultUnits}
            precision={4}
            className="mb-4"
          />
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          {wolframLink && (
            <ControlButton
              onClick={() => window.open(wolframLink, '_blank')}
              variant="secondary"
            >
              Verify with Wolfram Alpha
            </ControlButton>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Formula Library Component
 * Collection of related formulas
 */
export function FormulaLibrary({ 
  title,
  formulas = [],
  className = '' 
}) {
  const [activeFormula, setActiveFormula] = useState(0);
  
  return (
    <div className={`formula-library ${className}`}>
      
      {/* Library Header */}
      <div className="mb-6">
        <h2 className="text-figure-title mb-2">{title}</h2>
        <p className="text-methodology">Select a formula to explore its calculation and verification</p>
      </div>
      
      {/* Formula Navigation */}
      <div className="formula-tabs mb-6">
        <div className="flex flex-wrap gap-2">
          {formulas.map((formula, index) => (
            <button
              key={index}
              onClick={() => setActiveFormula(index)}
              className={`formula-tab px-3 py-2 text-sm border-2 transition-all ${
                activeFormula === index 
                  ? 'bg-mono-300 border-mono-black text-mono-black' 
                  : 'bg-mono-100 border-mono-400 text-mono-700 hover:bg-mono-200'
              }`}
            >
              {formula.title}
            </button>
          ))}
        </div>
      </div>
      
      {/* Active Formula Display */}
      {formulas[activeFormula] && (
        <div className="active-formula">
          {formulas[activeFormula].interactive ? (
            <InteractiveFormula {...formulas[activeFormula]} />
          ) : (
            <FormulaDisplay {...formulas[activeFormula]} />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick Formula Reference
 * Compact formula display for reference panels
 */
export function QuickFormulaReference({ formulas = [], className = '' }) {
  return (
    <div className={`quick-formulas panel-scientific p-4 border-precise-2 ${className}`}>
      <h4 className="text-data-label mb-3">Quick Reference</h4>
      
      {formulas.map((formula, index) => (
        <div key={index} className="formula-ref mb-3 pb-2 border-b border-mono-300 last:border-b-0">
          <div className="flex justify-between items-start mb-1">
            <span className="text-data-value text-sm font-semibold">{formula.name}</span>
            {formula.wolframQuery && (
              <a 
                href={formula.wolframQuery}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-data-label hover:text-mono-black"
                title="Verify with Wolfram Alpha"
              >
                W|A
              </a>
            )}
          </div>
          <div className="font-mono text-xs text-methodology mb-1">
            {formula.expression}
          </div>
          {formula.description && (
            <div className="text-xs text-methodology">
              {formula.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}