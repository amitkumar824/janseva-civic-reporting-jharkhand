import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, ArrowLeft, Send, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    coordinates: { lat: 0, lng: 0 }
  });
  const [images, setImages] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude },
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          // Fallback to Delhi coordinates
          setFormData(prev => ({
            ...prev,
            coordinates: { lat: 28.6139, lng: 77.2090 },
            location: 'नई दिल्ली (स्थान की अनुमति नहीं मिली)'
          }));
        }
      );
    } else {
      setLocationLoading(false);
      setFormData(prev => ({
        ...prev,
        coordinates: { lat: 28.6139, lng: 77.2090 },
        location: 'नई दिल्ली (GPS समर्थित नहीं)'
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      navigate('/citizen');
    } catch (error) {
      console.error('Error submitting issue:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic here
    setTimeout(() => {
      setIsRecording(false);
      // Add recorded text to description
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-4 py-8 mx-auto max-w-2xl lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('citizen.reportIssue')}</h1>
            <p className="text-gray-600">समस्या की रिपोर्ट करें और समाधान पाएं</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              समस्या का शीर्षक *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="संक्षेप में समस्या बताएं (उदा: स्ट्रीट लाइट खराब है)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              समस्या की श्रेणी *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">श्रेणी चुनें</option>
              <option value="sanitation">स्वच्छता (कचरा, सफाई)</option>
              <option value="road">सड़क (गड्ढे, टूटी सड़क)</option>
              <option value="streetlight">स्ट्रीट लाइट (बिजली की समस्या)</option>
              <option value="water">पानी (लीकेज, आपूर्ति)</option>
              <option value="other">अन्य</option>
            </select>
          </div>

          {/* Location */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                स्थान *
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>{locationLoading ? 'लोकेशन पता कर रहे हैं...' : 'वर्तमान स्थान उपयोग करें'}</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="समस्या का पता या स्थान (उदा: कनॉट प्लेस, नई दिल्ली)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                विस्तार से बताएं *
              </label>
              <button
                type="button"
                onClick={startVoiceRecording}
                className={`flex items-center space-x-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'रिकॉर्डिंग बंद करें' : 'आवाज़ रिकॉर्ड करें'}</span>
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="समस्या के बारे में विस्तार से बताएं। कब से यह समस्या है? यह कितनी गंभीर है?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              तस्वीरें अपलोड करें (अधिकतम 3)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {images.length === 0 ? (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">समस्या की तस्वीर अपलोड करें</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>फोटो चुनें</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {images.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      + और तस्वीर जोड़ें
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.title || !formData.category || !formData.location}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>रिपोर्ट जमा हो रही है...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>समस्या रिपोर्ट करें</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 सुझाव</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• स्पष्ट और विस्तृत विवरण दें</li>
            <li>• समस्या की तस्वीर जरूर लें</li>
            <li>• सही स्थान की जानकारी दें</li>
            <li>• आपको 24 घंटे में अपडेट मिलेगा</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;