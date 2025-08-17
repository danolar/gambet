const API_BASE_URL = 'http://localhost:3001/api';

export interface Vision {
  id: number;
  title: string;
  description?: string;
  category: string;
  odds?: number;
  image_url?: string;
  image_data?: string;
  creator_address?: string;
  network?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVisionData {
  title: string;
  description?: string;
  category: string;
  odds?: number;
  image_url?: string;
  image_data?: string;
  creator_address?: string;
  network?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Vision endpoints
  async getVisions(): Promise<Vision[]> {
    const response = await this.request<Vision[]>('/visions');
    return response.data;
  }

  async getVisionById(id: number): Promise<Vision> {
    const response = await this.request<Vision>(`/visions/${id}`);
    return response.data;
  }

  async createVision(visionData: CreateVisionData): Promise<Vision> {
    const response = await this.request<Vision>('/visions', {
      method: 'POST',
      body: JSON.stringify(visionData),
    });
    return response.data;
  }

  async updateVision(id: number, visionData: Partial<CreateVisionData>): Promise<Vision> {
    const response = await this.request<Vision>(`/visions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(visionData),
    });
    return response.data;
  }

  async deleteVision(id: number): Promise<Vision> {
    const response = await this.request<Vision>(`/visions/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  async getVisionsByCategory(category: string): Promise<Vision[]> {
    const response = await this.request<Vision[]>(`/visions/category/${category}`);
    return response.data;
  }

  async getVisionsByCreator(address: string): Promise<Vision[]> {
    const response = await this.request<Vision[]>(`/visions/creator/${address}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
