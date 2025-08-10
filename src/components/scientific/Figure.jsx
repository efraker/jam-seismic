import React, { createContext, useContext, useState } from 'react';

/**
 * Figure Context for automatic numbering
 */
const FigureContext = createContext();

export function FigureProvider({ children }) {
  const [figureCount, setFigureCount] = useState(0);
  
  const getNextFigureNumber = () => {
    setFigureCount(prev => prev + 1);
    return figureCount + 1;
  };
  
  return (
    <FigureContext.Provider value={{ getNextFigureNumber }}>
      {children}
    </FigureContext.Provider>
  );
}

/**
 * Scientific Figure Component
 * Provides automatic numbering, academic formatting, and standardized layout
 */
export function Figure({ 
  title, 
  caption, 
  methodology,
  children, 
  className = '',
  figureNumber 
}) {
  const context = useContext(FigureContext);
  const autoFigureNumber = figureNumber || (context ? context.getNextFigureNumber() : 1);
  
  return (
    <div className={`figure-container ${className}`}>
      {/* Figure Title */}
      <div className="text-figure-title">
        FIGURE {autoFigureNumber}. {title}
      </div>
      
      {/* Figure Content */}
      <div className="figure-content bg-chart-background border-2 border-border-primary">
        {children}
      </div>
      
      {/* Figure Caption */}
      {caption && (
        <div className="text-figure-caption">
          <strong>Fig. {autoFigureNumber}.</strong> {caption}
          {methodology && (
            <div className="text-methodology mt-2">
              Methodology: {methodology}
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .figure-container {
          margin: var(--spacing-2xl) 0;
          max-width: var(--figure-max-width);
        }
        
        .figure-content {
          background-color: var(--chart-background);
          border: var(--border-normal) solid var(--border-primary);
          padding: var(--chart-padding);
          margin: var(--spacing-md) 0;
        }
        
        @media (max-width: 768px) {
          .figure-container {
            margin: var(--spacing-xl) 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Sub-figure component for multi-part figures
 */
export function SubFigure({ label, children, className = '' }) {
  return (
    <div className={`subfigure ${className}`}>
      <div className="subfigure-label text-data-label">
        ({label})
      </div>
      <div className="subfigure-content">
        {children}
      </div>
      
      <style jsx>{`
        .subfigure {
          display: inline-block;
          margin: var(--spacing-sm);
          vertical-align: top;
        }
        
        .subfigure-label {
          text-align: center;
          margin-bottom: var(--spacing-xs);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}