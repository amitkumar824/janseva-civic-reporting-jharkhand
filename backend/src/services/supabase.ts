import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://bwipwzxjjnjhpaiiucrw.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3aXB3enhqam5qaHBhaWl1Y3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDUyNDQsImV4cCI6MjA3MjEyMTI0NH0.X74MdoZ1AggNeu0T9ALv1gMhEmI5q6xSIwMsNJ_a2E0';

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  ISSUES: 'issues',
  COMMENTS: 'comments',
  ISSUE_UPDATES: 'issue_updates',
  NOTIFICATIONS: 'notifications'
} as const;

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'CITIZEN' | 'ADMIN' | 'DEPARTMENT' | 'SUPERADMIN';
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Issue types
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'ROAD' | 'STREETLIGHT' | 'WATER' | 'SANITATION' | 'OTHER';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  coordinates?: { lat: number; lng: number };
  images: string[];
  created_at: string;
  updated_at: string;
  reporter_id: string;
  assignee_id?: string;
  department?: string;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  issue_id: string;
  user_id: string;
}

// Issue Update types
export interface IssueUpdate {
  id: string;
  status: Issue['status'];
  message: string;
  created_at: string;
  issue_id: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'ISSUE_UPDATE' | 'ASSIGNMENT' | 'RESOLUTION' | 'GENERAL';
  read: boolean;
  created_at: string;
  user_id: string;
}

// Database operations
export class SupabaseService {
  // User operations
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  static async updateUserRole(id: string, role: User['role']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .update({ role })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Issue operations
  static async createIssue(issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>): Promise<Issue | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ISSUES)
        .insert([issueData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating issue:', error);
      return null;
    }
  }

  static async getIssues(filters?: {
    status?: Issue['status'];
    category?: Issue['category'];
    reporter_id?: string;
    assignee_id?: string;
  }): Promise<Issue[]> {
    try {
      let query = supabase.from(TABLES.ISSUES).select('*');

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.reporter_id) query = query.eq('reporter_id', filters.reporter_id);
      if (filters?.assignee_id) query = query.eq('assignee_id', filters.assignee_id);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting issues:', error);
      return [];
    }
  }

  static async getIssueById(id: string): Promise<Issue | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ISSUES)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting issue by ID:', error);
      return null;
    }
  }

  static async updateIssueStatus(id: string, status: Issue['status'], message?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.ISSUES)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Create issue update record if message provided
      if (message) {
        await this.createIssueUpdate(id, status, message);
      }

      return true;
    } catch (error) {
      console.error('Error updating issue status:', error);
      return false;
    }
  }

  static async assignIssue(issueId: string, assigneeId: string, department?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.ISSUES)
        .update({ 
          assignee_id: assigneeId, 
          department,
          status: 'ASSIGNED' as Issue['status']
        })
        .eq('id', issueId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error assigning issue:', error);
      return false;
    }
  }

  // Comment operations
  static async createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .insert([commentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  }

  static async getCommentsByIssueId(issueId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMMENTS)
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  // Issue Update operations
  static async createIssueUpdate(issueId: string, status: Issue['status'], message: string): Promise<IssueUpdate | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ISSUE_UPDATES)
        .insert([{
          issue_id: issueId,
          status,
          message
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating issue update:', error);
      return null;
    }
  }

  // Notification operations
  static async createNotification(notificationData: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Statistics operations
  static async getDashboardStats(): Promise<{
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    totalUsers: number;
  }> {
    try {
      const [issuesResult, usersResult] = await Promise.all([
        supabase.from(TABLES.ISSUES).select('status'),
        supabase.from(TABLES.USERS).select('id')
      ]);

      const totalIssues = issuesResult.data?.length || 0;
      const resolvedIssues = issuesResult.data?.filter(issue => issue.status === 'RESOLVED').length || 0;
      const pendingIssues = totalIssues - resolvedIssues;
      const totalUsers = usersResult.data?.length || 0;

      return {
        totalIssues,
        resolvedIssues,
        pendingIssues,
        totalUsers
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalIssues: 0,
        resolvedIssues: 0,
        pendingIssues: 0,
        totalUsers: 0
      };
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase.from(TABLES.USERS).select('id').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }
}

export default SupabaseService;
