import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, ArrowLeft, Send, Mic, MicOff, Sparkles, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
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
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    caption: string;
    category: string;
    title: string;
    priority: number;
    department: string;
  } | null>(null);

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
      
      // Analyze the first image with AI
      if (newFiles.length > 0) {
        analyzeWithAI(newFiles[0]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeWithAI = async (imageFile: File) => {
    setAiAnalyzing(true);
    try {
      const caption = await aiService.analyzeImage(imageFile);
      const category = aiService.identifyProblem(caption, formData.description);
      const title = aiService.generateTitle(caption, formData.description, category);
      const priority = aiService.determinePriority(formData.description, caption);
      const department = aiService.mapDepartment(category);
      
      setAiSuggestions({
        caption,
        category,
        title,
        priority,
        department
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const applySuggestions = () => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        title: aiSuggestions.title,
        category: aiSuggestions.category,
        description: prev.description || aiSuggestions.caption
      }));
    }
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

  const startVoiceRecording = async () => {
    setIsRecording(true);
    try {
      const transcript = await aiService.startSpeechRecognition();
      setFormData(prev => ({
        ...prev,
        description: prev.description + (prev.description ? ' ' : '') + transcript
      }));
    } catch (error) {
      console.error('Speech recognition failed:', error);
    } finally {
      setIsRecording(false);
    }
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

        {/* AI Suggestions */}
        {aiSuggestions && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">AI सुझाव</h3>
              {aiAnalyzing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600">पहचानी गई समस्या:</p>
                <p className="font-medium text-gray-900">{t(`category.${aiSuggestions.category}`)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">सुझाया गया शीर्षक:</p>
                <p className="font-medium text-gray-900">{aiSuggestions.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">संबंधित विभाग:</p>
                <p className="font-medium text-gray-900">{aiSuggestions.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">प्राथमिकता स्तर:</p>
                <p className="font-medium text-gray-900">
                  {aiSuggestions.priority === 1 ? 'उच्च' : aiSuggestions.priority === 2 ? 'मध्यम' : 'कम'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={applySuggestions}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI सुझाव लागू करें</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Title */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('language') === 'hi' ? 'समस्या का शीर्षक *' : 'Issue Title *'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('language') === 'hi' ? 'संक्षेप में समस्या बताएं (उदा: स्ट्रीट लाइट खराब है)' : 'Briefly describe the issue (e.g., Street light is broken)'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('language') === 'hi' ? 'समस्या की श्रेणी *' : 'Issue Category *'}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">{t('language') === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}</option>
              <optgroup label={t('language') === 'hi' ? 'टेस्ट डेमो' : 'Test Demo'}>
                <option value="test_case">TEST CASE</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'बिजली संबंधी' : 'Electricity Related'}>
                <option value="electricity_connection">Electricity connection in LHP</option>
                <option value="fund_not_received">Fund not received</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'आवास योजना' : 'Housing Scheme'}>
                <option value="pmay_handover">PMAY (LHP) Handover</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'मरम्मत सेवाएं' : 'Repair Services'}>
                <option value="hydt_repairing">HYDT REPAIRING</option>
                <option value="motor_repairing">Motor Repairing</option>
                <option value="hand_pump_repairing">Hand Pump Repairing</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'पानी संबंधी' : 'Water Related'}>
                <option value="new_boring">New Boring Related Issue (HYDT/MINI HYDT)</option>
                <option value="water_bill">Water Bill Related Issue</option>
                <option value="water_leakage">Water Line Leakage</option>
                <option value="septic_tank">SEPTIC TANK</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'सड़क और भवन' : 'Roads & Buildings'}>
                <option value="rnb_issues">R & B Related Issues</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'लाइसेंस और कर' : 'License & Tax'}>
                <option value="new_holding_trade">New Holding and Trade licence</option>
                <option value="trade_renewal">New Trade licence and renewal</option>
                <option value="tax_increase">Tax increase related issue</option>
                <option value="number_not_generated">Applied but holding or trade number not generated</option>
                <option value="receipt_not_generated">Bill Paid online but receipt not generated</option>
                <option value="bill_correction">Wrong Name In Bill/Error in Spelling/Address Change/Phone number change</option>
              </optgroup>
              <optgroup label={t('language') === 'hi' ? 'सामान्य' : 'General'}>
                <option value="sanitation">{t('category.sanitation')} {t('language') === 'hi' ? '(कचरा, सफाई)' : '(Garbage, Cleaning)'}</option>
                <option value="road">{t('category.road')} {t('language') === 'hi' ? '(गड्ढे, टूटी सड़क)' : '(Potholes, Damaged Roads)'}</option>
                <option value="streetlight">{t('category.streetlight')} {t('language') === 'hi' ? '(बिजली की समस्या)' : '(Electrical Issues)'}</option>
                <option value="water">{t('category.water')} {t('language') === 'hi' ? '(लीकेज, आपूर्ति)' : '(Leakage, Supply)'}</option>
                <option value="other">{t('category.other')}</option>
              </optgroup>
            </select>
          </div>

          {/* Location */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('language') === 'hi' ? 'स्थान *' : 'Location *'}
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>{locationLoading ? (t('language') === 'hi' ? 'लोकेशन पता कर रहे हैं...' : 'Getting location...') : (t('language') === 'hi' ? 'वर्तमान स्थान उपयोग करें' : 'Use current location')}</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder={t('language') === 'hi' ? 'समस्या का पता या स्थान (उदा: कनॉट प्लेस, नई दिल्ली)' : 'Issue address or location (e.g., Connaught Place, New Delhi)'}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('language') === 'hi' ? 'विस्तार से बताएं *' : 'Describe in detail *'}
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
                <span>{isRecording ? (t('language') === 'hi' ? 'रिकॉर्डिंग बंद करें' : 'Stop Recording') : (t('language') === 'hi' ? 'आवाज़ रिकॉर्ड करें' : 'Record Voice')}</span>
              </button>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('language') === 'hi' ? 'समस्या के बारे में विस्तार से बताएं। कब से यह समस्या है? यह कितनी गंभीर है?' : 'Describe the issue in detail. How long has this been a problem? How serious is it?'}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('language') === 'hi' ? 'तस्वीरें अपलोड करें (अधिकतम 3)' : 'Upload Images (Maximum 3)'}
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
                  <p className="text-gray-600 mb-2">{t('language') === 'hi' ? 'समस्या की तस्वीर अपलोड करें' : 'Upload photos of the issue'}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t('language') === 'hi' ? 'फोटो चुनें' : 'Choose Photos'}</span>
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
                      {t('language') === 'hi' ? '+ और तस्वीर जोड़ें' : '+ Add more photos'}
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
                  <span>{t('language') === 'hi' ? 'रिपोर्ट जमा हो रही है...' : 'Submitting report...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('language') === 'hi' ? 'समस्या रिपोर्ट करें' : 'Report Issue'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 {t('language') === 'hi' ? 'सुझाव' : 'Tips'}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t('language') === 'hi' ? 'स्पष्ट और विस्तृत विवरण दें' : 'Provide clear and detailed description'}</li>
            <li>• {t('language') === 'hi' ? 'समस्या की तस्वीर जरूर लें' : 'Take photos of the issue'}</li>
            <li>• {t('language') === 'hi' ? 'सही स्थान की जानकारी दें' : 'Provide accurate location information'}</li>
            <li>• {t('language') === 'hi' ? 'आपको 24 घंटे में अपडेट मिलेगा' : 'You will receive updates within 24 hours'}</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;