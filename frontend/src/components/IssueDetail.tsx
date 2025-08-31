import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, User, Camera, Star, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Header from './Header';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'acknowledged' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  priority: 1 | 2 | 3;
  location: string;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  assignedTo?: string;
  resolutionNote?: string;
  citizenRating?: number;
  images?: string[];
}

interface Activity {
  id: string;
  type: 'status_change' | 'comment' | 'assign' | 'escalate';
  message: string;
  actor: string;
  timestamp: string;
}

const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setIssue({
        id: id || '1',
        title: 'स्ट्रीट लाइट खराब है',
        description: 'मुख्य रोड पर स्ट्रीट लाइट पिछले 3 दिनों से काम नहीं कर रही है। रात में बहुत अंधेरा हो जाता है और सुरक्षा की समस्या है।',
        category: 'streetlight',
        status: 'in_progress',
        priority: 2,
        location: 'कनॉट प्लेस, नई दिल्ली',
        reporterName: 'राहुल शर्मा',
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: '2025-01-09T15:30:00Z',
        department: 'इलेक्ट्रिकल विभाग',
        assignedTo: 'अजय कुमार (इंजीनियर)',
        images: [
          'https://images.pexels.com/photos/210012/pexels-photo-210012.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      });

      setActivities([
        {
          id: '1',
          type: 'status_change',
          message: 'समस्या सफलतापूर्वक रिपोर्ट की गई',
          actor: 'सिस्टम',
          timestamp: '2025-01-08T10:00:00Z'
        },
        {
          id: '2',
          type: 'status_change',
          message: 'समस्या को स्वीकार किया गया',
          actor: 'प्रशासन',
          timestamp: '2025-01-08T11:30:00Z'
        },
        {
          id: '3',
          type: 'assign',
          message: 'इलेक्ट्रिकल विभाग को सौंपा गया',
          actor: 'प्रशासनिक अधिकारी',
          timestamp: '2025-01-08T14:15:00Z'
        },
        {
          id: '4',
          type: 'status_change',
          message: 'काम शुरू किया गया - इंजीनियर साइट पर भेजा गया',
          actor: 'अजय कुमार',
          timestamp: '2025-01-09T09:30:00Z'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [id]);

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

  const submitRating = () => {
    // Mock rating submission
    setShowRatingModal(false);
    setRating(0);
  };

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

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">समस्या नहीं मिली</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-4 py-8 mx-auto max-w-4xl lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <p className="text-gray-600">समस्या विवरण और अपडेट</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
            {t(`status.${issue.status}`)}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {t(`category.${issue.category}`)}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        issue.priority === 1 ? 'bg-red-500' : 
                        issue.priority === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      {issue.priority === 1 ? 'उच्च प्राथमिकता' : 
                       issue.priority === 2 ? 'मध्यम प्राथमिकता' : 'कम प्राथमिकता'}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">{issue.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{issue.reporterName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(issue.createdAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              {issue.images && issue.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {issue.images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Issue ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">गतिविधि इतिहास</h3>
              
              <div className="relative">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="relative flex items-start space-x-4 pb-6">
                    {index < activities.length - 1 && (
                      <div className="absolute left-4 top-8 w-px h-full bg-gray-200"></div>
                    )}
                    
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      {activity.type === 'status_change' ? (
                        <CheckCircle className="w-4 h-4 text-orange-600" />
                      ) : activity.type === 'assign' ? (
                        <User className="w-4 h-4 text-orange-600" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-500">{activity.actor}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString('hi-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Section (if resolved and user is reporter) */}
            {issue.status === 'resolved' && user?.role === 'citizen' && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">समाधान की रेटिंग दें</h3>
                <p className="text-gray-700 mb-4">क्या आप इस समस्या के समाधान से संतुष्ट हैं?</p>
                
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={submitRating}
                  disabled={rating === 0}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  रेटिंग सबमिट करें
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue Info */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">समस्या की जानकारी</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">आईडी</p>
                  <p className="font-mono text-sm text-gray-900">#{issue.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">विभाग</p>
                  <p className="font-medium text-gray-900">{issue.department || 'असाइन नहीं किया गया'}</p>
                </div>
                
                {issue.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-600">सौंपा गया</p>
                    <p className="font-medium text-gray-900">{issue.assignedTo}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600">रिपोर्ट किया गया</p>
                  <p className="font-medium text-gray-900">
                    {new Date(issue.createdAt).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">अंतिम अपडेट</p>
                  <p className="font-medium text-gray-900">
                    {new Date(issue.updatedAt).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {user?.role !== 'citizen' && (
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">प्रशासनिक कार्रवाई</h3>
                
                <div className="space-y-4">
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">स्थिति बदलें</option>
                    <option value="acknowledged">स्वीकार करें</option>
                    <option value="assigned">असाइन करें</option>
                    <option value="in_progress">प्रगति में</option>
                    <option value="resolved">हल करें</option>
                  </select>
                  
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">विभाग असाइन करें</option>
                    <option value="sanitation">स्वच्छता विभाग</option>
                    <option value="pwd">पीडब्ल्यूडी</option>
                    <option value="electrical">इलेक्ट्रिकल विभाग</option>
                    <option value="water">जल बोर्ड</option>
                  </select>
                  
                  <textarea
                    placeholder="टिप्पणी या नोट्स जोड़ें"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  ></textarea>
                  
                  <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                    अपडेट सेव करें
                  </button>
                </div>
              </div>
            )}

            {/* SLA Info */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">SLA ट्रैकिंग</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">लक्षित समय</span>
                  <span className="text-sm font-medium text-gray-900">72 घंटे</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">बीता हुआ समय</span>
                  <span className="text-sm font-medium text-orange-600">29 घंटे</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">बचा हुआ समय</span>
                  <span className="text-sm font-medium text-green-600">43 घंटे</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetail;