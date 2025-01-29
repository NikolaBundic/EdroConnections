export const saveGameState = (puzzleNumber, state) => {
    try {
      const stateToSave = {
        ...state,
        puzzleNumber
      };
      localStorage.setItem(`puzzle-${puzzleNumber}`, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  };
  
  export const loadGameState = (puzzleNumber) => {
    try {
      const saved = localStorage.getItem(`puzzle-${puzzleNumber}`);
      if (!saved) return null;
  
      const savedState = JSON.parse(saved);
      
      if (savedState.puzzleNumber === puzzleNumber) {
        const { puzzleNumber: _, ...stateWithoutPuzzleNumber } = savedState;
        return stateWithoutPuzzleNumber;
      }
      return null;
    } catch (e) {
      console.error('Error loading game state:', e);
      return null;
    }
  };

export const clearGameState = (puzzleNumber) => {
  try {
    localStorage.removeItem(`puzzle-${puzzleNumber}`);
  } catch (e) {
    console.error('Error clearing game state:', e);
  }
};