import express from 'express';
import { visionController } from '../controllers/visionController.js';

const router = express.Router();

// GET /api/visions - Get all visions
router.get('/', visionController.getAllVisions);

// GET /api/visions/:id - Get vision by ID
router.get('/:id', visionController.getVisionById);

// POST /api/visions - Create new vision
router.post('/', visionController.createVision);

// PUT /api/visions/:id - Update vision
router.put('/:id', visionController.updateVision);

// DELETE /api/visions/:id - Delete vision
router.delete('/:id', visionController.deleteVision);

// GET /api/visions/category/:category - Get visions by category
router.get('/category/:category', visionController.getVisionsByCategory);

// GET /api/visions/creator/:address - Get visions by creator address
router.get('/creator/:address', visionController.getVisionsByCreator);

export default router;
