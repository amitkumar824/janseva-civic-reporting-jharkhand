// Translation utilities for dynamic content
export const translateDynamicContent = (text: string, targetLanguage: 'hi' | 'en'): string => {
  // Simple translation mappings for common civic terms
  const translations: Record<string, Record<string, string>> = {
    // Hindi to English
    hi: {
      'स्ट्रीट लाइट खराब है': 'Street light is broken',
      'बिजली की लाइट खराब है': 'Electric light is broken',
      'सड़क में गड्ढे': 'Potholes in road',
      'गड्ढे से भरी सड़क': 'Road full of potholes',
      'कचरा संग्रह नहीं हुआ': 'Garbage not collected',
      'साफ-सफाई की समस्या': 'Sanitation problem',
      'पानी की लीकेज': 'Water leakage',
      'ट्रैफिक सिग्नल खराब': 'Traffic signal broken',
      'राजौरी गार्डन, नई दिल्ली': 'Rajouri Garden, New Delhi',
      'लाजपत नगर, नई दिल्ली': 'Lajpat Nagar, New Delhi',
      'कमला नगर, दिल्ली': 'Kamla Nagar, Delhi',
      'वसंत कुंज, दिल्ली': 'Vasant Kunj, Delhi',
      'इंडिया गेट, दिल्ली': 'India Gate, Delhi',
      'कनॉट प्लेस, नई दिल्ली': 'Connaught Place, New Delhi',
      'राहुल शर्मा': 'Rahul Sharma',
      'प्रिया पटेल': 'Priya Patel',
      'अमित कुमार': 'Amit Kumar',
      'सुनीता जी': 'Sunita Ji',
      'राजेश गुप्ता': 'Rajesh Gupta',
      'इलेक्ट्रिकल': 'Electrical',
      'पीडब्ल्यूडी': 'PWD',
      'स्वच्छता': 'Sanitation',
      'जल बोर्ड': 'Water Board',
      'ट्रैफिक पुलिस': 'Traffic Police'
    },
    // English to Hindi
    en: {
      'Street light is broken': 'स्ट्रीट लाइट खराब है',
      'Electric light is broken': 'बिजली की लाइट खराब है',
      'Potholes in road': 'सड़क में गड्ढे',
      'Road full of potholes': 'गड्ढे से भरी सड़क',
      'Garbage not collected': 'कचरा संग्रह नहीं हुआ',
      'Sanitation problem': 'साफ-सफाई की समस्या',
      'Water leakage': 'पानी की लीकेज',
      'Traffic signal broken': 'ट्रैफिक सिग्नल खराब',
      'Rajouri Garden, New Delhi': 'राजौरी गार्डन, नई दिल्ली',
      'Lajpat Nagar, New Delhi': 'लाजपत नगर, नई दिल्ली',
      'Kamla Nagar, Delhi': 'कमला नगर, दिल्ली',
      'Vasant Kunj, Delhi': 'वसंत कुंज, दिल्ली',
      'India Gate, Delhi': 'इंडिया गेट, दिल्ली',
      'Connaught Place, New Delhi': 'कनॉट प्लेस, नई दिल्ली',
      'Rahul Sharma': 'राहुल शर्मा',
      'Priya Patel': 'प्रिया पटेल',
      'Amit Kumar': 'अमित कुमार',
      'Sunita Ji': 'सुनीता जी',
      'Rajesh Gupta': 'राजेश गुप्ता',
      'Electrical': 'इलेक्ट्रिकल',
      'PWD': 'पीडब्ल्यूडी',
      'Sanitation': 'स्वच्छता',
      'Water Board': 'जल बोर्ड',
      'Traffic Police': 'ट्रैफिक पुलिस'
    }
  };

  // Return translated text if available, otherwise return original
  return translations[targetLanguage]?.[text] || text;
};

// Hook to get translated dynamic content
export const useTranslatedContent = (content: string, currentLanguage: 'hi' | 'en') => {
  return translateDynamicContent(content, currentLanguage);
};

// Translation keys for the application
export const translations = {
  en: {
    header: {
      title: "Nagar Sahayak",
      subtitle: "AI-Powered Civic Issue Reporting System",
      language: "हिंदी",
      home: "Home",
      reportIssue: "Report Issue",
      tryFeatures: "Current Issues",
      user: "Demo User"
    },
    home: {
      hero: {
        title: "Welcome to Nagar Sahayak",
        subtitle: "Your voice, our priority. Report your city's problems and see their solutions. Join us for transparent and fast service.",
        reportButton: "Citizen Portal",
        viewIssuesButton: "Government Portal"
      },
      features: {
        title: "Powerful Features for Better Civic Management",
        subtitle: "Our platform combines cutting-edge AI technology with user-friendly design to revolutionize civic issue reporting.",
        ai: {
          title: "AI-Powered Analysis",
          description: "Advanced image recognition and natural language processing to automatically categorize and prioritize issues.",
          bullet1: "Automatic problem identification",
          bullet2: "Smart category classification",
          bullet3: "Intelligent priority assessment"
        },
        voice: {
          title: "Voice Recognition",
          description: "Speak your complaints in Hindi or English. Our AI understands and converts speech to text seamlessly.",
          bullet1: "Hindi and English support",
          bullet2: "Real-time speech processing",
          bullet3: "Accurate transcription"
        },
        location: {
          title: "GPS Location Tracking",
          description: "Automatic location detection and precise mapping for accurate issue reporting and tracking.",
          bullet1: "Automatic GPS detection",
          bullet2: "Interactive map selection",
          bullet3: "Precise location tracking"
        },
        tracking: {
          title: "Real-time Tracking",
          description: "Monitor the status of your reported issues in real-time with detailed progress updates.",
          bullet1: "Live status updates",
          bullet2: "Progress notifications",
          bullet3: "Resolution tracking"
        },
        language: {
          title: "Multi-language Support",
          description: "Full support for both Hindi and English languages to serve all citizens effectively.",
          bullet1: "Bilingual interface",
          bullet2: "Hinglish support",
          bullet3: "Local language comfort"
        },
        security: {
          title: "Secure & Reliable",
          description: "Enterprise-grade security and reliability to protect your data and ensure system availability.",
          bullet1: "Data encryption",
          bullet2: "Secure cloud storage",
          bullet3: "24/7 system monitoring"
        }
      },
      quickAccess: {
        title: "Quick Access",
        report: {
          title: "Report Issue",
          description: "Report a new civic issue with AI-powered analysis"
        },
        track: {
          title: "Track Issues",
          description: "View and monitor all reported issues"
        },
        admin: {
          title: "Admin Panel",
          description: "Manage and resolve civic issues efficiently"
        }
      }
    },
    footer: {
      description: "Empowering citizens with AI-driven civic issue reporting for a better tomorrow.",
      quickLinks: "Quick Links",
      reportIssue: "Report Issue",
      viewIssues: "View Issues",
      adminPanel: "Admin Panel",
      features: "Features",
      aiAnalysis: "AI Analysis",
      voiceRecognition: "Voice Recognition",
      gpsTracking: "GPS Tracking",
      multilingual: "Multi-language Support",
      contact: "Contact",
      contactInfo: "Get in touch with us for support and feedback.",
      rights: "All rights reserved."
    },
    report: {
      title: "Report Civic Issue",
      subtitle: "Use AI to automatically analyze and categorize your issue",
      form: {
        title: "Title",
        description: "Description",
        category: "Category",
        location: "Location",
        priority: "Priority",
        photos: "Photos",
        submit: "Submit Issue"
      },
      ai: {
        analyzing: "Analyzing with AI...",
        results: "AI Analysis Results",
        problem: "Problem",
        department: "Department",
        category: "Category",
        priority: "Priority",
        autoFilled: "(Auto-filled by AI)",
        confidence: "AI Confidence",
        imageCaption: "Image Analysis"
      },
      voice: {
        record: "Voice Record",
        recording: "Recording...",
        recorded: "Voice recorded successfully"
      },
      map: {
        open: "Open Map",
        hide: "Hide Map",
        selectLocation: "Select location on map"
      }
    },
    issues: {
      title: "Current Issues",
      subtitle: "Track and monitor all reported civic issues",
      filters: {
        search: "Search issues...",
        allStatus: "All Status",
        allCategories: "All Categories",
        allPriorities: "All Priorities",
        clearFilters: "Clear Filters"
      },
      stats: {
        submitted: "Submitted",
        inProgress: "In Progress",
        resolved: "Resolved",
        total: "Total"
      },
      status: {
        submitted: "Submitted",
        inProgress: "In Progress",
        resolved: "Resolved"
      },
      actions: {
        viewDetails: "View Details",
        startWork: "Start Work",
        markResolved: "Mark Resolved"
      },
      noIssues: {
        title: "No issues found",
        noIssuesYet: "No issues have been reported yet. Be the first to report a civic issue!",
        noMatches: "No issues match your current filters. Try adjusting your search criteria."
      }
    }
  },
  hi: {
    header: {
      title: "नगर सहायक",
      subtitle: "AI-संचालित नागरिक समस्या रिपोर्टिंग",
      language: "English",
      home: "होम",
      reportIssue: "समस्या रिपोर्ट करें",
      tryFeatures: "वर्तमान समस्याएं",
      user: "डेमो उपयोगकर्ता"
    },
    home: {
      hero: {
        title: "AI के साथ नागरिक समस्या रिपोर्टिंग को बदलें",
        subtitle: "उन्नत AI तकनीक का उपयोग करके नागरिक समस्याओं को कुशलतापूर्वक रिपोर्ट, ट्रैक और हल करें। अपने शहर को बेहतर बनाएं, एक समस्या एक समय।",
        reportButton: "समस्या रिपोर्ट करें",
        viewIssuesButton: "वर्तमान समस्याएं देखें"
      },
      features: {
        title: "बेहतर नागरिक प्रबंधन के लिए शक्तिशाली सुविधाएं",
        subtitle: "हमारा प्लेटफॉर्म नागरिक समस्या रिपोर्टिंग में क्रांति लाने के लिए कटिंग-एज AI तकनीक को उपयोगकर्ता-अनुकूल डिज़ाइन के साथ जोड़ता है।",
        ai: {
          title: "AI-संचालित विश्लेषण",
          description: "समस्याओं को स्वचालित रूप से वर्गीकृत और प्राथमिकता देने के लिए उन्नत छवि पहचान और प्राकृतिक भाषा प्रसंस्करण।",
          bullet1: "स्वचालित समस्या पहचान",
          bullet2: "स्मार्ट श्रेणी वर्गीकरण",
          bullet3: "बुद्धिमान प्राथमिकता मूल्यांकन"
        },
        voice: {
          title: "आवाज पहचान",
          description: "हिंदी या अंग्रेजी में अपनी शिकायतें बोलें। हमारा AI भाषण को समझता है और पाठ में सहजता से परिवर्तित करता है।",
          bullet1: "हिंदी और अंग्रेजी समर्थन",
          bullet2: "रीयल-टाइम भाषण प्रसंस्करण",
          bullet3: "सटीक ट्रांसक्रिप्शन"
        },
        location: {
          title: "GPS स्थान ट्रैकिंग",
          description: "सटीक समस्या रिपोर्टिंग और ट्रैकिंग के लिए स्वचालित स्थान पहचान और सटीक मैपिंग।",
          bullet1: "स्वचालित GPS पहचान",
          bullet2: "इंटरैक्टिव मैप चयन",
          bullet3: "सटीक स्थान ट्रैकिंग"
        },
        tracking: {
          title: "रीयल-टाइम ट्रैकिंग",
          description: "विस्तृत प्रगति अपडेट के साथ अपनी रिपोर्ट की गई समस्याओं की स्थिति को रीयल-टाइम में मॉनिटर करें।",
          bullet1: "लाइव स्थिति अपडेट",
          bullet2: "प्रगति सूचनाएं",
          bullet3: "समाधान ट्रैकिंग"
        },
        language: {
          title: "बहु-भाषा समर्थन",
          description: "सभी नागरिकों को प्रभावी ढंग से सेवा देने के लिए हिंदी और अंग्रेजी दोनों भाषाओं का पूर्ण समर्थन।",
          bullet1: "द्विभाषी इंटरफेस",
          bullet2: "हिंग्लिश समर्थन",
          bullet3: "स्थानीय भाषा आराम"
        },
        security: {
          title: "सुरक्षित और विश्वसनीय",
          description: "आपके डेटा की सुरक्षा और सिस्टम उपलब्धता सुनिश्चित करने के लिए एंटरप्राइज-ग्रेड सुरक्षा और विश्वसनीयता।",
          bullet1: "डेटा एन्क्रिप्शन",
          bullet2: "सुरक्षित क्लाउड स्टोरेज",
          bullet3: "24/7 सिस्टम मॉनिटरिंग"
        }
      },
      quickAccess: {
        title: "त्वरित पहुंच",
        report: {
          title: "समस्या रिपोर्ट करें",
          description: "AI-संचालित विश्लेषण के साथ नई नागरिक समस्या रिपोर्ट करें"
        },
        track: {
          title: "समस्याएं ट्रैक करें",
          description: "सभी रिपोर्ट की गई समस्याओं को देखें और मॉनिटर करें"
        },
        admin: {
          title: "एडमिन पैनल",
          description: "नागरिक समस्याओं को कुशलतापूर्वक प्रबंधित और हल करें"
        }
      }
    },
    footer: {
      description: "बेहतर कल के लिए AI-संचालित नागरिक समस्या रिपोर्टिंग के साथ नागरिकों को सशक्त बनाना।",
      quickLinks: "त्वरित लिंक",
      reportIssue: "समस्या रिपोर्ट करें",
      viewIssues: "समस्याएं देखें",
      adminPanel: "एडमिन पैनल",
      features: "सुविधाएं",
      aiAnalysis: "AI विश्लेषण",
      voiceRecognition: "आवाज पहचान",
      gpsTracking: "GPS ट्रैकिंग",
      multilingual: "बहु-भाषा समर्थन",
      contact: "संपर्क",
      contactInfo: "समर्थन और प्रतिक्रिया के लिए हमसे संपर्क करें।",
      rights: "सर्वाधिकार सुरक्षित।"
    },
    report: {
      title: "नागरिक समस्या रिपोर्ट करें",
      subtitle: "अपनी समस्या का स्वचालित विश्लेषण और वर्गीकरण करने के लिए AI का उपयोग करें",
      form: {
        title: "शीर्षक",
        description: "विवरण",
        category: "श्रेणी",
        location: "स्थान",
        priority: "प्राथमिकता",
        photos: "तस्वीरें",
        submit: "समस्या सबमिट करें"
      },
      ai: {
        analyzing: "AI के साथ विश्लेषण...",
        results: "AI विश्लेषण परिणाम",
        problem: "समस्या",
        department: "विभाग",
        category: "श्रेणी",
        priority: "प्राथमिकता",
        autoFilled: "(AI द्वारा स्वचालित भरा गया)",
        confidence: "AI विश्वास",
        imageCaption: "छवि विश्लेषण"
      },
      voice: {
        record: "आवाज रिकॉर्ड करें",
        recording: "रिकॉर्डिंग...",
        recorded: "आवाज सफलतापूर्वक रिकॉर्ड की गई"
      },
      map: {
        open: "मैप खोलें",
        hide: "मैप छिपाएं",
        selectLocation: "मैप पर स्थान चुनें"
      }
    },
    issues: {
      title: "वर्तमान समस्याएं",
      subtitle: "सभी रिपोर्ट की गई नागरिक समस्याओं को ट्रैक और मॉनिटर करें",
      filters: {
        search: "समस्याएं खोजें...",
        allStatus: "सभी स्थिति",
        allCategories: "सभी श्रेणियां",
        allPriorities: "सभी प्राथमिकताएं",
        clearFilters: "फ़िल्टर साफ़ करें"
      },
      stats: {
        submitted: "सबमिट किया गया",
        inProgress: "प्रगति में",
        resolved: "हल किया गया",
        total: "कुल"
      },
      status: {
        submitted: "सबमिट किया गया",
        inProgress: "प्रगति में",
        resolved: "हल किया गया"
      },
      actions: {
        viewDetails: "विवरण देखें",
        startWork: "काम शुरू करें",
        markResolved: "हल के रूप में चिह्नित करें"
      },
      noIssues: {
        title: "कोई समस्या नहीं मिली",
        noIssuesYet: "अभी तक कोई समस्या रिपोर्ट नहीं की गई है। नागरिक समस्या रिपोर्ट करने वाले पहले बनें!",
        noMatches: "कोई समस्या आपके वर्तमान फ़िल्टर से मेल नहीं खाती। अपने खोज मानदंड को समायोजित करने का प्रयास करें।"
      }
    }
  }
};