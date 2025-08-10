import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Academic Page Layout Component
 * Provides consistent academic paper styling for all pages
 */
export function AcademicPage({ 
  title, 
  subtitle, 
  author = "Jerome Maurseth, P.E., US ACE, Ret'd.",
  children,
  showBackButton = true,
  headerActions
}) {
  return (
    <div className="min-h-screen bg-mono-white text-mono-black font-mono">
      <div className="max-w-4xl mx-auto p-8 space-academic">
        
        {/* Navigation */}
        {showBackButton && (
          <nav className="mb-6">
            <Link 
              to="/" 
              className="text-data-label hover:text-mono-black transition-colors duration-100 text-sm"
            >
              ← Back to Simulations
            </Link>
          </nav>
        )}
        
        {/* Page Header - Academic Paper Style */}
        <header className="text-center border-b-2 border-mono-black pb-6 mb-8">
          <h1 className="heading-primary text-caps tracking-scientific mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-data-label mb-2">{subtitle}</p>
          )}
          <p className="text-reference">{author}</p>
          
          {/* Optional header actions */}
          {headerActions && (
            <div className="mt-4 flex justify-center gap-4">
              {headerActions}
            </div>
          )}
        </header>
        
        {/* Main Content */}
        <main>
          {children}
        </main>
        
        {/* Footer - Academic Paper Style */}
        <footer className="mt-16 pt-8 border-t border-mono-300 text-center">
          <p className="text-reference">© 2025 Civil Engineering Educational Platform</p>
        </footer>
      </div>
    </div>
  );
}

/**
 * Simulation Layout Component
 * Specialized layout for interactive simulations
 */
export function SimulationLayout({ 
  title, 
  subtitle,
  children,
  parameterPanel,
  visualization,
  resultsPanel,
  showBackButton = true
}) {
  return (
    <AcademicPage 
      title={title} 
      subtitle={subtitle}
      showBackButton={showBackButton}
    >
      {/* Custom simulation grid layout */}
      <div className="simulation-container">
        
        {/* Parameters Section */}
        {parameterPanel && (
          <aside className="simulation-parameters">
            <h2 className="text-figure-title mb-4">Parameters</h2>
            {parameterPanel}
          </aside>
        )}
        
        {/* Main Visualization */}
        <section className="simulation-visualization">
          <h2 className="text-figure-title mb-4">Visualization</h2>
          {visualization}
        </section>
        
        {/* Results Panel */}
        {resultsPanel && (
          <aside className="simulation-results">
            <h2 className="text-figure-title mb-4">Results</h2>
            {resultsPanel}
          </aside>
        )}
        
        {/* Additional Content */}
        {children && (
          <section className="simulation-content">
            {children}
          </section>
        )}
        
      </div>
      
      <style jsx>{`
        .simulation-container {
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          grid-template-rows: auto auto;
          gap: var(--spacing-2xl);
          margin: var(--spacing-2xl) 0;
        }
        
        .simulation-parameters {
          grid-column: 1;
          grid-row: 1;
        }
        
        .simulation-visualization {
          grid-column: 2;
          grid-row: 1;
          min-height: 400px;
        }
        
        .simulation-results {
          grid-column: 3;
          grid-row: 1;
        }
        
        .simulation-content {
          grid-column: 1 / -1;
          grid-row: 2;
          margin-top: var(--spacing-3xl);
        }
        
        /* Responsive layout */
        @media (max-width: 1200px) {
          .simulation-container {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto auto;
          }
          
          .simulation-parameters {
            grid-column: 1;
            grid-row: 1;
          }
          
          .simulation-results {
            grid-column: 2;
            grid-row: 1;
          }
          
          .simulation-visualization {
            grid-column: 1 / -1;
            grid-row: 2;
          }
          
          .simulation-content {
            grid-column: 1 / -1;
            grid-row: 3;
          }
        }
        
        @media (max-width: 768px) {
          .simulation-container {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, auto);
          }
          
          .simulation-parameters,
          .simulation-results,
          .simulation-visualization,
          .simulation-content {
            grid-column: 1;
          }
          
          .simulation-parameters { grid-row: 1; }
          .simulation-visualization { grid-row: 2; }
          .simulation-results { grid-row: 3; }
          .simulation-content { grid-row: 4; }
        }
      `}</style>
    </AcademicPage>
  );
}