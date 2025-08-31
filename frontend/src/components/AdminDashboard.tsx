import React, { useState, useEffect } from 'react';
import { Eye, Upload, CheckCircle, Clock, AlertCircle, Search, Filter, Download, Camera } from 'lucide-react';
import Header from './Header';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  images: string[];
  createdAt: string;
  reporter: {
    name: string;
    email: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Broken Street Light',
        description: 'Street light not working for the past 3 days',
        category: 'STREETLIGHT',
        status: 'SUBMITTED',
        priority: 'MEDIUM',
        location: '23.3441, 85.3096',
        images: ['https://via.placeholder.com/300x200?text=Street+Light'],
        createdAt: '2024-01-15T10:30:00Z',
        reporter: { name: 'Rahul Sharma', email: 'rahul@example.com' }
      },
      {
        id: '2',
        title: 'Pothole on Main Road',
        description: 'Large pothole causing traffic issues',
        category: 'ROAD',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        location: '23.3441, 85.3096',
        images: ['https://via.placeholder.com/300x200?text=Pothole'],
        createdAt: '2024-01-14T15:45:00Z',
        reporter: { name: 'Priya Patel', email: 'priya@example.com' }
      },
      {
        id: '3',
        title: 'Water Leakage',
        description: 'Water pipeline leaking near the park',
        category: 'WATER',
        status: 'RESOLVED',
        priority: 'HIGH',
        location: '23.3441, 85.3096',
        images: ['https://via.placeholder.com/300x200?text=Water+Leak'],
        createdAt: '2024-01-13T09:20:00Z',
        reporter: { name: 'Amit Kumar', email: 'amit@example.com' }
      }
    ];
    setIssues(mockIssues);
    setFilteredIssues(mockIssues);
  }, []);

  // Filter issues based on search and filters
  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reporter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'SUBMITTED':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (issueId: string, newStatus: string) => {
    // Update issue status
    setIssues(prev => prev.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));

    if (newStatus === 'RESOLVED' && selectedIssue) {
      // Show resolution photo upload modal
      setSelectedIssue(issues.find(issue => issue.id === issueId) || null);
    }
  };

  const handleResolutionPhotoUpload = async () => {
    if (!resolutionPhoto || !selectedIssue) return;

    setIsUploading(true);
    try {
      // Simulate photo upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update issue with resolution photo
      setIssues(prev => prev.map(issue =>
        issue.id === selectedIssue.id 
          ? { ...issue, status: 'RESOLVED', images: [...issue.images, URL.createObjectURL(resolutionPhoto)] }
          : issue
      ));

      setSelectedIssue(null);
      setResolutionPhoto(null);
      alert('Issue resolved successfully!');
    } catch (error) {
      console.error('Error uploading resolution photo:', error);
      alert('Failed to upload resolution photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResolutionPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and resolve civic issues</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {issues.filter(i => i.status === 'SUBMITTED').length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {issues.filter(i => i.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'RESOLVED').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="ROAD">Road</option>
                <option value="STREETLIGHT">Street Light</option>
                <option value="WATER">Water</option>
                <option value="SANITATION">Sanitation</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Issues ({filteredIssues.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(issue.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Category: {issue.category}</span>
                      <span>Location: {issue.location}</span>
                      <span>Reporter: {issue.reporter.name}</span>
                      <span>Date: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>

                    {issue.images.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Issue Photos:</p>
                        <div className="flex space-x-2">
                          {issue.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Issue ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedIssue(issue)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>

                    {issue.status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleStatusUpdate(issue.id, 'IN_PROGRESS')}
                        className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {issue.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleStatusUpdate(issue.id, 'RESOLVED')}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No issues found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Photo Upload Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Resolution Photo
            </h3>
            
            <p className="text-gray-600 mb-4">
              Please upload a photo showing the resolved issue for "{selectedIssue.title}"
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {resolutionPhoto && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={URL.createObjectURL(resolutionPhoto)}
                    alt="Resolution preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedIssue(null);
                    setResolutionPhoto(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolutionPhotoUpload}
                  disabled={!resolutionPhoto || isUploading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Resolve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;