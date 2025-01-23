import React from 'react';
import GameBoard from './components/Gameboard';
import './App.css'

function App() {

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="text-2xl sm:text-3xl font-bold text-gray-800 p-4 sm:p-6">
        EdroConnections
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <GameBoard />
      </div>
    </div>
  )
}

export default App
