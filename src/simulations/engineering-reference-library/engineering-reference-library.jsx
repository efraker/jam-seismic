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
  
  // Newsletter subscription and staying updated links
  const stayUpdatedLinks = [
    {
      name: 'ASCE News',
      url: 'https://www.asce.org/news',
      description: 'Latest civil engineering news and updates',
      icon: '📰'
    },
    {
      name: 'Engineering News-Record',
      url: 'https://www.enr.com/',
      description: 'Construction industry news and rankings',
      icon: '🏗️'
    },
    {
      name: 'Structural Engineering Magazine',
      url: 'https://www.structuremag.org/',
      description: 'Structural engineering practice and innovation',
      icon: '🏢'
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
          
          {/* Industry News & Updates */}
          <div>
            <QuickLinks 
              title="Stay Updated"
              links={stayUpdatedLinks}
              variant="vertical"
            />
          </div>
          
          {/* Newsletter Subscription */}
          <div>
            <NewsletterIntegration />
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
      
      {/* Developer Notes */}
      <section className="mt-12 panel-scientific p-6 border-precise-2">
        <h4 className="text-data-label mb-2">Developer Notes</h4>
        <p className="text-methodology text-sm">
          This reference library is designed to be easily expandable. New resources can be added to the 
          services/externalIntegrations.js file, and they will automatically appear in the appropriate 
          sections. All links open in new tabs to preserve the user's place in the platform.
        </p>
      </section>
      
    </AcademicPage>
  );
}