import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MapPin, Upload, Send, Play, Square, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { aiService } from '../services/aiService';
import { cloudinaryService } from '../services/cloudinaryService';
import { apiService } from '../services/api';
import Header from './Header';

// Fix for Leaflet marker icons
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Map click handler component
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    location: '',
    coordinates: '',
    priority: 'MEDIUM'
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 23.3441, lng: 85.3096 }); // Ranchi coordinates
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapLocation({ lat: latitude, lng: longitude });
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            coordinates: JSON.stringify({ lat: latitude, lng: longitude })
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setFormData(prev => ({
            ...prev,
            location: 'Location access denied. Please select manually.'
          }));
        }
      );
    } else {
      setFormData(prev => ({
        ...prev,
        location: 'Geolocation not supported. Please select manually.'
      }));
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setMapLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      coordinates: JSON.stringify({ lat, lng })
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
      
      // Create preview URLs
      const newUrls = newImages.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newUrls]);

      // Analyze first image with AI
      if (newImages.length > 0) {
        await analyzeWithAI(newImages[0]);
      }
    }
  };

  const analyzeWithAI = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeImage(file);
      setAiAnalysis(analysis);
      
      // Auto-fill form fields based on AI analysis
      setFormData(prev => ({
        ...prev,
        title: analysis.title || prev.title,
        description: analysis.complaintText || prev.description,
        category: analysis.category || prev.category,
        priority: analysis.priority || prev.priority
      }));
      
      console.log('AI Analysis Result:', analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Use fallback analysis
      const fallbackAnalysis = {
        title: 'Civic Issue Detected',
        description: 'Issue detected from image analysis. Please provide additional details.',
        category: 'OTHER',
        priority: 'MEDIUM'
      };
      setAiAnalysis(fallbackAnalysis);
      setFormData(prev => ({
        ...prev,
        title: fallbackAnalysis.title,
        description: fallbackAnalysis.description,
        category: fallbackAnalysis.category,
        priority: fallbackAnalysis.priority
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setVoiceTranscript('');
    
    try {
      const transcript = await aiService.startSpeechRecognition();
      setVoiceTranscript(transcript);
      
      // Append to description
      setFormData(prev => ({
        ...prev,
        description: prev.description + (prev.description ? ' ' : '') + transcript
      }));
    } catch (error) {
      console.error('Speech recognition failed:', error);
      alert('Voice recording failed. Please try again.');
    } finally {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload images to Cloudinary
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        uploadedUrls = await cloudinaryService.uploadImages(images);
      }
      
      // Prepare issue data
      const issueData = {
        title: formData.title || 'Civic Issue Reported',
        description: formData.description || 'Issue reported via AI analysis',
        category: formData.category,
        location: formData.location,
        coordinates: formData.coordinates,
        priority: formData.priority,
        images: uploadedUrls,
        aiAnalysis: aiAnalysis // Include AI analysis data
      };

      console.log('Submitting issue:', issueData);
      
      // Submit to backend API
      const response = await apiService.submitIssue(issueData);
      console.log('Issue submitted successfully:', response);
      
      alert('Issue submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'OTHER',
        location: '',
        coordinates: '',
        priority: 'MEDIUM'
      });
      setImages([]);
      setImageUrls([]);
      setVoiceTranscript('');
      setAiAnalysis(null);
      
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Civic Issue</h1>
          
          {/* AI Analysis Results */}
          {aiAnalysis && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Problem:</span> {aiAnalysis.problemIdentified}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Department:</span> {aiAnalysis.department}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Category:</span> {aiAnalysis.category}
                </div>
                <div>
                  <span className="font-medium text-blue-800">Priority:</span> {aiAnalysis.priority}
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title - Auto-filled by AI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-gray-500">(Auto-filled by AI)</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Description - Auto-filled by AI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-500">(Auto-filled by AI)</span>
              </label>
              <div className="space-y-3">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                
                {/* Voice Recording */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    disabled={isRecording}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isRecording 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Recording...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Voice Record</span>
                      </>
                    )}
                  </button>
                  
                  {voiceTranscript && (
                    <span className="text-sm text-green-600">
                      ✓ "{voiceTranscript}"
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload - Required for AI Analysis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos <span className="text-red-500">(Required for AI Analysis)</span>
              </label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>{isAnalyzing ? 'Analyzing with AI...' : 'Upload Photos for AI Analysis'}</span>
                </button>
                
                {/* Image Previews */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location or use GPS"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                >
                  <Map className="w-4 h-4" />
                  <span>{showMap ? 'Hide Map' : 'Open Map'}</span>
                </button>
                
                {showMap && (
                  <div className="h-64 border rounded-lg overflow-hidden">
                    <MapContainer
                      center={[mapLocation.lat, mapLocation.lng]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[mapLocation.lat, mapLocation.lng]} icon={customIcon}>
                        <Popup>Selected Location</Popup>
                      </Marker>
                      <MapClickHandler onLocationSelect={handleMapLocationSelect} />
                    </MapContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Category - Auto-filled by AI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-gray-500">(Auto-filled by AI)</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="OTHER">Other</option>
                <option value="ROAD">Road</option>
                <option value="STREETLIGHT">Street Light</option>
                <option value="WATER">Water</option>
                <option value="SANITATION">Sanitation</option>
              </select>
            </div>

            {/* Priority - Auto-filled by AI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-gray-500">(Auto-filled by AI)</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || images.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Issue'}</span>
              </button>
              {images.length === 0 && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please upload at least one photo for AI analysis
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;