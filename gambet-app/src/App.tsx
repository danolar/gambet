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

          {/* Floating AI Agent Button */}
          <FloatingAIAgent />
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
