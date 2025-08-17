import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Vision, CreateVisionData } from '../services/api';

export const useVisions = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all visions
  const fetchVisions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVisions();
      setVisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visions');
      console.error('Error fetching visions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new vision
  const createVision = useCallback(async (visionData: CreateVisionData) => {
    try {
      setError(null);
      const newVision = await apiService.createVision(visionData);
      
      // Add new vision to the beginning of the list
      setVisions(prev => [newVision, ...prev]);
      
      // Return the new vision for further processing
      return newVision;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vision';
      setError(errorMessage);
      console.error('Error creating vision:', err);
      throw err;
    }
  }, []);

  // Refresh visions (useful for real-time updates)
  const refreshVisions = useCallback(async () => {
    try {
      setError(null);
      const data = await apiService.getVisions();
      setVisions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh visions';
      setError(errorMessage);
      console.error('Error refreshing visions:', err);
    }
  }, []);

  // Optimistic update for better UX
  const optimisticCreateVision = useCallback(async (visionData: CreateVisionData) => {
    try {
      setError(null);
      
      // Create optimistic vision with temporary ID
      const optimisticVision: Vision = {
        id: Date.now(), // Temporary ID
        ...visionData,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add optimistic vision immediately
      setVisions(prev => [optimisticVision, ...prev]);
      
      // Actually create the vision
      const newVision = await apiService.createVision(visionData);
      
      // Replace optimistic vision with real one
      setVisions(prev => prev.map(vision => 
        vision.id === optimisticVision.id ? newVision : vision
      ));
      
      return newVision;
    } catch (err) {
      // Remove optimistic vision on error
      setVisions(prev => prev.filter(vision => vision.id !== Date.now()));
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to create vision';
      setError(errorMessage);
      console.error('Error creating vision:', err);
      throw err;
    }
  }, []);

  // Update vision
  const updateVision = useCallback(async (id: number, visionData: Partial<CreateVisionData>) => {
    try {
      setError(null);
      const updatedVision = await apiService.updateVision(id, visionData);
      setVisions(prev => prev.map(vision => 
        vision.id === id ? updatedVision : vision
      ));
      return updatedVision;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update vision';
      setError(errorMessage);
      console.error('Error creating vision:', err);
      throw err;
    }
  }, []);

  // Delete vision
  const deleteVision = useCallback(async (id: number) => {
    try {
      setError(null);
      await apiService.deleteVision(id);
      setVisions(prev => prev.filter(vision => vision.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete vision';
      setError(errorMessage);
      console.error('Error deleting vision:', err);
      throw err;
    }
  }, []);

  // Get visions by category
  const getVisionsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVisionsByCategory(category);
      setVisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visions by category');
      console.error('Error fetching visions by category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get visions by creator
  const getVisionsByCreator = useCallback(async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVisionsByCreator(address);
      setVisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visions by creator');
      console.error('Error fetching visions by creator:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load visions on mount
  useEffect(() => {
    fetchVisions();
  }, [fetchVisions]);

  return {
    visions,
    loading,
    error,
    fetchVisions,
    createVision,
    optimisticCreateVision,
    updateVision,
    deleteVision,
    getVisionsByCategory,
    getVisionsByCreator,
    refreshVisions,
    clearError,
  };
};
