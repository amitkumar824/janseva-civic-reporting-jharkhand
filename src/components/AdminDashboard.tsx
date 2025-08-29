import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, MapPin, Filter, Download, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
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
  department?: string;
}

const AdminDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setIssues([
        {
          id: '1',
          title: 'स्ट्रीट लाइट खराब है',
          description: 'मुख्य रोड पर स्ट्रीट लाइट काम नहीं कर रही',
          category: 'streetlight',
          status: 'submitted',
          priority: 2,
          location: 'कनॉट प्लेस, नई दिल्ली',
          reporterName: 'राहुल शर्मा',
          createdAt: '2025-01-08T10:00:00Z',
          department: 'इलेक्ट्रिकल'
        },
        {
          id: '2',
          title: 'सड़क में गड्ढे',
          description: 'मुख्य सड़क पर बड़े गड्ढे हैं जिससे दुर्घटना हो सकती है',
          category: 'road',
          status: 'in_progress',
          priority: 1,
          location: 'लाजपत नगर, दिल्ली',
          reporterName: 'प्रिया पटेल',
          createdAt: '2025-01-07T14:20:00Z',
          department: 'पीडब्ल्यूडी'
        },
        {
          id: '3',
          title: 'कचरा संग्रह नहीं हुआ',
          description: 'पिछले 4 दिनों से कचरा नहीं उठाया गया है',
          category: 'sanitation',
          status: 'resolved',
          priority: 2,
          location: 'साकेत, नई दिल्ली',
          reporterName: 'अमित कुमार',
          createdAt: '2025-01-06T09:15:00Z',
          department: 'स्वच्छता'
        },
        {
          id: '4',
          title: 'पानी की लीकेज',
          description: 'पाइप फट गया है और पानी बर्बाद हो रहा है',
          category: 'water',
          status: 'acknowledged',
          priority: 1,
          location: 'वसंत कुंज, दिल्ली',
          reporterName: 'सुनीता जी',
          createdAt: '2025-01-08T16:30:00Z',
          department: 'जल बोर्ड'
        },
        {
          id: '5',
          title: 'ट्रैफिक सिग्नल खराब',
          description: 'चौराहे पर ट्रैफिक लाइट काम नहीं कर रही',
          category: 'other',
          status: 'assigned',
          priority: 1,
          location: 'इंडिया गेट, दिल्ली',
          reporterName: 'राजेश गुप्ता',
          createdAt: '2025-01-08T08:45:00Z',
          department: 'ट्रैफिक पुलिस'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStats = () => {
    const total = issues.length;
    const pending = issues.filter(i => ['submitted', 'acknowledged', 'assigned', 'in_progress'].includes(i.status)).length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const high_priority = issues.filter(i => i.priority === 1 && i.status !== 'resolved').length;
    
    return { total, pending, resolved, high_priority };
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filter.status === 'all' || issue.status === filter.status;
    const matchesCategory = filter.category === 'all' || issue.category === filter.category;
    const matchesPriority = filter.priority === 'all' || issue.priority.toString() === filter.priority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const stats = getStats();

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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'border-l-4 border-red-500';
      case 2: return 'border-l-4 border-yellow-500';
      case 3: return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-4 py-8 mx-auto max-w-7xl lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            नमस्ते, {user?.name}! 🙏
          </h1>
          <p className="text-gray-600">प्रशासनिक डैशबोर्ड - नागरिक सेवा प्रबंधन</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">कुल समस्याएं</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% इस महीने</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">लंबित समस्याएं</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              तत्काल ध्यान देने की आवश्यकता
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">हल की गई</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>90% रिजोल्यूशन दर</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">उच्च प्राथमिकता</p>
                <p className="text-3xl font-bold text-red-600">{stats.high_priority}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600">
              तुरंत कार्रवाई चाहिए
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="समस्या खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">सभी स्थितियां</option>
                <option value="submitted">प्रस्तुत</option>
                <option value="acknowledged">स्वीकृत</option>
                <option value="assigned">सौंपा गया</option>
                <option value="in_progress">प्रगति में</option>
                <option value="resolved">हल</option>
                <option value="rejected">अस्वीकृत</option>
              </select>

              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">सभी श्रेणियां</option>
                <option value="sanitation">स्वच्छता</option>
                <option value="road">सड़क</option>
                <option value="streetlight">स्ट्रीट लाइट</option>
                <option value="water">पानी</option>
                <option value="other">अन्य</option>
              </select>

              <select
                value={filter.priority}
                onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">सभी प्राथमिकताएं</option>
                <option value="1">उच्च प्राथमिकता</option>
                <option value="2">मध्यम प्राथमिकता</option>
                <option value="3">कम प्राथमिकता</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>रिपोर्ट डाउनलोड करें</span>
            </button>
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">नागरिक समस्याएं</h2>
              <span className="text-sm text-gray-600">{filteredIssues.length} समस्याएं मिलीं</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">समस्या</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">रिपोर्टर</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">श्रेणी</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थिति</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">प्राथमिकता</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">दिनांक</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`${getPriorityColor(issue.priority)} pl-4`}>
                        <div className="font-medium text-gray-900 truncate max-w-xs">{issue.title}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{issue.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{issue.reporterName}</div>
                      <div className="text-sm text-gray-500">{issue.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {t(`category.${issue.category}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                        {t(`status.${issue.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          issue.priority === 1 ? 'bg-red-500' : 
                          issue.priority === 2 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm text-gray-900">
                          {issue.priority === 1 ? 'उच्च' : issue.priority === 2 ? 'मध्यम' : 'कम'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString('hi-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/issue/${issue.id}`)}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                      >
                        विवरण देखें
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">कोई समस्या नहीं मिली</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3">विभाग प्रदर्शन</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">स्वच्छता विभाग</span>
                <span className="text-sm font-medium text-green-600">85% रिजोल्यूशन</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">पीडब्ल्यूडी</span>
                <span className="text-sm font-medium text-yellow-600">72% रिजोल्यूशन</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">जल बोर्ड</span>
                <span className="text-sm font-medium text-red-600">65% रिजोल्यूशन</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">आज की गतिविधि</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">नई शिकायतें</span>
                <span className="text-sm font-medium text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">हल की गई</span>
                <span className="text-sm font-medium text-green-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">औसत समय</span>
                <span className="text-sm font-medium text-orange-600">36 घंटे</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;