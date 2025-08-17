import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './App.css';
import { HeroSection, FeaturedVisions, TopCreators } from './components';
import { AIAgentChat } from './features/ai/AIAgentChat';
import { WalletButton } from './features/wallet/WalletButton';
import type { AIGeneratedBettingEvent } from './features/ai/openaiService';

const queryClient = new QueryClient();

function App() {
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  const handleBettingEventCreated = (event: AIGeneratedBettingEvent & { imageUrl: string }) => {
    console.log('New bet created:', event);
    setIsAIAgentOpen(false);
    // TODO: Implement logic to add bet to feed
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gradient-primary">
                  Gambet
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="#visions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visions
                </a>
                <a href="#creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Creators
                </a>
                <button 
                  onClick={() => setIsAIAgentOpen(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  AI Agent
                </button>
                <WalletButton />
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <HeroSection />

          {/* Visions */}
          <div id="visions">
            <FeaturedVisions />
          </div>

          {/* Top Creators */}
          <div id="creators">
            <TopCreators />
          </div>

          {/* Footer */}
          <footer className="border-t border-border/50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a2 2 0 114 0 2 2 0 01-4 0z"/>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-gradient-primary">
                    Gambet
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Built on Chiliz Chain • Powered by OpenAI
                </div>
              </div>
            </div>
          </footer>

          {/* AI Agent Chat */}
          <AIAgentChat 
            isOpen={isAIAgentOpen}
            onClose={() => setIsAIAgentOpen(false)}
            onBettingEventCreated={handleBettingEventCreated}
          />
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
