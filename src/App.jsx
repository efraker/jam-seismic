import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import aboutmeContent from './assets/aboutme.md?raw';
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
function AboutMe() {
  const [aboutContent] = useState(aboutmeContent);
  
  const formatMarkdown = (text) => {
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-blue-400">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-blue-300">$2</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-300 leading-relaxed">')
      .replace(/^(.*)$/gm, '<p class="mb-4 text-gray-300 leading-relaxed">$1</p>');
  };
  
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-blue-500/50 p-8 rounded-lg shadow-lg mb-8">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatMarkdown(aboutContent) 
        }} 
      />
    </div>
  );
}

function SimulationMenu() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center p-4 sm:p-8 overflow-hidden"
      style={{ fontFamily: "'Press Start 2P', cursive" }}
    >
      {/* Animated Starfield Background Elements */}
      <div className="stars"></div>
      <div className="twinkling"></div>

      {/* Main content, using z-10 to ensure it appears above the background */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-blue-400" 
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Civil Engineering Simulations
        </h1>
        
        <AboutMe />
        
        {simulations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-4">
            {simulations.map(simulation => (
              <Link
                key={simulation.path}
                to={simulation.path}
                onMouseEnter={playRandomHoverSound}
                className="bg-gray-800/70 backdrop-blur-sm border border-blue-500/50 p-6 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-400/40 hover:bg-gray-700/80 transition-all transform hover:-translate-y-1.5"
              >
                <h2 className="text-xl font-semibold text-gray-100">{simulation.name}</h2>
                <p className="text-gray-400 text-sm mt-2">Explore simulation</p>
              </Link>
            ))}
          </div>
        )}
        
        {simulations.length === 0 && (
          <div className="bg-gray-800/70 backdrop-blur-sm border border-yellow-500/50 p-6 rounded-lg shadow-lg mt-4">
            <p className="text-yellow-400 text-center">Simulations are being prepared. Please check back soon!</p>
          </div>
        )}
      </div> {/* <-- FIX: This was the missing closing div tag */}
    </div>
  );
}

// The main App component that handles all the routing
export default function App() {
  return (
    <Router basename="/nuggetroidarcade/">
      <Routes>
        <Route path="/" element={<SimulationMenu />} />
        {simulations.map(({ path, Component: _Component }) => (
          <Route key={path} path={path} element={<_Component />} />
        ))}
      </Routes>
    </Router>
  );
}