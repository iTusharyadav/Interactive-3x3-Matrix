import React, { useState, useCallback, useRef } from 'react';
import { RotateCcw, HelpCircle, X } from 'lucide-react';

interface Cell {
  id: number;
  color: string;
  clickOrder: number | null;
}

function App() {
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      color: 'white',
      clickOrder: null,
    }))
  );
  const clickCountRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCellClick = useCallback((index: number) => {
    if (isAnimating) return;

    setCells((prevCells) => {
      if (prevCells[index].color !== 'white') return prevCells;

      const newCells = [...prevCells];
      newCells[index] = {
        ...newCells[index],
        color: 'green',
        clickOrder: index === 8 ? null : clickCountRef.current,
      };
      
      clickCountRef.current += 1;

      if (index === 8) {
        setIsAnimating(true);
        
        const clickedCells = newCells
          .filter((cell) => cell.clickOrder !== null)
          .sort((a, b) => (a.clickOrder || 0) - (b.clickOrder || 0));

        clickedCells.forEach((cell, i) => {
          setTimeout(() => {
            setCells((prev) => {
              const updated = [...prev];
              updated[cell.id] = { ...cell, color: 'orange' };
              return updated;
            });
            
            if (i === clickedCells.length - 1) {
              setIsAnimating(false);
            }
          }, i * 300);
        });
      }

      return newCells;
    });
  }, [isAnimating]);

  const resetGame = () => {
    setCells(
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        color: 'white',
        clickOrder: null,
      }))
    );
    clickCountRef.current = 0;
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-start px-4 py-6 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
        Interactive 3x3 Matrix
      </h1>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg">
        <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-lg w-full">
          <div 
            className="grid grid-cols-3 gap-1.5 sm:gap-3"
            role="grid"
            aria-label="Color matrix game grid"
          >
            {cells.map((cell, index) => (
              <button
                key={cell.id}
                onClick={() => handleCellClick(index)}
                className="aspect-square w-full border-2 border-gray-200 rounded-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-75"
                style={{
                  backgroundColor: cell.color,
                }}
                disabled={isAnimating}
                aria-label={`Cell ${index + 1}`}
                role="gridcell"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs sm:max-w-md justify-center">
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
            aria-label="Reset game"
          >
            <RotateCcw size={18} />
            Reset Game
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
            aria-label="Show instructions"
          >
            <HelpCircle size={18} />
            Instructions
          </button>
        </div>

        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative animate-fade-in">
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close instructions"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-semibold mb-4 pr-8">How to Play</h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded bg-green-500 flex-shrink-0 mt-1" />
                  <p>Click any cell to turn it green. You can click cells in any order you like.</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded bg-orange-500 flex-shrink-0 mt-1" />
                  <p>When you click the bottom-right cell, watch as your previously clicked cells turn orange in sequence!</p>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  Use the Reset button anytime to start a new game. Have fun!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;