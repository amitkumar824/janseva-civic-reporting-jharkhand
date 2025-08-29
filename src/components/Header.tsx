import React from 'react';
import { LogOut, Bell, User, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <header className="bg-white shadow-sm border-b border-orange-100">
      <div className="px-4 py-4 mx-auto max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg">
              <span className="text-white font-bold text-lg">न</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">{t('header.title')}</h1>
              <p className="text-xs text-gray-600">{t('header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Change Language"
            >
              <Languages className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.role === 'citizen' ? 'नागरिक' : 'अधिकारी'}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;