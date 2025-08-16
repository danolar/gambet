import { useState } from 'react';
import { WalletButton } from './features/wallet';
import { NetworkSelectorCompact } from './features/chiliz';
import { AIAgentChat } from './features/ai';
import type { AIGeneratedBettingEvent } from './features/ai';
import './App.css';

function App() {
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  const handleBettingEventCreated = (event: AIGeneratedBettingEvent & { imageUrl: string }) => {
    console.log('New bet created:', event);
    // TODO: Implement logic to add bet to feed
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎲 Gambet Vision</h1>
          <div className="flex items-center space-x-4">
            <NetworkSelectorCompact />
            <button
              onClick={() => setIsAIAgentOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🤖 AI Agent
            </button>
            <WalletButton />
          </div>
        </div>
      </header>
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🔮 Visions Feed
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="bg-gray-600 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">⚽</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Argentina wins Copa América</h3>
              <p className="text-gray-300 mb-4">The team becomes champion</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-400 font-bold">2.5x</span>
                <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg">
                  Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Agent Chat */}
      <AIAgentChat
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
        onBettingEventCreated={handleBettingEventCreated}
      />
    </div>
  );
}

export default App;
