import React, { useState, useEffect } from 'react';
import { AcademicPage } from '../../components/layout/AcademicPage';
import { QuickLinks, NewsletterIntegration } from '../../components/content/ReferenceLinks';
import { Figure } from '../../components/scientific/Figure';
import { ParameterPanel, ControlButton } from '../../components/scientific/ParameterPanel';
import { CLAUDE_INTEGRATION, DEVELOPMENT_LINKS, SUBSTACK_INTEGRATION } from '../../services/externalIntegrations';

export default function DevelopmentHub() {
  const [activeTab, setActiveTab] = useState('claude');
  const [customPrompt, setCustomPrompt] = useState('');
  const [projectStats, setProjectStats] = useState({
    simulations: 0,
    components: 0,
    lastUpdate: new Date().toLocaleDateString()
  });

  // Auto-count project statistics
  useEffect(() => {
    // This would normally count actual files, but for demo we'll simulate
    setProjectStats({
      simulations: 5, // Current number of simulations
      components: 15, // Estimated component count
      lastUpdate: new Date().toLocaleDateString()
    });
  }, []);

  const claudeQuickLinks = [
    {
      name: 'Claude Web',
      url: CLAUDE_INTEGRATION.claudeWeb,
      description: 'General Claude conversation interface',
      icon: '💬',
      featured: true
    },
    {
      name: 'Anthropic Docs',
      url: CLAUDE_INTEGRATION.docs,
      description: 'Claude API and development documentation',
      icon: '📚'
    }
  ];

  const developmentQuickLinks = [
    {
      name: 'GitHub Repository',
      url: DEVELOPMENT_LINKS.github,
      description: 'Project source code and version control',
      icon: '📁'
    },
    {
      name: 'React Documentation',
      url: DEVELOPMENT_LINKS.react,
      description: 'React framework documentation',
      icon: '⚛️'
    },
    {
      name: 'Vite Build Tool',
      url: DEVELOPMENT_LINKS.vite,
      description: 'Fast build tool and development server',
      icon: '⚡'
    },
    {
      name: 'Tailwind CSS',
      url: DEVELOPMENT_LINKS.tailwind,
      description: 'Utility-first CSS framework',
      icon: '🎨'
    }
  ];

  const promptTemplates = [
    {
      title: 'Add New Simulation',
      template: CLAUDE_INTEGRATION.quickPrompts.addSimulation,
      description: 'Template for implementing new engineering simulations',
      category: 'simulation'
    },
    {
      title: 'Debug Platform Issue',
      template: CLAUDE_INTEGRATION.quickPrompts.debugIssue,
      description: 'Get help troubleshooting problems',
      category: 'debug'
    },
    {
      title: 'Enhance Visualization',
      template: CLAUDE_INTEGRATION.quickPrompts.enhanceVisualization,
      description: 'Improve graphics and interactive elements',
      category: 'visualization'
    },
    {
      title: 'Add Engineering Formula',
      template: CLAUDE_INTEGRATION.quickPrompts.addFormula,
      description: 'Implement new calculations and formulas',
      category: 'formula'
    }
  ];


  const openClaudeWithPrompt = (template) => {
    const claudeUrl = CLAUDE_INTEGRATION.generatePromptLink(template);
    window.open(claudeUrl, '_blank');
  };

  const openCustomPrompt = () => {
    if (customPrompt.trim()) {
      const claudeUrl = CLAUDE_INTEGRATION.generatePromptLink(customPrompt);
      window.open(claudeUrl, '_blank');
    }
  };

  const tabs = {
    claude: { name: 'Claude AI', icon: '🤖' },
    development: { name: 'Development', icon: '🔧' },
    newsletter: { name: 'Newsletter', icon: '📧' }
  };

  return (
    <AcademicPage 
      title="Development Hub"
      subtitle="Platform Development and AI Assistant Integration"
    >

      {/* Tab Navigation */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(tabs).map(([key, tab]) => (
            <ControlButton
              key={key}
              onClick={() => setActiveTab(key)}
              variant={activeTab === key ? 'primary' : 'secondary'}
              className="text-sm"
            >
              {tab.icon} {tab.name}
            </ControlButton>
          ))}
        </div>
      </section>

      {/* Claude AI Tab */}
      {activeTab === 'claude' && (
        <>
          {/* Quick Access Links */}
          <section className="mb-8">
            <QuickLinks 
              title="Claude AI Quick Access"
              links={claudeQuickLinks}
              variant="horizontal"
            />
          </section>

          {/* Prompt Templates */}
          <Figure
            title="Development Prompt Templates"
            caption="Pre-configured prompts for common development tasks with Claude AI"
          >
            <div className="prompt-templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {promptTemplates.map((prompt, index) => (
                  <div key={index} className="prompt-card panel-scientific p-4 border-precise-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-data-value font-semibold">{prompt.title}</h4>
                      <span className="text-xs bg-mono-200 px-2 py-1 border">
                        {prompt.category}
                      </span>
                    </div>
                    <p className="text-methodology text-sm mb-3">{prompt.description}</p>
                    <div className="prompt-preview bg-mono-100 p-2 border text-xs text-mono-700 mb-3 max-h-20 overflow-hidden">
                      {prompt.template.substring(0, 100)}...
                    </div>
                    <ControlButton
                      onClick={() => openClaudeWithPrompt(prompt.template)}
                      variant="primary"
                      className="text-xs w-full"
                    >
                      Use This Prompt
                    </ControlButton>
                  </div>
                ))}
              </div>

              {/* Custom Prompt Section */}
              <div className="custom-prompt panel-scientific p-4 border-precise-2">
                <h4 className="text-data-value mb-3">Custom Prompt</h4>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe what you want to implement or debug..."
                  rows={4}
                  className="w-full p-3 border border-mono-400 bg-mono-100 text-mono-black font-mono text-sm resize-vertical"
                />
                <div className="mt-3 flex gap-2">
                  <ControlButton
                    onClick={openCustomPrompt}
                    variant="primary"
                    disabled={!customPrompt.trim()}
                  >
                    Send to Claude
                  </ControlButton>
                  <ControlButton
                    onClick={() => setCustomPrompt('')}
                    variant="secondary"
                  >
                    Clear
                  </ControlButton>
                </div>
              </div>
            </div>
          </Figure>
        </>
      )}

      {/* Development Tab */}
      {activeTab === 'development' && (
        <>
          {/* Development Tools */}
          <section className="mb-8">
            <QuickLinks 
              title="Development Tools & Resources"
              links={developmentQuickLinks}
              variant="horizontal"
            />
          </section>

          {/* Project Statistics */}
          <Figure
            title="Project Statistics"
            caption="Current platform metrics and development progress"
          >
            <div className="project-stats grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card panel-scientific p-4 border-precise-2 text-center">
                <div className="text-3xl font-mono text-data-value">{projectStats.simulations}</div>
                <div className="text-data-label">Simulations</div>
                <div className="text-methodology text-xs mt-1">Interactive tools available</div>
              </div>
              <div className="stat-card panel-scientific p-4 border-precise-2 text-center">
                <div className="text-3xl font-mono text-data-value">{projectStats.components}</div>
                <div className="text-data-label">Components</div>
                <div className="text-methodology text-xs mt-1">Reusable React components</div>
              </div>
              <div className="stat-card panel-scientific p-4 border-precise-2 text-center">
                <div className="text-lg font-mono text-data-value">{projectStats.lastUpdate}</div>
                <div className="text-data-label">Last Update</div>
                <div className="text-methodology text-xs mt-1">Most recent changes</div>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="architecture mt-8 panel-scientific p-6 border-precise-2">
              <h4 className="text-data-value mb-4">Platform Architecture</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-data-label mb-2">Core Technologies</h5>
                  <ul className="text-methodology text-sm space-y-1">
                    <li>• React 19+ with Router DOM</li>
                    <li>• Vite 7+ build system</li>
                    <li>• Tailwind CSS 4+ styling</li>
                    <li>• Auto-discovery simulation system</li>
                    <li>• Academic paper aesthetic design</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-data-label mb-2">Key Features</h5>
                  <ul className="text-methodology text-sm space-y-1">
                    <li>• Unified resource architecture</li>
                    <li>• Wolfram Alpha integration</li>
                    <li>• Centralized engineering formulas</li>
                    <li>• Responsive academic layouts</li>
                    <li>• Interactive visualizations</li>
                  </ul>
                </div>
              </div>
            </div>
          </Figure>
        </>
      )}

      {/* Newsletter Tab */}
      {activeTab === 'newsletter' && (
        <>
          <section className="mb-8">
            <NewsletterIntegration />
          </section>

          <Figure
            title="Content Strategy"
            caption="Newsletter and community engagement planning"
          >
            <div className="content-strategy">
              {/* Potential Article Topics */}
              <div className="article-topics mb-8">
                <h4 className="text-data-value mb-4">Potential Article Topics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SUBSTACK_INTEGRATION.articleTopics.map((topic, index) => (
                    <div key={index} className="topic-card panel-scientific p-3 border-precise-2">
                      <div className="text-data-value text-sm mb-1">Article {index + 1}</div>
                      <div className="text-methodology text-xs">{topic}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Sharing Options */}
              <div className="social-sharing panel-scientific p-4 border-precise-2">
                <h4 className="text-data-value mb-3">Social Media Integration</h4>
                <p className="text-methodology text-sm mb-4">
                  When articles are published, they can be automatically shared across social platforms:
                </p>
                <div className="flex gap-2">
                  <ControlButton variant="secondary" className="text-xs">
                    📱 Twitter/X
                  </ControlButton>
                  <ControlButton variant="secondary" className="text-xs">
                    💼 LinkedIn
                  </ControlButton>
                  <ControlButton variant="secondary" className="text-xs">
                    📧 Email
                  </ControlButton>
                </div>
              </div>
            </div>
          </Figure>
        </>
      )}


    </AcademicPage>
  );
}