import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
});

const sampleVisions = [
  {
    title: "Argentina Wins Copa América 2024",
    description: "Lionel Messi leads Argentina to another international triumph",
    category: "Football",
    odds: 2.5,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0x1234567890abcdef",
    network: "Chiliz"
  },
  {
    title: "NBA Finals: Lakers vs Celtics",
    description: "Historic rivalry renewed in the championship series",
    category: "Basketball",
    odds: 3.2,
    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop&crop=center",
    creator_address: "0xabcdef1234567890",
    network: "Chiliz"
  },
  {
    title: "UFC 300: McGregor Returns",
    description: "The Notorious makes his comeback in the main event",
    category: "MMA",
    odds: 1.8,
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0x9876543210fedcba",
    network: "Chiliz"
  },
  {
    title: "Wimbledon: Djokovic vs Alcaraz",
    description: "Clash of generations in the grass court final",
    category: "Tennis",
    odds: 2.1,
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop&crop=center",
    creator_address: "0xfedcba0987654321",
    network: "Chiliz"
  },
  {
    title: "Champions League: Real Madrid vs PSG",
    description: "European giants face off in quarter-finals",
    category: "Football",
    odds: 2.8,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0xabcdef1234567890",
    network: "Chiliz"
  },
  {
    title: "Boxing: Fury vs Usyk Unification",
    description: "Heavyweight division gets unified champion",
    category: "Boxing",
    odds: 1.9,
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0x1234567890abcdef",
    network: "Chiliz"
  },
  {
    title: "F1 Monaco GP: Verstappen Pole",
    description: "Red Bull driver secures pole position in Monaco",
    category: "Formula 1",
    odds: 1.5,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
    creator_address: "0x9876543210fedcba",
    network: "Chiliz"
  },
  {
    title: "Olympics 100m: American Sweep",
    description: "USA takes gold, silver, and bronze in sprint",
    category: "Athletics",
    odds: 3.5,
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0xfedcba0987654321",
    network: "Chiliz"
  },
  {
    title: "Golf Masters: Tiger Woods Comeback",
    description: "Tiger wins his sixth green jacket",
    category: "Golf",
    odds: 4.2,
    image_url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop&crop=center",
    creator_address: "0xabcdef1234567890",
    network: "Chiliz"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await pool.query('DELETE FROM visions');
    console.log('🗑️  Cleared existing visions');
    
    // Insert sample data
    for (const vision of sampleVisions) {
      const result = await pool.query(
        `INSERT INTO visions (title, description, category, odds, image_url, creator_address, network)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [vision.title, vision.description, vision.category, vision.odds, vision.image_url, vision.creator_address, vision.network]
      );
      console.log(`✅ Inserted vision: ${vision.title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Total visions created: ${sampleVisions.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase();
