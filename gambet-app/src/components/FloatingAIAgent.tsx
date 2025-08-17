import { useState } from 'react';
import { AIAgentChat } from '../features/ai/AIAgentChat';
import { useVisions } from '../hooks/useVisions';
import { useWallet } from '../features/wallet/useWallet';
import type { AIGeneratedBettingEvent } from '../features/ai/openaiService';

export function FloatingAIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const { createVision } = useVisions();
  const { address } = useWallet();

  const handleOpenAI = () => {
    setIsOpen(true);
  };

  const handleBettingEventCreated = async (event: AIGeneratedBettingEvent & { imageUrl: string }) => {
    try {
      console.log('New bet created by AI:', event);
      
      // Create vision data from AI generated event
      const visionData = {
        title: event.title,
        description: event.description,
        category: event.category,
        odds: event.initialOdds,
        image_url: event.imageUrl, // Backend will convert to base64
        creator_address: address || 'AI Generated', // Use actual wallet address if available
        network: 'Chiliz'
      };

      // Save to database using the hook
      const newVision = await createVision(visionData);
      console.log('Vision saved to database:', newVision);
      
      // Close the modal
      setIsOpen(false);
      
      // Show success message (you can add a toast notification here)
      alert('Prediction created and published successfully!');
      
    } catch (error) {
      console.error('Error saving AI generated vision:', error);
      alert('Error saving prediction. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpenAI}
          className="group relative px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 bg-gradient-to-r from-[#8fef70] to-[#131549] text-white"
          aria-label="Open AI Agent"
        >
          {/* Main Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Text */}
          <span className="font-semibold text-lg">
            Wanna Bet?
          </span>
        </button>
      </div>

      {/* AI Agent Chat */}
      <AIAgentChat 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onBettingEventCreated={handleBettingEventCreated}
        walletAddress={address}
      />
    </>
  );
}
