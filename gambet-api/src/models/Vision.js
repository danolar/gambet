import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false
});

export class Vision {
  static pool = null;

  static setPool(pool) {
    Vision.pool = pool;
  }

  static async createTable() {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    const query = `
      CREATE TABLE IF NOT EXISTS visions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        odds DECIMAL(5,2),
        image_url TEXT,
        creator_address VARCHAR(255),
        network VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await Vision.pool.query(query);
      console.log('Visions table created successfully');
    } catch (error) {
      console.error('Error creating visions table:', error);
      throw error;
    }
  }

  static async getAll() {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await Vision.pool.query(
        'SELECT * FROM visions ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching visions:', error);
      throw error;
    }
  }

  static async getById(id) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await Vision.pool.query(
        'SELECT * FROM visions WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching vision by id:', error);
      throw error;
    }
  }

  static async create(visionData) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    const { title, description, category, odds, image_url, creator_address, network } = visionData;
    
    try {
      const result = await Vision.pool.query(
        `INSERT INTO visions (title, description, category, odds, image_url, creator_address, network)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, description, category, odds, image_url, creator_address, network]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating vision:', error);
      throw error;
    }
  }

  static async update(id, visionData) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    const { title, description, category, odds, image_url, status } = visionData;
    
    try {
      const result = await Vision.pool.query(
        `UPDATE visions 
         SET title = $1, description = $2, category = $3, odds = $4, image_url = $5, status = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [title, description, category, odds, image_url, status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating vision:', error);
      throw error;
    }
  }

  static async delete(id) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await Vision.pool.query(
        'DELETE FROM visions WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting vision:', error);
      throw error;
    }
  }

  static async getByCategory(category) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await Vision.pool.query(
        'SELECT * FROM visions WHERE category = $1 ORDER BY created_at DESC',
        [category]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching visions by category:', error);
      throw error;
    }
  }

  static async getByCreator(creatorAddress) {
    if (!Vision.pool) {
      throw new Error('Database pool not initialized');
    }

    try {
      const result = await Vision.pool.query(
        'SELECT * FROM visions WHERE creator_address = $1 ORDER BY created_at DESC',
        [creatorAddress]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching visions by creator:', error);
      throw error;
    }
  }
}
