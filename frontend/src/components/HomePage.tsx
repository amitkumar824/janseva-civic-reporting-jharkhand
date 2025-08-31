import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mic, MapPin, Users, TrendingUp, Shield, Globe, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Header from './Header';

const HomePage: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                {t('home.hero.reportButton')}
              </Link>
              <Link
                to="/issues"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                {t('home.hero.viewIssuesButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.ai.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.ai.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.ai.bullet1')}</li>
                <li>• {t('home.features.ai.bullet2')}</li>
                <li>• {t('home.features.ai.bullet3')}</li>
              </ul>
            </div>

            {/* Voice Recognition */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.voice.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.voice.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.voice.bullet1')}</li>
                <li>• {t('home.features.voice.bullet2')}</li>
                <li>• {t('home.features.voice.bullet3')}</li>
              </ul>
            </div>

            {/* GPS Location */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.location.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.location.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.location.bullet1')}</li>
                <li>• {t('home.features.location.bullet2')}</li>
                <li>• {t('home.features.location.bullet3')}</li>
              </ul>
            </div>

            {/* Real-time Tracking */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.tracking.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.tracking.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.tracking.bullet1')}</li>
                <li>• {t('home.features.tracking.bullet2')}</li>
                <li>• {t('home.features.tracking.bullet3')}</li>
              </ul>
            </div>

            {/* Multi-language Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.language.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.language.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.language.bullet1')}</li>
                <li>• {t('home.features.language.bullet2')}</li>
                <li>• {t('home.features.language.bullet3')}</li>
              </ul>
            </div>

            {/* Secure & Reliable */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.features.security.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('home.features.security.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• {t('home.features.security.bullet1')}</li>
                <li>• {t('home.features.security.bullet2')}</li>
                <li>• {t('home.features.security.bullet3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('home.quickAccess.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/report"
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <Camera className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.quickAccess.report.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.quickAccess.report.description')}
              </p>
            </Link>

            <Link
              to="/issues"
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.quickAccess.track.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.quickAccess.track.description')}
              </p>
            </Link>

            <Link
              to="/admin"
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-200 hover:scale-105"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('home.quickAccess.admin.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.quickAccess.admin.description')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nagar Sahayak</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/report" className="hover:text-white transition-colors">{t('footer.reportIssue')}</Link></li>
                <li><Link to="/issues" className="hover:text-white transition-colors">{t('footer.viewIssues')}</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">{t('footer.adminPanel')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.features')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{t('footer.aiAnalysis')}</li>
                <li>{t('footer.voiceRecognition')}</li>
                <li>{t('footer.gpsTracking')}</li>
                <li>{t('footer.multilingual')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
              <p className="text-gray-400">
                {t('footer.contactInfo')}
              </p>
              <button
                onClick={toggleLanguage}
                className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                {language === 'en' ? 'हिंदी में देखें' : 'View in English'}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nagar Sahayak. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;