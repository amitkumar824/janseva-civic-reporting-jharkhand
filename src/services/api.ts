// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

interface IssueRequest {
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  priority?: string;
  images?: string[];
}

interface CommentRequest {
  content: string;
}

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.logout();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(data.error || 'Request failed');
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Request failed' };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: this.token }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
    }

    return response;
  }

  // User profile methods
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile');
  }

  // Alternative profile endpoint
  async getProfileFromAuth(): Promise<ApiResponse<any>> {
    return this.request('/auth/me');
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<ApiResponse<any>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<any>> {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Issue methods
  async getIssues(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<ApiResponse<{ issues: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getIssue(id: string): Promise<ApiResponse<{ issue: any }>> {
    return this.request(`/issues/${id}`);
  }

  async createIssue(issueData: IssueRequest): Promise<ApiResponse<{ issue: any }>> {
    return this.request('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  }

  async updateIssue(id: string, issueData: Partial<IssueRequest>): Promise<ApiResponse<{ issue: any }>> {
    return this.request(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(issueData),
    });
  }

  async deleteIssue(id: string): Promise<ApiResponse<any>> {
    return this.request(`/issues/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadImages(issueId: string, images: string[]): Promise<ApiResponse<{ images: string[] }>> {
    return this.request(`/issues/${issueId}/images`, {
      method: 'POST',
      body: JSON.stringify({ images }),
    });
  }

  async addComment(issueId: string, commentData: CommentRequest): Promise<ApiResponse<{ comment: any }>> {
    return this.request(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // User issues methods
  async getUserIssues(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<ApiResponse<{ issues: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/users/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getAssignedIssues(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{ issues: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/users/assigned-issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  // Admin methods
  async getDashboardStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request('/admin/dashboard');
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<ApiResponse<{ users: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<{ user: any }>> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async assignIssue(issueId: string, assigneeId: string, department: string): Promise<ApiResponse<{ issue: any }>> {
    return this.request(`/admin/issues/${issueId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assigneeId, department }),
    });
  }

  async updateIssueStatus(issueId: string, status: string, message?: string): Promise<ApiResponse<{ issue: any }>> {
    return this.request(`/admin/issues/${issueId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    });
  }

  async getAnalytics(period: number = 30): Promise<ApiResponse<{ analytics: any }>> {
    return this.request(`/admin/analytics?period=${period}`);
  }

  // Notification methods
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<ApiResponse<{ notifications: any[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    return this.request('/notifications/unread-count');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  IssueRequest,
  CommentRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
};
