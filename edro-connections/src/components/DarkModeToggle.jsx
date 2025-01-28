import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import './Styles.css';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
    return (
      <button
        onClick={toggleDarkMode}
        className={`
          p-2 
          rounded-lg 
          transition-all 
          duration-200 
          ${darkMode 
            ? 'bg-white text-black hover:bg-gray-100' 
            : 'bg-black text-white hover:bg-gray-800'
          }
        `}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
    );
  };
  
  export default DarkModeToggle;