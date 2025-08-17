import { useVisions } from '../hooks/useVisions';
import type { Vision } from '../services/api';

export function FeaturedVisions() {
  const { visions, loading, error } = useVisions();

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading predictions from our community...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visions
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Error loading visions</p>
            <p className="text-sm text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Fallback data if no visions from API - adapted to match Vision type
  const fallbackVisions: Vision[] = [
    {
      id: 1,
      title: "Argentina Wins Copa América 2024",
      description: "Lionel Messi leads Argentina to another international triumph",
      category: "Football",
      odds: 2.5,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      creator_address: "CryptoPundit",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "NBA Finals: Lakers vs Celtics",
      description: "Historic rivalry renewed in the championship series",
      category: "Basketball",
      odds: 3.2,
      image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop&crop=center",
      creator_address: "SportsOracle",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "UFC 300: McGregor Returns",
      description: "The Notorious makes his comeback in the main event",
      category: "MMA",
      odds: 1.8,
      image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
      creator_address: "FightMaster",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Wimbledon: Djokovic vs Alcaraz",
      description: "Clash of generations in the grass court final",
      category: "Tennis",
      odds: 2.1,
      image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop&crop=center",
      creator_address: "TennisPro",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      title: "Champions League: Real Madrid vs PSG",
      description: "European giants face off in quarter-finals",
      category: "Football",
      odds: 2.8,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      creator_address: "EuroExpert",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      title: "Boxing: Fury vs Usyk Unification",
      description: "Heavyweight division gets unified champion",
      category: "Boxing",
      odds: 1.9,
      image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
      creator_address: "RingMaster",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 7,
      title: "F1 Monaco GP: Verstappen Pole",
      description: "Red Bull driver secures pole position in Monaco",
      category: "Formula 1",
      odds: 1.5,
      image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      creator_address: "SpeedDemon",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 8,
      title: "Olympics 100m: American Sweep",
      description: "USA takes gold, silver, and bronze in sprint",
      category: "Athletics",
      odds: 3.5,
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      creator_address: "TrackStar",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 9,
      title: "Golf Masters: Tiger Woods Comeback",
      description: "Tiger wins his sixth green jacket",
      category: "Golf",
      odds: 4.2,
      image_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop&crop=center",
      creator_address: "GolfGuru",
      network: "Chiliz",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayVisions = visions.length > 0 ? visions : fallbackVisions;

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {visions.length > 0 
              ? `Explore ${visions.length} predictions from our community`
              : "Explore all predictions from our community"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayVisions.map((vision) => (
            <div key={vision.id} className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={vision.image_url || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"} 
                  alt={vision.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#8fef70] text-[#131549] px-2 py-1 rounded-full text-sm font-bold">
                    {vision.odds}x
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                    {vision.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
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
                        {vision.creator_address?.charAt(0) || "A"}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {vision.creator_address || "Anonymous"}
                    </span>
                  </div>
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
