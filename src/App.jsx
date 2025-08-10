import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import authorBioContent from './assets/authorbio.md?raw';
import './index.css';

// --- SOUND SETUP ---
// 1. Import each sound file directly. Vite will handle the paths.
import jumpSound from './assets/sounds/jump.mp3';
import laserSound from './assets/sounds/laser.mp3';
import howlSound from './assets/sounds/howl.mp3';
import explosionSound from './assets/sounds/explosion.mp3';

// 2. Create the array using the imported variables.
const soundFiles = [
  jumpSound,
  laserSound,
  howlSound,
  explosionSound
];

const hoverSound = new Audio();
hoverSound.volume = 0.4;

const playRandomHoverSound = () => {
  const randomSoundSrc = soundFiles[Math.floor(Math.random() * soundFiles.length)];
  hoverSound.src = randomSoundSrc;
  hoverSound.play().catch(e => console.error("Error playing sound:", e));
};

// --- SIMULATION LOADER ---
const simulationModules = import.meta.glob('./simulations/**/*.jsx', { eager: true });

const simulations = Object.keys(simulationModules).map((path) => {
  const name = path.split('/').slice(-2)[0];
  const component = simulationModules[path].default;
  return {
    path: `/${name}`,
    name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    Component: component,
  };
});

// --- COMPONENTS ---
function AuthorBio() {
  const [bioContent] = useState(authorBioContent);
  
  const formatMarkdown = (text) => {
    return text
      .replace(/^# (.*$)/gim, '<h2 class="heading-secondary text-caps mb-4">$1</h2>')
      .replace(/^## (.*$)/gim, '<h3 class="heading-tertiary mb-3">$2</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-data-value">$1</strong>')
      .replace(/\n\n/g, '</p><p class="text-author-bio mb-4">')
      .replace(/^(.*)$/gm, '<p class="text-author-bio mb-4">$1</p>');
  };
  
  return (
    <section className="panel-scientific p-6 border-precise-2 mb-8">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatMarkdown(bioContent) 
        }} 
      />
    </section>
  );
}

function SimulationMenu() {
  return (
    <div className="min-h-screen bg-mono-white text-mono-black font-mono">
      <div className="max-w-4xl mx-auto p-8 space-academic">
        
        {/* Page Header - Academic Paper Style */}
        <header className="text-center border-b-2 border-mono-black pb-6 mb-8">
          <h1 className="heading-primary text-caps tracking-scientific mb-2">
            Civil Engineering Simulations
          </h1>
          <p className="text-data-label">Interactive Educational Platform</p>
          <p className="text-reference mt-2">Jerome Maurseth, P.E. - US Army Corps of Engineers</p>
        </header>
        
        <AuthorBio />
        
        {/* Simulations Grid - Academic Figure Layout */}
        {simulations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-figure-title mb-6">Available Simulations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulations.map((simulation, index) => (
                <Link
                  key={simulation.path}
                  to={simulation.path}
                  onMouseEnter={playRandomHoverSound}
                  className="panel-scientific p-4 hover:bg-mono-100 transition-all duration-100 border-precise-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-data-value text-lg mb-1">{simulation.name}</h3>
                      <p className="text-data-label">Figure {index + 1}</p>
                    </div>
                    <div className="text-data-label">
                      →
                    </div>
                  </div>
                  <p className="text-methodology mt-2">Interactive engineering demonstration</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {simulations.length === 0 && (
          <div className="panel-scientific p-6 mt-8 border-precise-2">
            <p className="text-center text-data-label">Simulations are being prepared. Please check back soon.</p>
          </div>
        )}
        
        {/* Footer - Academic Paper Style */}
        <footer className="mt-16 pt-8 border-t border-mono-300 text-center">
          <p className="text-reference">© 2024 Civil Engineering Educational Platform</p>
        </footer>
      </div>
    </div>
  );
}

// The main App component that handles all the routing
export default function App() {
  return (
    <Router basename="/jam-seismic/">
      <Routes>
        <Route path="/" element={<SimulationMenu />} />
        {simulations.map(({ path, Component: _Component }) => (
          <Route key={path} path={path} element={<_Component />} />
        ))}
      </Routes>
    </Router>
  );
}
