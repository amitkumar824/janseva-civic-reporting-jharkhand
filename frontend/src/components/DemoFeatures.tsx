import React, { useState, useRef } from 'react';
import { Camera, Mic, MapPin, Brain, Upload, Play, Square } from 'lucide-react';
import { aiService } from '../services/aiService';
import { cloudinaryService } from '../services/cloudinaryService';

const DemoFeatures: React.FC = () => {
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setVoiceTranscript('');
    
    try {
      const transcript = await aiService.startSpeechRecognition();
      setVoiceTranscript(transcript);
    } catch (error) {
      console.error('Speech recognition failed:', error);
      alert('Voice recording failed. Please try again.');
    } finally {
      setIsRecording(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAnalyzing(true);
      
      try {
        // Analyze image with AI
        const analysis = await aiService.analyzeImage(file);
        setImageAnalysis(analysis);
        
        // Upload to Cloudinary (optional)
        setUploading(true);
        const uploadedUrl = await cloudinaryService.uploadImage(file);
        setUploadedImages(prev => [...prev, uploadedUrl]);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
      } finally {
        setAnalyzing(false);
        setUploading(false);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location access denied');
        }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Jan Seva - Feature Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voice Recording Demo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Mic className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Voice-to-Text</h2>
            </div>
            
            <button
              onClick={startVoiceRecording}
              disabled={isRecording}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isRecording ? (
                <div className="flex items-center justify-center space-x-2">
                  <Square className="w-4 h-4" />
                  <span>Recording... (Click to stop)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start Voice Recording</span>
                </div>
              )}
            </button>
            
            {voiceTranscript && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">Transcript:</p>
                <p className="text-green-700">{voiceTranscript}</p>
              </div>
            )}
          </div>

          {/* Image Analysis Demo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">AI Image Analysis</h2>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzing}
              className="w-full py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>{analyzing ? 'Analyzing...' : 'Upload & Analyze Image'}</span>
              </div>
            </button>
            
            {imageAnalysis && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-800 mb-1">AI Analysis:</p>
                <p className="text-purple-700">{imageAnalysis}</p>
              </div>
            )}
          </div>

          {/* Location Demo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">GPS Location</h2>
            </div>
            
            <button
              onClick={getCurrentLocation}
              className="w-full py-3 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Get Current Location</span>
              </div>
            </button>
            
            {location && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">Coordinates:</p>
                <p className="text-green-700">{location}</p>
              </div>
            )}
          </div>

          {/* Cloudinary Upload Demo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Image Upload</h2>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              Upload images to Cloudinary for storage and optimization
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
                {uploadedImages.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img 
                      src={cloudinaryService.getThumbnailUrl(url, 50)} 
                      alt={`Upload ${index + 1}`}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <span className="text-xs text-gray-500 truncate">{url}</span>
                  </div>
                ))}
              </div>
            )}
            
            {uploading && (
              <div className="mt-2 text-sm text-orange-600">
                Uploading to Cloudinary...
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Test Features:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• <strong>Voice Recording:</strong> Click the button and speak in Hindi or English. The transcript will appear below.</li>
            <li>• <strong>Image Analysis:</strong> Upload any image and AI will analyze it to identify civic issues.</li>
            <li>• <strong>GPS Location:</strong> Allow location access to get your current coordinates.</li>
            <li>• <strong>Image Upload:</strong> Images are uploaded to Cloudinary for storage and optimization.</li>
          </ul>
        </div>

        {/* Feature Status */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 font-medium">✅ Voice-to-Text</div>
            <div className="text-xs text-green-600">Web Speech API</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-600 font-medium">✅ AI Analysis</div>
            <div className="text-xs text-purple-600">Mock AI Service</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-medium">✅ Interactive Maps</div>
            <div className="text-xs text-blue-600">Leaflet Maps</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-orange-600 font-medium">✅ Cloudinary</div>
            <div className="text-xs text-orange-600">Image Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoFeatures;
