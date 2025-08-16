import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center">🎲 Gambet Vision</h1>
      </header>
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🔮 Feed de Visiones
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta de ejemplo simple */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="bg-gray-600 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">⚽</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Argentina gana Copa América</h3>
              <p className="text-gray-300 mb-4">La selección se corona campeona</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold">2.5x</span>
                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg">
                  Apostar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
