# Civil Engineering Simulations Platform

A comprehensive React-based educational platform designed by Jerome Maurseth (P.E., US Army Corps of Engineers, Ret'd.) for interactive civil and structural engineering education.

## Overview

This platform demonstrates complex engineering concepts through interactive simulations, combining Jerome's decades of professional experience with modern web technology. The system features an academic paper aesthetic and auto-discovery architecture for easy expansion.

## Features

### Interactive Simulations
- **Earthquake Simulation**: Seismic response analysis with dynamic visualization
- **Formula Visualizer**: Interactive engineering formulas with real-time calculations
- **Load Path Tracer**: Visual demonstration of force flow through structures  
- **Soil-Structure Interaction**: Foundation design with geotechnical analysis
- **Units & Conversions Calculator**: Smart engineering unit converter with history
- **Engineering Reference Library**: Comprehensive resource directory with external links
- **Development Hub**: Claude.ai integration and project management tools

### Educational Features
- Real-time parameter adjustment and visualization
- Wolfram Alpha integration for calculation verification
- Comprehensive engineering explanations and principles
- Academic paper styling with figure numbering
- Voice synthesis capability for accessibility
- Mobile-responsive design

### Developer Features
- Auto-discovery simulation system (just add folders to `src/simulations/`)
- Unified component architecture with reusable layouts
- Centralized engineering constants and formulas
- Claude.ai development assistance integration
- Academic design system with consistent styling

## Architecture

### File Structure Schematic
```
JAM-seismic/
├── 📄 CLAUDE.md                    # ⭐ CORE: Claude.ai development guidance
├── 📄 README.md                    # ⭐ CORE: Project overview (this file)
├── 📄 package.json                 # Dependencies and scripts
├── 📄 vite.config.js              # Build configuration
├── 📄 tailwind.config.js          # Styling configuration
├── 📄 eslint.config.js            # Linting rules
│
├── 📁 src/
│   ├── 📄 App.jsx                  # Main application and auto-discovery
│   ├── 📄 main.jsx                 # React entry point
│   ├── 📄 index.css               # Global styles
│   │
│   ├── 📁 components/              # Reusable UI components
│   │   ├── 📁 layout/              # Page and simulation layouts
│   │   │   └── 📄 AcademicPage.jsx # ⭐ CORE: Standard page layout
│   │   ├── 📁 scientific/          # Engineering UI components
│   │   │   └── 📄 ParameterPanel.jsx # ⭐ CORE: Component patterns
│   │   └── 📁 content/             # Content display components
│   │       ├── 📄 FormulaDisplay.jsx # Formula presentation
│   │       └── 📄 ReferenceLinks.jsx # External resource links
│   │
│   ├── 📁 constants/
│   │   └── 📄 engineering.js       # ⭐ CORE: All engineering data/formulas
│   │
│   ├── 📁 services/                # External integrations
│   │   ├── 📄 wolframAlpha.js      # Wolfram Alpha URL generation
│   │   └── 📄 externalIntegrations.js # Claude.ai, Substack, references
│   │
│   ├── 📁 styles/
│   │   └── 📄 theme.css           # 🎨 Academic paper design system
│   │
│   ├── 📁 simulations/            # 🔄 AUTO-DISCOVERED: Add new simulations here
│   │   ├── 📁 earthquake-simulation/
│   │   ├── 📁 formula-visualizer/
│   │   ├── 📁 load-path-tracer/
│   │   ├── 📁 soil-structure-interaction/
│   │   ├── 📁 units-conversions-calculator/
│   │   ├── 📁 engineering-reference-library/
│   │   └── 📁 development-hub/
│   │
│   ├── 📁 assets/
│   │   └── 📄 authorbio.md        # Jerome's biography
│   │
│   └── 📁 utils/                  # Utility functions
│       ├── 📄 gridSystem.js
│       └── 📄 isometricProjection.js

⭐ = Essential files for Claude.ai context
🔄 = Auto-discovered by the system
🎨 = Design system file
```

## Claude.ai Development Workflow

### For Jerome (Getting Claude.ai Context)

When working with Claude.ai on this project, **always provide these essential files first:**

#### Core Context Files (Always Include):
1. **`CLAUDE.md`** - Complete development guidance and architecture
2. **`README.md`** - This file with project overview and workflow
3. **`src/constants/engineering.js`** - All centralized engineering data
4. **`src/components/layout/AcademicPage.jsx`** - Layout patterns
5. **`src/components/scientific/ParameterPanel.jsx`** - Component patterns

#### For Specific Tasks, Also Include:
- **New simulation work**: The specific simulation file being modified
- **Styling changes**: `src/styles/theme.css`
- **Formula work**: `src/services/wolframAlpha.js`
- **External integrations**: `src/services/externalIntegrations.js`
- **App structure**: `src/App.jsx` (for routing/discovery changes)

### Copy-Paste Instructions for Claude.ai

1. **Start every Claude.ai session by saying:**
   ```
   I'm working on my Civil Engineering Simulations platform. 
   Let me provide the core context files first.
   ```

2. **Copy and paste these files in order:**
   - Copy `CLAUDE.md` → Paste in Claude.ai
   - Copy `README.md` → Paste in Claude.ai  
   - Copy `src/constants/engineering.js` → Paste in Claude.ai
   - Copy `src/components/layout/AcademicPage.jsx` → Paste in Claude.ai
   - Copy `src/components/scientific/ParameterPanel.jsx` → Paste in Claude.ai

3. **Then describe your task:**
   ```
   Now I need help with [specific task]. 
   Should I provide any additional files?
   ```

4. **Claude.ai will ask for additional files if needed**

### Quick Context Setup Commands

```bash
# Copy essential files to clipboard (macOS)
cat CLAUDE.md | pbcopy
cat README.md | pbcopy  
cat src/constants/engineering.js | pbcopy
cat src/components/layout/AcademicPage.jsx | pbcopy
cat src/components/scientific/ParameterPanel.jsx | pbcopy

# Copy essential files to clipboard (Windows)
type CLAUDE.md | clip
type README.md | clip
type src\constants\engineering.js | clip
type src\components\layout\AcademicPage.jsx | clip
type src\components\scientific\ParameterPanel.jsx | clip
```

## Tech Stack

- **Framework**: React 19+ with React Router DOM
- **Build Tool**: Vite 7+ (fast development and building)
- **Styling**: Tailwind CSS 4+ with custom academic paper design system
- **Linting**: ESLint with React hooks and refresh plugins
- **Deployment**: GitHub Pages (base path: `/jam-seismic/`)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/efraker/nuggetroidarcade.git
   cd nuggetroidarcade
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to:**
   ```
   http://localhost:5173/jam-seismic/
   ```

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production deployment
- `npm run lint` - Run ESLint (some React Hook warnings are acceptable)
- `npm run preview` - Preview production build locally

## Adding New Simulations

The platform uses an auto-discovery system. To add a new simulation:

1. **Create folder:** `src/simulations/your-simulation-name/`
2. **Add main file:** `your-simulation-name.jsx` (must match folder name)
3. **Export default component** that uses existing layouts
4. **The simulation automatically appears** in the menu and routing

See `CLAUDE.md` for detailed development patterns and component usage.

## Deployment

### GitHub Pages
- **Deployed at**: `https://efraker.github.io/nuggetroidarcade/jam-seismic/`
- **Base path configured**: `/jam-seismic/` in `vite.config.js`
- **Build command**: `npm run build`

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## Design Philosophy

The platform follows an **academic paper aesthetic**:
- Monochrome color palette with semantic meaning
- Monospace typography (Courier New) for technical precision
- Dense, information-focused layouts
- Automatic figure numbering and scientific notation
- Consistent component patterns throughout

## Contributing

This platform is designed for Jerome's educational use. For development assistance:
1. Use the Claude.ai workflow described above
2. Follow existing component patterns
3. Maintain the academic aesthetic
4. Test thoroughly with `npm run dev`
5. Resolve lint issues before committing

## License

MIT License - See LICENSE file for details

## Contact

**Jerome Maurseth, P.E.**  
US Army Corps of Engineers, Ret'd.  
Civil Engineering Educational Platform

For technical development assistance, use the Claude.ai integration built into the Development Hub simulation.