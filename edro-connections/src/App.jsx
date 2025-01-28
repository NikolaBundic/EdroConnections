import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import DarkModeToggle from './components/DarkModeToggle';
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          EdroConnections
        </h1>
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <GameBoard />
      </div>
    </div>
  );
}

export default App;