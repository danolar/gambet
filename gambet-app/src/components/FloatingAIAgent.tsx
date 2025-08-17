import React, { useState } from 'react';
import { AIAgentChat } from '../features/ai/AIAgentChat';
import type { AIGeneratedBettingEvent } from '../features/ai/openaiService';

export function FloatingAIAgent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleBettingEventCreated = (event: AIGeneratedBettingEvent & { imageUrl: string }) => {
    console.log('New bet created:', event);
    setIsOpen(false);
    // TODO: Implement logic to add bet to feed
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-[#8fef70] to-[#131549] text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
          aria-label="Open AI Agent"
        >
          {/* Main Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Text */}
          <span className="text-white font-semibold text-lg">Wanna Bet?</span>
        </button>
      </div>

      {/* AI Agent Chat */}
      <AIAgentChat 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBettingEventCreated={handleBettingEventCreated}
      />
    </>
  );
}
