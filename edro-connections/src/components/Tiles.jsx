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
            ? 'bg-black text-white shadow-lg scale-95' 
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
          }
        `}
        onClick={onClick}
      >
        {text}
      </div>
    );
  };
  
  export default Tile;