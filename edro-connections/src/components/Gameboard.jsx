import React, { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Tile from './Tiles';
import './Styles.css';

const GameBoard = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [attempts, setAttempts] = useState(4);
  const [solvedCombinations, setSolvedCombinations] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const [allPuzzles, setAllPuzzles] = useState([]);
  const [currentPuzzleNumber, setCurrentPuzzleNumber] = useState(null);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const smartShuffle = (combinations) => {
    const taggedWords = combinations.flatMap((combo, groupIndex) =>
      combo.words.map(word => ({ word, groupIndex }))
    );

    let shuffled = [];
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      shuffled = shuffleArray([...taggedWords]);

      let isValid = true;
      for (let i = 0; i < shuffled.length - 1; i++) {
        if (shuffled[i].groupIndex === shuffled[i + 1].groupIndex) {
          isValid = false;
          break;
        }
      }

      if (isValid) break;
      attempts++;
    }

    return shuffled.map(item => item.word);
  };

  useEffect(() => {
    const loadPuzzleIndex = async () => {
      try {
        const indexData = await import('../puzzles/index.json');
        const puzzles = indexData.puzzles;
        setAllPuzzles(puzzles);
        const latestPuzzle = Math.max(...puzzles.map(p => p.number));
        setCurrentPuzzleNumber(latestPuzzle);
      } catch (error) {
        console.error('Error loading puzzle index:', error);
      }
    };

    loadPuzzleIndex();
  }, []);

  useEffect(() => {
    if (currentPuzzleNumber) {
      const loadPuzzle = async () => {
        try {
          setLoading(true);
          setSelectedTiles([]);
          setAttempts(4);
          setSolvedCombinations([]);
          setNotification({ message: '', type: '', show: false });

          const puzzleData = await import(`../puzzles/${currentPuzzleNumber}.json`);
          setPuzzle(puzzleData);
          const shuffledWords = smartShuffle(puzzleData.combinations);
          setWords(shuffledWords);
          setLoading(false);
        } catch (error) {
          console.error('Error loading puzzle:', error);
        }
      };

      loadPuzzle();
    }
  }, [currentPuzzleNumber]);

  if (loading) {
    return <div className="flex justify-center items-center text-black dark:text-gray-300 text-xl">Loading puzzle...</div>;
  }

  const getCategoryColorClass = (color) => {
    const colorClasses = {
      yellow: 'bg-yellow-600',
      green: 'bg-green-500',
      blue: 'bg-blue-400',
      purple: 'bg-purple-500'
    };
    return colorClasses[color] || 'bg-gray-500';
  };

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

    const shuffled = smartShuffle(puzzle.combinations);

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

    const matchingCombination = puzzle.combinations.find(combo =>
      selectedWords.every(word => combo.words.includes(word)) &&
      combo.words.every(word => selectedWords.includes(word))
    );

    const oneAwayMatch = puzzle.combinations.find(combo => {
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

  const isGameOver = attempts <= 0 || solvedCombinations.length === puzzle.combinations.length;

  const isWordInSolvedCombination = (word) => {
    return solvedCombinations.some(combo => combo.words.includes(word));
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Level and Select */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-black dark:text-gray-300 m-1">{puzzle.name}</span>
        </div>
        <div className="ml-auto w-48 m-1">
          <Listbox value={currentPuzzleNumber} onChange={setCurrentPuzzleNumber}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                <span className="block truncate text-gray-900 dark:text-white">
                  Puzzle #{currentPuzzleNumber}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {allPuzzles.map((puzzle) => (
                    <Listbox.Option
                      key={puzzle.number}
                      value={puzzle.number}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-900 dark:text-gray-200'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            #{puzzle.number} - {puzzle.name}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black dark:text-white">
                              ✓
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <hr className="border-black dark:border-gray-300 border-t-2 mb-4 ml-1 mr-1" />

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
        <div className="text-gray-700 dark:text-gray-300">Mistakes Remaining:</div>
        {[...Array(4)].map((_, index) => (
          <div
          key={index}
          className={`
            w-3 h-3 rounded-full
            transition-all duration-300
            ${index < attempts 
              ? 'bg-black dark:bg-white' 
              : 'bg-gray-300 dark:bg-gray-700'
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
              : 'bg-black dark:bg-gray-800 hover:bg-gray-800 hover:text-white dark:hover:dark:bg-gray-200 text-white dark:hover:text-gray-800 cursor-pointer'
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
              ? 'bg-black dark:bg-gray-800 hover:bg-gray-800 hover:text-white dark:hover:dark:bg-gray-200 text-white dark:hover:text-gray-800 cursor-pointer'
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
              ? 'bg-black dark:bg-gray-800 hover:bg-gray-800 hover:text-white dark:hover:dark:bg-gray-200 text-white dark:hover:text-gray-800 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          Submit
        </button>
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <div className="text-center mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-2">
            Game Over!
          </div>
          <div className="text-gray-600 dark:text-gray-500">
            {solvedCombinations.length === puzzle.combinations.length
              ? 'Congratulations! You found all groups!'
              : `You found ${solvedCombinations.length} out of ${puzzle.combinations.length} groups.`}
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
            ? 'bg-green-600'
            : notification.type === 'warning'
              ? 'bg-yellow-600'
              : 'bg-red-600'}
          text-white
        `}
      >
        {notification.message}
      </div>
    </div>
  );
};

export default GameBoard;