// API service for backend communication
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication methods
  public async login(credentials: { email: string; password: string }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        return { data: result, error: null };
      }
      
      return { data: null, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error: 'Network error' };
    }
  }

  public async register(userData: { name: string; email: string; password: string; phone: string }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        return { data: result, error: null };
      }
      
      return { data: null, error: result.error || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { data: null, error: 'Network error' };
    }
  }

  public async getProfile(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { data: null, error: 'No token found' };
      }

      const response = await fetch(`${this.baseUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        return { data: result, error: null };
      } else {
        return { data: null, error: 'Failed to get profile' };
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { data: null, error: 'Network error' };
    }
  }

  public async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }

  public async getUserIssues(filters?: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value as string);
        });
      }

      const response = await fetch(`${this.baseUrl}/api/users/issues?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        return { data: result, error: null };
      } else {
        return { data: null, error: 'Failed to fetch user issues' };
      }
    } catch (error) {
      console.error('Error fetching user issues:', error);
      return { data: null, error: 'Network error' };
    }
  }

  // Submit a new issue
  public async submitIssue(issueData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit issue: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting issue:', error);
      throw error;
    }
  }

  // Get all issues
  public async getIssues(filters?: any): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value as string);
        });
      }

      const response = await fetch(`${this.baseUrl}/api/issues?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  }

  // Get single issue by ID
  public async getIssue(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/issues/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch issue: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching issue:', error);
      throw error;
    }
  }

  // Update issue status
  public async updateIssueStatus(id: string, status: string, resolutionPhoto?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/issues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          resolutionPhoto
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update issue: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const apiService = ApiService.getInstance();
