import React, { useState, useEffect } from 'react';
import Tile from './Tiles';
import './Styles.css';

const GameBoard = () => {
    const [words, setWords] = useState([
      'APPLE', 'BANANA', 'ORANGE', 'GRAPE',
      'KIWI', 'MANGO', 'PEACH', 'PEAR',
      'PLUM', 'LEMON', 'LIME', 'CHERRY',
      'FIG', 'DATE', 'MELON', 'BERRY'
    ]);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [attempts, setAttempts] = useState(4);
    const [solvedCombinations, setSolvedCombinations] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
  
    const validCombinations = [
      {
        words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
        category: 'Common Fruits',
        color: 'yellow'
      },
      {
        words: ['KIWI', 'MANGO', 'PEACH', 'PEAR'],
        category: 'More Fruits',
        color: 'green'
      },
      {
        words: ['PLUM', 'LEMON', 'LIME', 'CHERRY'],
        category: 'Even More Fruits',
        color: 'blue'
      },
      {
        words: ['FIG', 'DATE', 'MELON', 'BERRY'],
        category: 'Even More Different Fruits',
        color: 'purple'
      },
    ];
  
    const getCategoryColorClass = (color) => {
      const colorClasses = {
        yellow: 'bg-yellow-400',
        green: 'bg-green-500',
        blue: 'bg-blue-400',
        purple: 'bg-purple-500'
      };
      return colorClasses[color] || 'bg-gray-500';
    };
  
    const initialShuffle = () => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWords(shuffled);
    };
  
    useEffect(() => {
      initialShuffle();
    }, []);
  
    const showNotification = (message, type) => {
      setNotification({ message: '', type: '', show: false });
      
      setTimeout(() => {
        setNotification({ message, type, show: true });
        
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 2000);
      }, 100);
    };
  
    const handleTileClick = (index) => {
      if (selectedTiles.includes(index)) {
        setSelectedTiles(selectedTiles.filter(i => i !== index));
      } else if (selectedTiles.length < 4) {
        setSelectedTiles([...selectedTiles, index]);
      }
    };
  
    const shuffleWords = () => {
      const selectionMap = new Map(
        words.map((word, index) => [word, selectedTiles.includes(index)])
      );
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      const newSelectedTiles = shuffled.map(
        (word, index) => selectionMap.get(word) ? index : null
      ).filter(index => index !== null);
  
      setWords(shuffled);
      setSelectedTiles(newSelectedTiles);
    };
  
    const handleSubmit = () => {
        if (attempts <= 0) {
          showNotification('No more attempts remaining! Game Over!', 'error');
          return;
        }
    
        const selectedWords = selectedTiles.map(index => words[index]);
        
        const matchingCombination = validCombinations.find(combo => 
          selectedWords.every(word => combo.words.includes(word)) &&
          combo.words.every(word => selectedWords.includes(word))
        );
    
        const oneAwayMatch = validCombinations.find(combo => {
          const matchingWords = selectedWords.filter(word => combo.words.includes(word));
          return matchingWords.length === 3;
        });
    
        if (matchingCombination) {
          if (solvedCombinations.includes(matchingCombination)) {
            showNotification('You already found this combination!', 'error');
          } else {
            setSolvedCombinations([...solvedCombinations, matchingCombination]);
            showNotification(`Correct! ${matchingCombination.category}!`, 'success');
            setSelectedTiles([]);
          }
        } else if (oneAwayMatch) {
          setAttempts(attempts - 1);
          showNotification('One away...', 'warning');
        } else {
          setAttempts(attempts - 1);
          if (attempts - 1 <= 0) {
            showNotification('Game Over! No more attempts remaining.', 'error');
          } else {
            showNotification(`Wrong combination. ${attempts - 1} attempts remaining.`, 'error');
          }
        }
    };
  
    const isGameOver = attempts <= 0 || solvedCombinations.length === validCombinations.length;
  
    const isWordInSolvedCombination = (word) => {
      return solvedCombinations.some(combo => combo.words.includes(word));
    };
  
    return (
      <div className="w-full max-w-md mx-auto relative">
        {/* Solved Combinations */}
        {solvedCombinations.map((combo, index) => (
          <div 
            key={`solved-${index}`}
            className={`
              w-full 
              mb-2 
              p-4 sm:p-6
              ${getCategoryColorClass(combo.color)}
              text-white 
              rounded-lg 
              shadow-md
              cursor-default
            `}
          >
            <div className="font-bold mb-1">{combo.category}</div>
            <div className="text-sm">{combo.words.join(' • ')}</div>
          </div>
        ))}
  
        {/* Active Game Board */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {words.map((word, index) => (
            !isWordInSolvedCombination(word) && (
              <Tile
                key={index}
                text={word}
                isSelected={selectedTiles.includes(index)}
                onClick={() => !isGameOver && handleTileClick(index)}
              />
            )
          ))}
        </div>
  
        {/* Mistakes Remaining Dots */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="text-gray-700">Mistakes Remaining:</div>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full
                transition-all duration-300
                ${index < attempts 
                  ? 'bg-black' 
                  : 'bg-gray-300'
                }
              `}
            />
          ))}
        </div>
  
        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={shuffleWords}
            disabled={isGameOver}
            className={`
              font-bold 
              py-2 
              px-4 
              rounded-lg
              transition-all
              duration-200
              shadow-md
              hover:shadow-lg
              active:scale-95
              ${isGameOver 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
              }
            `}
          >
            Shuffle
          </button>
          <button
            onClick={() => setSelectedTiles([])}
            disabled={selectedTiles.length === 0 || isGameOver}
            className={`
              font-bold 
              py-2 
              px-4 
              rounded-lg
              transition-all
              duration-200
              shadow-md
              hover:shadow-lg
              active:scale-95
              ${selectedTiles.length > 0 && !isGameOver
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            Deselect All
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedTiles.length !== 4 || isGameOver}
            className={`
              font-bold 
              py-2 
              px-4 
              rounded-lg
              transition-all
              duration-200
              shadow-md
              hover:shadow-lg
              active:scale-95
              ${selectedTiles.length === 4 && !isGameOver
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            Submit
          </button>
        </div>
  
        {/* Game Over Message */}
        {isGameOver && (
          <div className="text-center mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="text-xl font-bold text-gray-800 mb-2">
              Game Over!
            </div>
            <div className="text-gray-600">
              {solvedCombinations.length === validCombinations.length 
                ? 'Congratulations! You found all groups!' 
                : `You found ${solvedCombinations.length} out of ${validCombinations.length} groups.`}
            </div>
          </div>
        )}
  
        {/* Notification */}
        <div
        className={`
            fixed bottom-4 left-1/2 -translate-x-1/2
            px-4 py-2 rounded-lg shadow-lg
            transition-all duration-300
            ${notification.show 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-full'}
            ${notification.type === 'success' 
            ? 'bg-green-500' 
            : notification.type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-red-500'}
            text-white
        `}
        >
        {notification.message}
        </div>
      </div>
    );
  };
  
  export default GameBoard;