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
          error: 'Title and category are required'
        });
      }

      const newVision = await Vision.create(visionData);
      
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
