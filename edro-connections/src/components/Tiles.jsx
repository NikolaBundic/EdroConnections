import React from 'react';
import './Styles.css';

const Tile = ({ text, isSelected, onClick }) => {
    return (
      <div 
        className={`
          p-6 sm:p-8
          rounded-lg 
          font-semibold 
          text-center 
          cursor-pointer 
          transition-all 
          duration-200 
          select-none
          aspect-ratio-square
          flex items-center justify-center
          ${text.length > 8 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}
          ${isSelected 
            ? 'bg-black dark:bg-gray-200 text-white dark:text-gray-800 shadow-lg scale-95' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
          }
        `}
        onClick={onClick}
      >
        {text}
      </div>
    );
  };
  
  export default Tile;