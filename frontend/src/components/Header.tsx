import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="relative overflow-hidden bg-white shadow-sm border-b border-orange-100">
      <div className="absolute inset-0 pattern-bg opacity-30"></div>
      <div className="relative px-4 py-4 mx-auto max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{t('header.title')}</h1>
              <p className="text-sm text-gray-600">{t('header.subtitle')}</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.home')}
            </Link>
            <Link
              to="/report"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.reportIssue')}
            </Link>
            <Link
              to="/issues"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.tryFeatures')}
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/presentation"
              className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 font-medium transition-all"
            >
              SIH Demo
            </Link>
            <Link
              to="/performance"
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all"
            >
              Metrics
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{t('header.language')}</span>
            </button>

            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{t('header.user')}</p>
                <p className="text-gray-500">Citizen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex items-center justify-between space-x-2">
            <Link
              to="/"
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.home')}
            </Link>
            <Link
              to="/report"
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.reportIssue')}
            </Link>
            <Link
              to="/issues"
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              {t('header.tryFeatures')}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pattern-bg {
          background-image: radial-gradient(circle at 1px 1px, rgba(249, 115, 22, 0.1) 1px, transparent 0);
          background-size: 20px 20px;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #f97316 0%, #16a34a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </header>
  );
};

export default Header;