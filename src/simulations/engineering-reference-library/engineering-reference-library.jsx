import React, { useState } from 'react';
import { AcademicPage } from '../../components/layout/AcademicPage';
import { ReferenceLinks, QuickLinks, LinkTree, DevelopmentLinks, NewsletterIntegration } from '../../components/content/ReferenceLinks';
import { Figure } from '../../components/scientific/Figure';
import { ControlButton } from '../../components/scientific/ParameterPanel';
import { ENGINEERING_REFERENCES, CLAUDE_INTEGRATION, DEVELOPMENT_LINKS } from '../../services/externalIntegrations';

export default function EngineeringReferenceLibrary() {
  const [activeSection, setActiveSection] = useState('organizations');
  
  // Organize all reference links with categories
  const allReferences = {
    organizations: {
      name: 'Professional Organizations',
      description: 'Leading engineering societies and professional bodies',
      links: Object.entries(ENGINEERING_REFERENCES.organizations).map(([_key, org]) => ({
        name: org.name,
        url: org.url,
        description: org.description,
        category: 'organizations',
        tags: ['professional', 'society']
      }))
    },
    
    government: {
      name: 'Government Resources',
      description: 'Federal agencies and regulatory bodies',
      links: Object.entries(ENGINEERING_REFERENCES.government).map(([_key, gov]) => ({
        name: gov.name,
        url: gov.url,
        description: gov.description,
        category: 'government',
        tags: ['government', 'regulation', 'data']
      }))
    },
    
    codes: {
      name: 'Design Standards & Codes',
      description: 'Building codes and design specifications',
      links: Object.entries(ENGINEERING_REFERENCES.codes).map(([_key, code]) => ({
        name: code.name,
        url: code.url,
        description: code.description,
        category: 'codes',
        tags: ['standards', 'codes', 'design']
      }))
    },
    
    education: {
      name: 'Educational Resources',
      description: 'Research institutions and learning materials',
      links: Object.entries(ENGINEERING_REFERENCES.education).map(([_key, edu]) => ({
        name: edu.name,
        url: edu.url,
        description: edu.description,
        category: 'education',
        tags: ['research', 'education', 'academic']
      }))
    },
    
    software: {
      name: 'Software & Tools',
      description: 'Engineering analysis and design software',
      links: Object.entries(ENGINEERING_REFERENCES.software).map(([_key, software]) => ({
        name: software.name,
        url: software.url,
        description: software.description,
        category: 'software',
        tags: ['software', 'analysis', 'design']
      }))
    }
  };
  
  // Claude development quick access links
  const claudeLinks = [
    {
      name: 'Claude Code',
      url: CLAUDE_INTEGRATION.claudeCode,
      description: 'AI development assistant for coding',
      icon: '🤖'
    },
    {
      name: 'Claude Web',
      url: CLAUDE_INTEGRATION.claudeWeb,
      description: 'Claude web interface',
      icon: '💬'
    },
    {
      name: 'Anthropic Docs',
      url: CLAUDE_INTEGRATION.docs,
      description: 'Claude documentation and guides',
      icon: '📚'
    }
  ];
  
  // Quick development prompts for Jerome
  const developmentPrompts = [
    {
      title: 'Add New Simulation',
      prompt: CLAUDE_INTEGRATION.quickPrompts.addSimulation,
      description: 'Get help implementing a new civil engineering simulation'
    },
    {
      title: 'Debug Issue',
      prompt: CLAUDE_INTEGRATION.quickPrompts.debugIssue,
      description: 'Troubleshoot problems with the platform'
    },
    {
      title: 'Enhance Visualization',
      prompt: CLAUDE_INTEGRATION.quickPrompts.enhanceVisualization,
      description: 'Improve simulation graphics and interactivity'
    },
    {
      title: 'Add Formula',
      prompt: CLAUDE_INTEGRATION.quickPrompts.addFormula,
      description: 'Implement new engineering calculations'
    }
  ];
  
  // Get all links for the active section (currently unused but kept for future expansion)
  // const getAllLinks = () => {
  //   return Object.values(allReferences).reduce((acc, section) => {
  //     return acc.concat(section.links);
  //   }, []);
  // };
  
  return (
    <AcademicPage 
      title="Engineering Reference Library"
      subtitle="Curated Resources for Structural Engineering"
    >
      
      {/* Quick Access Section */}
      <section className="mb-8">
        <h2 className="text-figure-title mb-4">Quick Access</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Claude AI Development Links */}
          <div>
            <QuickLinks 
              title="Claude AI Development"
              links={claudeLinks}
              variant="vertical"
            />
            
            {/* Development Prompts */}
            <div className="mt-4 panel-scientific p-4 border-precise-2">
              <h4 className="text-data-label mb-3">Development Prompts</h4>
              <div className="space-y-2">
                {developmentPrompts.map((prompt, index) => (
                  <div key={index} className="prompt-item">
                    <div className="flex items-center justify-between">
                      <h5 className="text-data-value text-sm font-medium">{prompt.title}</h5>
                      <ControlButton
                        onClick={() => {
                          const claudeUrl = CLAUDE_INTEGRATION.generatePromptLink(prompt.prompt);
                          window.open(claudeUrl, '_blank');
                        }}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        Use Prompt
                      </ControlButton>
                    </div>
                    <p className="text-methodology text-xs mt-1">{prompt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Newsletter Subscription */}
          <div>
            <NewsletterIntegration />
            
            {/* Project Links */}
            <div className="mt-4">
              <DevelopmentLinks />
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Reference Library */}
      <Figure
        title="Civil Engineering Resource Directory"
        caption="Comprehensive collection of professional resources, standards, and tools for civil and structural engineering practice"
        methodology="Resources organized by category with direct links and descriptions"
      >
        
        {/* Section Navigation */}
        <div className="reference-nav mb-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(allReferences).map(([key, section]) => (
              <ControlButton
                key={key}
                onClick={() => setActiveSection(key)}
                variant={activeSection === key ? 'primary' : 'secondary'}
                className="text-sm"
              >
                {section.name}
              </ControlButton>
            ))}
          </div>
        </div>
        
        {/* Active Section Display */}
        {allReferences[activeSection] && (
          <ReferenceLinks
            title={allReferences[activeSection].name}
            links={allReferences[activeSection].links}
            showSearch={true}
            categories={{
              organizations: { name: 'Organizations' },
              government: { name: 'Government' },
              codes: { name: 'Codes & Standards' },
              education: { name: 'Education' },
              software: { name: 'Software' }
            }}
          />
        )}
        
      </Figure>
      
      {/* Tree View of All Resources */}
      <Figure
        title="Complete Resource Tree"
        caption="Hierarchical view of all available engineering resources"
        className="mt-8"
      >
        <LinkTree
          title="All Engineering Resources"
          structure={allReferences}
        />
      </Figure>
      
      {/* Usage Guidelines */}
      <section className="mt-12 panel-scientific p-6 border-precise-2">
        <h3 className="text-data-value text-lg mb-4">Using This Reference Library</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-data-label mb-2">For Students</h4>
            <ul className="text-methodology space-y-1 text-sm">
              <li>• Start with Professional Organizations for career guidance</li>
              <li>• Review Design Standards to understand industry requirements</li>
              <li>• Explore Educational Resources for additional learning</li>
              <li>• Use Government Resources for real-world data and case studies</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-data-label mb-2">For Professionals</h4>
            <ul className="text-methodology space-y-1 text-sm">
              <li>• Access current Design Standards and Codes for project compliance</li>
              <li>• Use Government Resources for regulatory information</li>
              <li>• Explore Software & Tools for analysis and design</li>
              <li>• Stay updated through Professional Organizations</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-mono-200 border border-mono-400">
          <h4 className="text-data-label mb-2">Developer Notes</h4>
          <p className="text-methodology text-sm">
            This reference library is designed to be easily expandable. New resources can be added to the 
            services/externalIntegrations.js file, and they will automatically appear in the appropriate 
            sections. All links open in new tabs to preserve the user's place in the platform.
          </p>
        </div>
      </section>
      
    </AcademicPage>
  );
}