export function TopCreators() {
  const topCreators = [
    {
      id: 1,
      name: "CryptoPundit",
      avatar: "CP",
      followers: "12.5K",
      visions: 47,
      accuracy: 92,
      category: "Football Expert"
    },
    {
      id: 2,
      name: "SportsOracle",
      avatar: "SO",
      followers: "8.9K",
      visions: 34,
      accuracy: 89,
      category: "Basketball Specialist"
    },
    {
      id: 3,
      name: "FightMaster",
      avatar: "FM",
      followers: "6.2K",
      visions: 28,
      accuracy: 87,
      category: "MMA Analyst"
    },
    {
      id: 4,
      name: "TennisPro",
      avatar: "TP",
      followers: "5.8K",
      visions: 31,
      accuracy: 91,
      category: "Tennis Expert"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow successful prediction creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCreators.map((creator) => (
            <div key={creator.id} className="group relative p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-neon">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold text-primary-foreground">
                    {creator.avatar}
                  </span>
                </div>
                
                {/* Creator Info */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {creator.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {creator.category}
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-primary">{creator.followers}</div>
                    <div className="text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-accent">{creator.visions}</div>
                    <div className="text-muted-foreground">Visions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-success">{creator.accuracy}%</div>
                    <div className="text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
