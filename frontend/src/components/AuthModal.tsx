import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'citizen' | 'admin' | null;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  
  const { login, register, loading } = useAuth();
  const { t } = useLanguage();

  if (!isOpen || !mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password, mode);
      } else {
        success = await register(formData.name, formData.email, formData.password, formData.phone);
      }

      if (success) {
        onClose();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'citizen' ? t('home.citizen') : t('home.admin')}
            </h3>
            <p className="text-sm text-gray-600">
              {isLogin ? t('auth.login') : t('auth.register')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder={t('auth.name')}
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder={t('auth.email')}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder={t('auth.phone')}
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder={t('auth.password')}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
              mode === 'citizen'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            } ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}`}
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            <span>{isLogin ? t('auth.loginBtn') : t('auth.registerBtn')}</span>
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;