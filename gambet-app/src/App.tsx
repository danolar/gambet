import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { HeroSection, FeaturedVisions, TopCreators, FloatingAIAgent } from './components';
import { WalletButton } from './features/wallet/WalletButton';
import { useChilizNetwork } from './features/chiliz/useChilizNetwork';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { networkName, isSpicyTestnet, isMainnet, currentChainId } = useChilizNetwork();

  // Debug logs
  console.log('Network Debug:', { networkName, isSpicyTestnet, isMainnet, currentChainId });

  // Determinar el icono basado en la red
  const getNetworkIcon = () => {
    if (isSpicyTestnet) return '🌶️';
    if (isMainnet) return '🔥';
    if (currentChainId) return '🔗';
    return '🌐';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/gambet_logo.svg" 
                  alt="Gambet Logo" 
                  className="h-8 w-auto"
                />
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <a href="#visions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visions
                </a>
                <a href="#creators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Creators
                </a>
                
                {/* Network Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#131549] rounded-lg border border-[#8fef70]/30">
                  <span className="text-[#8fef70] text-lg">{getNetworkIcon()}</span>
                  <span className="text-white text-sm font-medium">
                    {networkName || 'Loading...'}
                  </span>
                </div>
                
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
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-4">
                <img 
                  src="/gambet_logo.svg" 
                  alt="Gambet Logo" 
                  className="h-12 w-auto mx-auto"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Built on Chiliz Chain • Powered by OpenAI
              </div>
            </div>
          </footer>

          {/* Floating AI Agent Button */}
          <FloatingAIAgent />
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
