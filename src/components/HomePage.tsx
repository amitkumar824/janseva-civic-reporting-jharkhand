import React, { useState } from 'react';
import { MapPin, Eye, Zap, Users, TrendingUp, Award, Languages, CheckCircle, UserPlus, FileText, Bell } from 'lucide-react';
import AuthModal from './AuthModal';
import { useLanguage } from '../context/LanguageContext';

const HomePage: React.FC = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'citizen' | 'admin' | null }>({
    isOpen: false,
    mode: null
  });
  const { language, setLanguage, t } = useLanguage();

  const openAuthModal = (mode: 'citizen' | 'admin') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: null });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm border-b border-orange-100">
        <div className="absolute inset-0 pattern-bg opacity-30"></div>
        <div className="relative px-4 py-6 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{t('header.title')}</h1>
                <p className="text-sm text-gray-600">{t('header.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{t('header.language')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 mx-auto max-w-7xl lg:px-8 bg-cover bg-center bg-no-repeat" 
               style={{
                 backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
                 backgroundAttachment: 'fixed'
               }}>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white lg:text-6xl drop-shadow-lg">
            {t('home.welcome')} <span className="text-orange-300">{t('header.title')}</span>
          </h2>
          <p className="mt-4 text-xl text-orange-300 font-medium drop-shadow">{t('home.subtitle')}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-100 leading-relaxed drop-shadow">
            {t('home.description')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center mt-12 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <button
            onClick={() => openAuthModal('citizen')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Users className="w-5 h-5" />
            <span>{t('home.citizen')}</span>
          </button>
          <button
            onClick={() => openAuthModal('admin')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Award className="w-5 h-5" />
            <span>{t('home.admin')}</span>
          </button>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="px-4 py-16 mx-auto max-w-7xl lg:px-8 bg-white">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('language') === 'hi' ? 'आसान पंजीकरण प्रक्रिया' : 'Easy Registration Process'}
          </h3>
          <p className="text-lg text-gray-600">
            {t('language') === 'hi' ? 'केवल 3 सरल चरणों में अपना खाता बनाएं' : 'Create your account in just 3 simple steps'}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center group">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-6 mx-auto group-hover:from-orange-200 group-hover:to-orange-300 transition-all">
              <UserPlus className="w-10 h-10 text-orange-600" />
            </div>
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {t('language') === 'hi' ? '1. खाता बनाएं' : '1. Create Account'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {t('language') === 'hi' ? 'अपना नाम, ईमेल और फोन नंबर दर्ज करें। पंजीकरण तुरंत हो जाएगा।' : 'Enter your name, email and phone number. Registration is instant.'}
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6 mx-auto group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {t('language') === 'hi' ? '2. समस्या रिपोर्ट करें' : '2. Report Issues'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {t('language') === 'hi' ? 'फोटो लें, स्थान जोड़ें और समस्या का विवरण दें। AI आपकी मदद करेगा।' : 'Take photos, add location and describe the issue. AI will assist you.'}
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 mx-auto group-hover:from-green-200 group-hover:to-green-300 transition-all">
              <Bell className="w-10 h-10 text-green-600" />
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {t('language') === 'hi' ? '3. अपडेट पाएं' : '3. Get Updates'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {t('language') === 'hi' ? 'रियल-टाइम अपडेट पाएं और समाधान तक ट्रैक करें। SMS और ईमेल अलर्ट।' : 'Get real-time updates and track until resolution. SMS and email alerts.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 mx-auto max-w-7xl lg:px-8 bg-white/50">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('language') === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
          </h3>
          <p className="text-lg text-gray-600">
            {t('language') === 'hi' ? 'सरल, पारदर्शी और प्रभावी नागरिक सेवा' : 'Simple, transparent, and effective civic engagement'}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-6 group-hover:from-orange-200 group-hover:to-orange-300 transition-all">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{t('home.features.report')}</h4>
            <p className="text-gray-600 leading-relaxed">
              {t('language') === 'hi' ? 'फोटो लें, स्थान जोड़ें और समस्या बताएं। आपकी रिपोर्ट तुरंत सही विभाग तक पहुंचती है।' : 'Take a photo, add location, and describe the issue. Your report reaches the right department instantly.'}
            </p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{t('home.features.track')}</h4>
            <p className="text-gray-600 leading-relaxed">
              {t('language') === 'hi' ? 'अपनी समस्या की स्थिति पर रियल-टाइम अपडेट। सबमिशन से समाधान तक, हर कदम की जानकारी।' : 'Real-time updates on your issue status. From submission to resolution, stay informed every step.'}
            </p>
          </div>

          <div className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">{t('home.features.resolve')}</h4>
            <p className="text-gray-600 leading-relaxed">
              {t('language') === 'hi' ? 'कुशल रूटिंग और SLA ट्रैकिंग सुनिश्चित करती है कि आपकी समस्याओं का समाधान सही अधिकारियों द्वारा जल्दी हो।' : 'Efficient routing and SLA tracking ensures your issues are resolved quickly by the right authorities.'}
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-4 py-16 mx-auto max-w-7xl lg:px-8">
        <div className="grid gap-8 md:grid-cols-4 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">25,000+</div>
            <div className="text-gray-600">
              {t('language') === 'hi' ? 'समस्याएं रिपोर्ट की गईं' : 'Issues Reported'}
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">22,500+</div>
            <div className="text-gray-600">
              {t('language') === 'hi' ? 'समस्याएं हल की गईं' : 'Issues Resolved'}
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
            <div className="text-gray-600">
              {t('language') === 'hi' ? 'शहर जुड़े हुए' : 'Cities Connected'}
            </div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">48hr</div>
            <div className="text-gray-600">
              {t('language') === 'hi' ? 'औसत समाधान समय' : 'Average Resolution'}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="px-4 mx-auto max-w-7xl lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">{t('header.title')}</h3>
            </div>
            <p className="text-gray-400">
              {t('language') === 'hi' ? 'नागरिक सहभागिता और पारदर्शी शासन के माध्यम से बेहतर शहर बनाना।' : 'Building better cities through citizen engagement and transparent governance.'}
            </p>
            <div className="mt-6 text-sm text-gray-500">
              © 2025 {t('header.title')}. {t('language') === 'hi' ? 'भारतीय शहरों के लिए ❤️ से बनाया गया।' : 'Made with ❤️ for Indian cities.'}
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
      />
    </div>
  );
};

export default HomePage;