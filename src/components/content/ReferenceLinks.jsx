import React, { useState } from 'react';
import { ControlButton } from '../scientific/ParameterPanel';

/**
 * Reference Links Component
 * Organized display of external engineering resources
 */
export function ReferenceLinks({ 
  title,
  links = [],
  categories = {},
  showSearch = false,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter links based on search and category
  const filteredLinks = links.filter(link => {
    const matchesSearch = !searchTerm || 
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
      link.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className={`reference-links panel-scientific border-precise-2 ${className}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-mono-300">
        <h3 className="text-data-value text-lg mb-2">{title}</h3>
        
        {/* Search Bar */}
        {showSearch && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-mono-400 bg-mono-100 text-mono-black font-mono text-sm focus:outline-none focus:border-mono-black"
            />
          </div>
        )}
        
        {/* Category Filters */}
        {Object.keys(categories).length > 0 && (
          <div className="category-filters">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2 py-1 text-xs border transition-all ${
                  activeCategory === 'all' 
                    ? 'bg-mono-300 border-mono-black' 
                    : 'bg-mono-100 border-mono-400 hover:bg-mono-200'
                }`}
              >
                All
              </button>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-2 py-1 text-xs border transition-all ${
                    activeCategory === key 
                      ? 'bg-mono-300 border-mono-black' 
                      : 'bg-mono-100 border-mono-400 hover:bg-mono-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Links List */}
      <div className="p-4">
        {filteredLinks.length > 0 ? (
          <div className="space-y-3">
            {filteredLinks.map((link, index) => (
              <div key={index} className="reference-link border-b border-mono-300 pb-3 last:border-b-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-data-value font-semibold">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-data-value hover:text-mono-black hover:underline"
                      title={`Visit ${link.name}`}
                    >
                      {link.name}
                    </a>
                  </h4>
                  <div className="flex gap-2 ml-4">
                    {link.category && categories[link.category] && (
                      <span className="text-xs bg-mono-200 px-2 py-1 border">
                        {categories[link.category].name}
                      </span>
                    )}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-data-label hover:text-mono-black text-sm"
                      title={`Visit ${link.name}`}
                    >
                      →
                    </a>
                  </div>
                </div>
                
                <p className="text-methodology text-sm mb-2">{link.description}</p>
                
                {/* Additional link metadata */}
                {link.tags && (
                  <div className="flex flex-wrap gap-1">
                    {link.tags.map(tag => (
                      <span key={tag} className="text-xs text-mono-600 bg-mono-100 px-1 border">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-methodology py-8">
            No resources found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Quick Links Component
 * Compact horizontal display of important links
 */
export function QuickLinks({ 
  title,
  links = [],
  variant = 'horizontal', // 'horizontal', 'vertical'
  className = ''
}) {
  return (
    <div className={`quick-links panel-scientific p-4 border-precise-2 ${className}`}>
      
      {title && (
        <h4 className="text-data-label mb-3">{title}</h4>
      )}
      
      <div className={`quick-links-container ${
        variant === 'horizontal' 
          ? 'flex flex-wrap gap-2' 
          : 'grid grid-cols-1 gap-2'
      }`}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-link bg-mono-100 hover:bg-mono-200 border border-mono-400 px-3 py-2 text-sm transition-all text-center"
            title={link.description}
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Link Tree Component
 * Tree-style navigation for organized resources
 */
export function LinkTree({ 
  title,
  structure = {},
  className = '' 
}) {
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  return (
    <div className={`link-tree panel-scientific border-precise-2 ${className}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-mono-300">
        <h3 className="text-data-value text-lg">{title}</h3>
      </div>
      
      {/* Tree Structure */}
      <div className="p-4">
        {Object.entries(structure).map(([sectionKey, section]) => (
          <div key={sectionKey} className="tree-section mb-4">
            
            {/* Section Header */}
            <div 
              className="section-header flex items-center justify-between cursor-pointer hover:bg-mono-100 p-2 border border-mono-300"
              onClick={() => toggleSection(sectionKey)}
            >
              <h4 className="text-data-value font-semibold">{section.name}</h4>
              <span className={`transition-transform ${
                expandedSections[sectionKey] ? 'rotate-90' : ''
              }`}>
                →
              </span>
            </div>
            
            {/* Section Content */}
            {expandedSections[sectionKey] && (
              <div className="section-content ml-4 mt-2 border-l-2 border-mono-300">
                {section.description && (
                  <p className="text-methodology text-sm mb-3 pl-4">{section.description}</p>
                )}
                
                <div className="pl-4 space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="tree-link">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-data-value text-sm font-medium">{link.name}</h5>
                          <p className="text-methodology text-xs">{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-data-label hover:text-mono-black text-sm"
                          title={`Visit ${link.name}`}
                        >
                          →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Development Links Component
 * Quick access for Jerome's development needs
 */
export function DevelopmentLinks({ className = '' }) {
  const devLinks = [
    {
      name: 'Claude Code',
      url: 'https://claude.ai/code',
      description: 'AI development assistant',
      icon: '🤖'
    },
    {
      name: 'GitHub Repo',
      url: 'https://github.com/efraker/nuggetroidarcade',
      description: 'Project repository',
      icon: '📁'
    },
    {
      name: 'React Docs',
      url: 'https://react.dev',
      description: 'React documentation',
      icon: '⚛️'
    },
    {
      name: 'Vite Docs',
      url: 'https://vitejs.dev',
      description: 'Build tool documentation',
      icon: '⚡'
    }
  ];
  
  return (
    <QuickLinks 
      title="Development Resources"
      links={devLinks}
      variant="horizontal"
      className={className}
    />
  );
}

/**
 * Newsletter Integration Component
 */
export function NewsletterIntegration({ className = '' }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    // This would integrate with actual Substack API when available
    console.log('Newsletter subscription for:', email);
    setSubscribed(true);
    setEmail('');
    
    // Show confirmation for 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };
  
  return (
    <div className={`newsletter-integration panel-scientific p-4 border-precise-2 ${className}`}>
      <h4 className="text-data-value mb-3">Stay Updated</h4>
      <p className="text-methodology text-sm mb-4">
        Subscribe to receive updates about new simulations and engineering insights.
      </p>
      
      {subscribed ? (
        <div className="text-center py-4">
          <div className="text-data-value">✓ Thank you for subscribing!</div>
          <div className="text-methodology text-sm">You'll receive updates about new features.</div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            type="email"
            placeholder="your.email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 p-2 border border-mono-400 bg-mono-100 text-mono-black font-mono text-sm focus:outline-none focus:border-mono-black"
          />
          <ControlButton type="submit" variant="primary">
            Subscribe
          </ControlButton>
        </form>
      )}
      
      <div className="text-xs text-methodology mt-2">
        <a href="#" className="hover:text-mono-black">Privacy Policy</a> | 
        <a href="#" className="hover:text-mono-black ml-1">Unsubscribe</a>
      </div>
    </div>
  );
}