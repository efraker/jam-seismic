/**
 * External Integrations Service
 * Links to external resources and services
 */

/**
 * Claude AI Integration Links
 */
export const CLAUDE_INTEGRATION = {
  // Direct link to Claude for development assistance
  claudeCode: 'https://claude.ai/code',
  
  // Claude web interface
  claudeWeb: 'https://claude.ai',
  
  // Anthropic documentation
  docs: 'https://docs.anthropic.com',
  
  // Quick development prompts for Jerome
  quickPrompts: {
    addSimulation: "I want to add a new civil engineering simulation to my platform. Help me implement [simulation name] with proper parameter controls and visualization.",
    
    debugIssue: "I'm having an issue with my React civil engineering platform. The problem is: [describe issue]",
    
    enhanceVisualization: "Help me improve the visualization in my engineering simulation. I want to add [specific enhancement]",
    
    addFormula: "I need to implement the [formula name] calculation in my engineering constants. Help me add proper validation and units."
  },
  
  // Generate Claude link with pre-filled prompt  
  generatePromptLink: (prompt) => `https://claude.ai/chat?q=${encodeURIComponent(prompt)}`
};

/**
 * Substack Integration
 */
export const SUBSTACK_INTEGRATION = {
  // Jerome's potential Substack publication
  baseUrl: 'https://civilengineering.substack.com', // Placeholder - Jerome would need to set this up
  
  // Newsletter signup form (would need actual Substack embed code)
  signupFormHTML: `
    <iframe src="https://civilengineering.substack.com/embed" width="100%" height="200" 
            frameborder="0" scrolling="no" style="border: 2px solid var(--border-primary); background: var(--bg-panel);"></iframe>
  `,
  
  // Potential article topics for automation
  articleTopics: [
    'New Simulation Released: Understanding Seismic Response',
    'Engineering Insights: Lessons from Structural Failures',
    'Code Updates: Latest Changes in ASCE 7',
    'Platform Enhancement: Interactive Formula Visualizer',
    'Student Spotlight: Creative Uses of Engineering Simulations'
  ],
  
  // Social sharing for articles
  shareLinks: {
    twitter: (title, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: (title, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: (title, url) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  }
};

/**
 * Engineering Reference Library Links
 */
export const ENGINEERING_REFERENCES = {
  // Professional Organizations
  organizations: {
    asce: {
      name: 'American Society of Civil Engineers',
      url: 'https://www.asce.org',
      description: 'Professional society for civil engineers'
    },
    aisc: {
      name: 'American Institute of Steel Construction',
      url: 'https://www.aisc.org',
      description: 'Steel construction standards and resources'
    },
    aci: {
      name: 'American Concrete Institute', 
      url: 'https://www.concrete.org',
      description: 'Concrete design and construction standards'
    },
    seaoc: {
      name: 'Structural Engineers Association of California',
      url: 'https://www.seaoc.org',
      description: 'Seismic design resources and standards'
    }
  },

  // Government Resources
  government: {
    usgs: {
      name: 'USGS Earthquake Hazards Program',
      url: 'https://earthquake.usgs.gov',
      description: 'Real-time earthquake data and hazard maps'
    },
    nist: {
      name: 'NIST Engineering Laboratory',
      url: 'https://www.nist.gov/el',
      description: 'Building and fire research, structural engineering'
    },
    fema: {
      name: 'FEMA Seismic Design Resources',
      url: 'https://www.fema.gov/emergency-managers/risk-management/earthquake',
      description: 'Federal emergency management earthquake resources'
    },
    army_corps: {
      name: 'US Army Corps of Engineers',
      url: 'https://www.usace.army.mil',
      description: 'Military and civil engineering resources'
    }
  },

  // Design Standards and Codes
  codes: {
    asce7: {
      name: 'ASCE 7 - Minimum Design Loads',
      url: 'https://www.asce.org/structural-engineering/asce-7',
      description: 'Wind, seismic, and other load requirements'
    },
    ibc: {
      name: 'International Building Code',
      url: 'https://www.iccsafe.org/products-and-services/i-codes/2021-i-codes/ibc/',
      description: 'Model building code adopted by most jurisdictions'
    },
    aisc360: {
      name: 'AISC 360 - Steel Construction Manual',
      url: 'https://www.aisc.org/globalassets/aisc/publications/standards/a360-16-spec-and-commentary.pdf',
      description: 'Steel design specifications'
    },
    aci318: {
      name: 'ACI 318 - Building Code Requirements for Concrete',
      url: 'https://www.concrete.org/store/productdetail.aspx?ItemID=318U19',
      description: 'Reinforced concrete design requirements'
    }
  },

  // Educational Resources
  education: {
    nees: {
      name: 'DesignSafe-CI (formerly NEES)',
      url: 'https://www.designsafe-ci.org',
      description: 'Earthquake engineering research and data'
    },
    peer: {
      name: 'Pacific Earthquake Engineering Research Center',
      url: 'https://peer.berkeley.edu',
      description: 'Advanced earthquake engineering research'
    },
    eeri: {
      name: 'Earthquake Engineering Research Institute',
      url: 'https://www.eeri.org',
      description: 'Earthquake engineering professional development'
    },
    structuremag: {
      name: 'STRUCTURE Magazine',
      url: 'https://www.structuremag.org',
      description: 'Structural engineering practice articles'
    }
  },

  // Software and Tools
  software: {
    opensees: {
      name: 'OpenSees',
      url: 'https://opensees.berkeley.edu',
      description: 'Open-source structural analysis framework'
    },
    perform3d: {
      name: 'PERFORM-3D',
      url: 'https://www.csiamerica.com/products/perform-3d',
      description: 'Nonlinear structural analysis software'
    },
    etabs: {
      name: 'ETABS',
      url: 'https://www.csiamerica.com/products/etabs',
      description: 'Building analysis and design software'
    },
    sap2000: {
      name: 'SAP2000',
      url: 'https://www.csiamerica.com/products/sap2000',
      description: 'General structural analysis software'
    }
  }
};

/**
 * Quick Access Links for Development
 */
export const DEVELOPMENT_LINKS = {
  // GitHub repository
  github: 'https://github.com/efraker/nuggetroidarcade',
  
  // React documentation
  react: 'https://react.dev',
  
  // Vite documentation  
  vite: 'https://vitejs.dev',
  
  // Tailwind CSS
  tailwind: 'https://tailwindcss.com',
  
  // Mathematics and visualization libraries
  libraries: {
    d3: 'https://d3js.org',
    plotly: 'https://plotly.com/javascript/',
    chartjs: 'https://www.chartjs.org',
    threejs: 'https://threejs.org',
    mathjs: 'https://mathjs.org'
  }
};

/**
 * Student and Community Resources
 */
export const COMMUNITY_RESOURCES = {
  // Professional forums
  forums: {
    eng_tips: {
      name: 'Eng-Tips Forums',
      url: 'https://www.eng-tips.com/threadarea.cfm?qid=7',
      description: 'Structural engineering professional forum'
    },
    reddit_structural: {
      name: 'r/StructuralEngineering',
      url: 'https://www.reddit.com/r/StructuralEngineering/',
      description: 'Reddit structural engineering community'
    },
    linkedin_groups: {
      name: 'LinkedIn Structural Engineering Groups',
      url: 'https://www.linkedin.com/search/results/groups/?keywords=structural%20engineering',
      description: 'Professional networking groups'
    }
  },

  // Career resources
  career: {
    ncees: {
      name: 'NCEES - PE Exam Information',
      url: 'https://ncees.org/engineering/',
      description: 'Professional engineering licensure'
    },
    asce_careers: {
      name: 'ASCE Career Center',
      url: 'https://careers.asce.org',
      description: 'Civil engineering job opportunities'
    },
    salary_data: {
      name: 'Civil Engineering Salary Data',
      url: 'https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm',
      description: 'Bureau of Labor Statistics career outlook'
    }
  }
};