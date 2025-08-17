import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import visionRoutes from './routes/visions.js';
import { Vision } from './models/Vision.js';

// Load environment variables
dotenv.config();

// Debug: Log environment variables
console.log('🔍 Environment variables loaded:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Debug: Show connection string parts (without password)
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log('🔗 Connection details:');
  console.log('  Protocol:', url.protocol);
  console.log('  Host:', url.hostname);
  console.log('  Port:', url.port);
  console.log('  Database:', url.pathname.substring(1));
  console.log('  Username:', url.username);
  console.log('  SSL Mode:', url.searchParams.get('sslmode'));
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with proper Neon SSL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
});

// Set the pool for the Vision model
Vision.setPool(pool);

// Test database connection and create tables
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
    
    // Create tables
    try {
      await Vision.createTable();
      console.log('✅ Database tables initialized');
    } catch (error) {
      console.error('❌ Error initializing tables:', error);
    }
  }
});

// Routes
app.use('/api/visions', visionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gambet API is running!',
    version: '1.0.0',
    endpoints: {
      visions: '/api/visions',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gambet API server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET  /api/visions`);
  console.log(`   - POST /api/visions`);
  console.log(`   - GET  /api/visions/:id`);
  console.log(`   - PUT  /api/visions/:id`);
  console.log(`   - DELETE /api/visions/:id`);
});
