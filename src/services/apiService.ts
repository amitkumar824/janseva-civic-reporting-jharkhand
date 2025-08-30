// API service for backend communication
const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: number;
  location: string;
  coordinates?: { lat: number; lng: number };
  reporterName: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  assignedTo?: string;
  resolutionNote?: string;
  images?: string[];
}

class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication methods
  public async login(email: string, password: string, role: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  public async register(name: string, email: string, password: string, phone: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Issues methods
  public async getIssues(userId?: string, role?: string): Promise<ApiResponse<{ issues: Issue[] }>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);

    return this.request<{ issues: Issue[] }>(`/issues?${params.toString()}`);
  }

  public async getIssue(id: string): Promise<ApiResponse<{ issue: Issue }>> {
    return this.request<{ issue: Issue }>(`/issues/${id}`);
  }

  public async createIssue(issueData: {
    title: string;
    description: string;
    category: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    reporterId: string;
  }, images?: File[]): Promise<ApiResponse<{ issue: Issue }>> {
    const formData = new FormData();
    
    // Add text data
    Object.entries(issueData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    // Add images
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return this.request<{ issue: Issue }>('/issues', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  public async updateIssue(id: string, updates: {
    status?: string;
    department?: string;
    assignedTo?: string;
    resolutionNote?: string;
  }): Promise<ApiResponse<{ issue: Issue }>> {
    return this.request<{ issue: Issue }>(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Statistics
  public async getStats(): Promise<ApiResponse<{
    stats: {
      total: number;
      resolved: number;
      pending: number;
      highPriority: number;
    }
  }>> {
    return this.request<{
      stats: {
        total: number;
        resolved: number;
        pending: number;
        highPriority: number;
      }
    }>('/stats');
  }

  // Health check
  public async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

export const apiService = ApiService.getInstance();