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
