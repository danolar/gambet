import { Vision } from '../models/Vision.js';

export const visionController = {
  // Get all visions
  async getAllVisions(req, res) {
    try {
      const visions = await Vision.getAll();
      res.json({
        success: true,
        data: visions,
        count: visions.length
      });
    } catch (error) {
      console.error('Error in getAllVisions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Get vision by ID
  async getVisionById(req, res) {
    try {
      const { id } = req.params;
      const vision = await Vision.getById(id);
      
      if (!vision) {
        return res.status(404).json({
          success: false,
          error: 'Vision not found'
        });
      }

      res.json({
        success: true,
        data: vision
      });
    } catch (error) {
      console.error('Error in getVisionById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Create new vision
  async createVision(req, res) {
    try {
      const visionData = req.body;
      
      // Validate required fields
      if (!visionData.title || !visionData.category) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Title and category are required'
        });
      }

      // Validate odds if provided
      if (visionData.odds && (visionData.odds <= 0 || visionData.odds > 100)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Odds must be between 0 and 100'
        });
      }

      // Validate image_url if provided
      if (visionData.image_url && !visionData.image_url.startsWith('http')) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Image URL must be a valid HTTP/HTTPS URL'
        });
      }

      // Convert image URL to base64 if image_data is not provided
      let finalVisionData = { ...visionData };
      
      if (visionData.image_url && !visionData.image_data) {
        try {
          const imageResponse = await fetch(visionData.image_url);
          if (imageResponse.ok) {
            const buffer = await imageResponse.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const mimeType = imageResponse.headers.get('content-type') || 'image/png';
            finalVisionData.image_data = `data:${mimeType};base64,${base64}`;
          }
        } catch (imageError) {
          console.warn('Warning: Could not convert image to base64:', imageError);
          // Continue without base64 conversion
        }
      }

      // Set default values
      const visionToCreate = {
        ...finalVisionData,
        creator_address: finalVisionData.creator_address || 'Anonymous',
        network: finalVisionData.network || 'Chiliz',
        status: 'active'
      };

      const newVision = await Vision.create(visionToCreate);
      
      res.status(201).json({
        success: true,
        data: newVision,
        message: 'Vision created successfully'
      });
    } catch (error) {
      console.error('Error in createVision:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Update vision
  async updateVision(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedVision = await Vision.update(id, updateData);
      
      if (!updatedVision) {
        return res.status(404).json({
          success: false,
          error: 'Vision not found'
        });
      }

      res.json({
        success: true,
        data: updatedVision,
        message: 'Vision updated successfully'
      });
    } catch (error) {
      console.error('Error in updateVision:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Delete vision
  async deleteVision(req, res) {
    try {
      const { id } = req.params;
      const deletedVision = await Vision.delete(id);
      
      if (!deletedVision) {
        return res.status(404).json({
          success: false,
          error: 'Vision not found'
        });
      }

      res.json({
        success: true,
        data: deletedVision,
        message: 'Vision deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteVision:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Get visions by category
  async getVisionsByCategory(req, res) {
    try {
      const { category } = req.params;
      const visions = await Vision.getByCategory(category);
      
      res.json({
        success: true,
        data: visions,
        count: visions.length,
        category
      });
    } catch (error) {
      console.error('Error in getVisionsByCategory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  },

  // Get visions by creator
  async getVisionsByCreator(req, res) {
    try {
      const { address } = req.params;
      const visions = await Vision.getByCreator(address);
      
      res.json({
        success: true,
        data: visions,
        count: visions.length,
        creator: address
      });
    } catch (error) {
      console.error('Error in getVisionsByCreator:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  }
};
