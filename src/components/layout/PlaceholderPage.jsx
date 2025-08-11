import React from 'react';
import { AcademicPage } from './AcademicPage';
import { ControlButton } from '../scientific/ParameterPanel';

export function PlaceholderPage({ 
  title, 
  subtitle = "Feature in Development",
  description = "This simulation is currently under development and will be available in a future update.",
  returnTo = "JAM Seismic",
  returnPath = "/" 
}) {
  return (
    <AcademicPage
      title={title}
      subtitle={subtitle}
    >
      <div className="panel-scientific p-8 border-precise-2 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Development Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto border-2 border-mono-400 rounded-lg flex items-center justify-center">
              <div className="text-4xl font-mono text-mono-600">⚙️</div>
            </div>
          </div>
          
          {/* Status Message */}
          <h2 className="text-data-value text-2xl mb-4">{title} - In Progress</h2>
          
          <p className="text-methodology text-base mb-8 leading-relaxed">
            {description}
          </p>
          
          {/* Development Notes */}
          <div className="bg-mono-200 border border-mono-400 p-4 mb-8 text-left">
            <h3 className="text-data-label text-sm font-semibold mb-2">Development Status</h3>
            <ul className="text-methodology text-sm space-y-1">
              <li>• Framework and architecture: Complete</li>
              <li>• Core calculations: Complete</li>
              <li>• Interactive visualization: In Progress</li>
              <li>• Testing and validation: Pending</li>
            </ul>
          </div>
          
          {/* Return Navigation */}
          <ControlButton
            onClick={() => window.location.href = returnPath}
            variant="primary"
            className="text-base px-8 py-3"
          >
            Return to {returnTo}
          </ControlButton>
          
          <div className="mt-8 text-xs text-mono-600">
            <p>Jerome Maurseth • Civil Engineering Simulations</p>
            <p>US Army Corps of Engineers (Retired)</p>
          </div>
        </div>
      </div>
    </AcademicPage>
  );
}