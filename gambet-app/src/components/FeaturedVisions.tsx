import React from 'react';

export function FeaturedVisions() {
  const visions = [
    {
      id: 1,
      title: "Argentina Wins Copa América 2024",
      description: "Lionel Messi leads Argentina to another international triumph",
      category: "Football",
      odds: 2.5,
      image: "⚽",
      creator: "CryptoPundit"
    },
    {
      id: 2,
      title: "NBA Finals: Lakers vs Celtics",
      description: "Historic rivalry renewed in the championship series",
      category: "Basketball",
      odds: 3.2,
      image: "🏀",
      creator: "SportsOracle"
    },
    {
      id: 3,
      title: "UFC 300: McGregor Returns",
      description: "The Notorious makes his comeback in the main event",
      category: "MMA",
      odds: 1.8,
      image: "🥊",
      creator: "FightMaster"
    },
    {
      id: 4,
      title: "Wimbledon: Djokovic vs Alcaraz",
      description: "Clash of generations in the grass court final",
      category: "Tennis",
      odds: 2.1,
      image: "🎾",
      creator: "TennisPro"
    },
    {
      id: 5,
      title: "Champions League: Real Madrid vs PSG",
      description: "European giants face off in quarter-finals",
      category: "Football",
      odds: 2.8,
      image: "⚽",
      creator: "EuroExpert"
    },
    {
      id: 6,
      title: "Boxing: Fury vs Usyk Unification",
      description: "Heavyweight division gets unified champion",
      category: "Boxing",
      odds: 1.9,
      image: "🥊",
      creator: "RingMaster"
    },
    {
      id: 7,
      title: "F1 Monaco GP: Verstappen Pole",
      description: "Red Bull driver secures pole position in Monaco",
      category: "Formula 1",
      odds: 1.5,
      image: "🏎️",
      creator: "SpeedDemon"
    },
    {
      id: 8,
      title: "Olympics 100m: American Sweep",
      description: "USA takes gold, silver, and bronze in sprint",
      category: "Athletics",
      odds: 3.5,
      image: "🏃",
      creator: "TrackStar"
    },
    {
      id: 9,
      title: "Golf Masters: Tiger Woods Comeback",
      description: "Tiger wins his sixth green jacket",
      category: "Golf",
      odds: 4.2,
      image: "⛳",
      creator: "GolfGuru"
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all predictions from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visions.map((vision) => (
            <div key={vision.id} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{vision.image}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{vision.odds}x</div>
                    <div className="text-sm text-muted-foreground">Odds</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {vision.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                  {vision.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {vision.creator.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{vision.creator}</span>
                  </div>
                  
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {vision.category}
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
