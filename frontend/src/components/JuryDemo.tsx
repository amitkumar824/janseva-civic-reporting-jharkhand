import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const JuryDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const demoSteps = [
    {
      id: 0,
      title: "Homepage Overview",
      description: "Bilingual interface with feature highlights",
      duration: 30,
      component: "HomePage",
      highlights: ["Multi-language toggle", "Feature cards", "Quick access buttons"]
    },
    {
      id: 1,
      title: "AI-Powered Issue Reporting",
      description: "Upload image → AI analysis → Auto-fill form",
      duration: 120,
      component: "ReportIssue",
      highlights: ["Image upload", "AI analysis", "Form auto-fill", "Voice recording"]
    },
    {
      id: 2,
      title: "Real-time Issue Tracking",
      description: "Live updates and status monitoring",
      duration: 60,
      component: "CurrentIssues",
      highlights: ["Real-time updates", "Filtering", "Search functionality"]
    },
    {
      id: 3,
      title: "Admin Dashboard",
      description: "Issue management and analytics",
      duration: 60,
      component: "AdminDashboard",
      highlights: ["Issue management", "Status updates", "Analytics"]
    },
    {
      id: 4,
      title: "Mobile Responsiveness",
      description: "Cross-device compatibility demonstration",
      duration: 30,
      component: "Responsive",
      highlights: ["Mobile layout", "Touch interactions", "Responsive design"]
    }
  ];

  const technicalQuestions = [
    {
      question: "How does the AI integration work?",
      answer: "We use a custom Python ML model that processes images using BLIP for captioning and Whisper for speech-to-text. The frontend sends base64 image data to our backend API, which calls the Python script and returns structured analysis including problem identification, category, priority, and department assignment."
    },
    {
      question: "How do you handle real-time updates?",
      answer: "We implement WebSocket connections using Socket.io. When an issue status changes, the backend emits events to connected clients. The frontend listens for these events and updates the UI in real-time without requiring page refreshes."
    },
    {
      question: "What about scalability and performance?",
      answer: "The frontend uses React 18 with concurrent features, code splitting for lazy loading, and optimized bundle sizes. We implement virtual scrolling for large lists, image optimization with Cloudinary, and efficient state management to handle thousands of issues."
    },
    {
      question: "How is security implemented?",
      answer: "We use JWT tokens for authentication, implement CSRF protection, sanitize all inputs, use HTTPS for all communications, and follow OWASP security guidelines. File uploads are validated and processed securely through Cloudinary."
    },
    {
      question: "How does the multi-language system work?",
      answer: "We have a comprehensive translation system with static translations for UI elements and dynamic translation for user-generated content. The system supports Hindi, English, and Hinglish, with automatic language detection and seamless switching."
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setInterval(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
        
        if (currentStep >= demoSteps.length - 1) {
          setIsPlaying(false);
        }
      }, demoSteps[currentStep]?.duration * 1000 || 3000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SIH 2025 - Jury Demonstration
          </h1>
          <p className="text-xl text-gray-600">
            Jan Seva Civic Reporting System - Frontend Technical Demo
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Demo Controls</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={startDemo}
                disabled={isPlaying}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Demo</span>
              </button>
              
              <button
                onClick={pauseDemo}
                disabled={!isPlaying}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
              
              <button
                onClick={resetDemo}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Demo Steps */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentStep === step.id
                    ? 'border-blue-500 bg-blue-50'
                    : completedSteps.includes(step.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : currentStep === step.id ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <span>{step.id + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{step.duration}s</p>
                    <p className="text-xs text-gray-400">{step.component}</p>
                  </div>
                </div>
                
                {/* Highlights */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Q&A Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Expected Jury Questions & Technical Answers
          </h2>
          
          <div className="space-y-6">
            {technicalQuestions.map((qa, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Q{index + 1}: {qa.question}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics for Jury */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Components</h3>
            <p className="text-3xl font-bold">15+</p>
            <p className="text-sm text-green-100">Reusable React components</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <p className="text-3xl font-bold">25+</p>
            <p className="text-sm text-blue-100">Advanced frontend features</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Languages</h3>
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm text-purple-100">Hindi, English, Hinglish</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white text-center">
            <h3 className="text-lg font-semibold mb-2">AI Models</h3>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-orange-100">BLIP + Whisper integration</p>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">
            📋 Presentation Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Before Demo:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>✅ Ensure backend is running</li>
                <li>✅ Test AI model integration</li>
                <li>✅ Verify image upload works</li>
                <li>✅ Check voice recording</li>
                <li>✅ Test language switching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">During Demo:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>🎯 Start with technical overview</li>
                <li>🎯 Show AI analysis in action</li>
                <li>🎯 Demonstrate real-time features</li>
                <li>🎯 Highlight mobile responsiveness</li>
                <li>🎯 Explain scalability approach</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuryDemo;