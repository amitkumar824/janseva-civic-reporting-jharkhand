import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, CheckCircle, AlertCircle, LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTranslatedIssues } from '../hooks/useTranslatedIssues';
import { apiService } from '../services/api';
import Header from './Header';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'acknowledged' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  priority: 1 | 2 | 3;
  location: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

const CitizenDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const translatedIssues = useTranslatedIssues(issues);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await apiService.getUserIssues({
          page: 1,
          limit: 50,
          status: filter === 'all' ? undefined : filter
        });
        
        if (response.error) {
          console.error('Failed to fetch issues:', response.error);
          return;
        }
        
        if (response.data) {
          // Transform backend data to frontend format
          const transformedIssues = response.data.issues.map(issue => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            category: issue.category.toLowerCase(),
            status: issue.status.toLowerCase().replace('_', ''),
            priority: issue.priority === 'HIGH' ? 1 : issue.priority === 'MEDIUM' ? 2 : 3,
            location: issue.location,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
            imageUrl: issue.images && issue.images.length > 0 ? issue.images[0] : undefined
          }));
          
          setIssues(transformedIssues);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [filter]);

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'text-blue-600 bg-blue-50 border-blue-200',
      acknowledged: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      assigned: 'text-purple-600 bg-purple-50 border-purple-200',
      in_progress: 'text-orange-600 bg-orange-50 border-orange-200',
      resolved: 'text-green-600 bg-green-50 border-green-200',
      rejected: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.submitted;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStats = () => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const pending = issues.filter(i => i.status !== 'resolved' && i.status !== 'rejected').length;
    
    return { total, resolved, pending };
  };

  const filteredIssues = filter === 'all' ? translatedIssues : translatedIssues.filter(i => i.status === filter);
  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-4 py-8 mx-auto max-w-7xl lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('admin.welcome')}, {user?.name}! 🙏
          </h1>
          <p className="text-gray-600">{t('citizen.dashboard')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('citizen.totalIssues')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('citizen.resolved')}</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('citizen.pending')}</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <button
              onClick={() => navigate('/report')}
              className="mt-4 w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('citizen.reportIssue')}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('language') === 'hi' ? 'सभी समस्याएं' : 'All Issues'}
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'submitted'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('status.submitted')}
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'in_progress'
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('status.in_progress')}
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'resolved'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('status.resolved')}
          </button>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('admin.noIssuesFound')}</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate(`/issue/${issue.id}`)}
                className={`p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer priority-${issue.priority}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                  </div>
                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="w-16 h-16 rounded-lg object-cover ml-4"
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                      {getStatusIcon(issue.status)}
                      <span>{t(`status.${issue.status}`)}</span>
                    </span>
                    
                    <div className="flex items-center text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{issue.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {new Date(issue.createdAt).toLocaleDateString('hi-IN')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;