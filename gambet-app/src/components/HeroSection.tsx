export function HeroSection() {
  return (
    <section className="relative py-20 flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center w-full max-w-7xl mx-auto px-6 pt-12">
        {/* Banner Images - Carrusel horizontal más grande */}
        <div className="mb-8">
          <div className="flex justify-center space-x-8">
            <div className="flex-shrink-0">
              <img 
                src="/gambet_banner.png" 
                alt="Gambet Banner 1" 
                className="w-auto h-80 object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/gambet_banner.png" 
                alt="Gambet Banner 2" 
                className="w-auto h-80 object-contain"
              />
            </div>
            <div className="flex-shrink-0">
              <img 
                src="/gambet_banner.png" 
                alt="Gambet Banner 3" 
                className="w-auto h-80 object-contain"
              />
            </div>
          </div>
        </div>

        {/* AI-Powered Sports Predictions Badge - moved below banner */}
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI-Powered Sports Predictions
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delay" />
        </div>
      </div>
    </section>
  );
}
