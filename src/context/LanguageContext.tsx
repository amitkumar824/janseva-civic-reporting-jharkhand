import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  hi: {
    // Header
    'header.title': 'नगर सहायक',
    'header.subtitle': 'नागरिक समस्या निवारण प्रणाली',
    'header.language': 'English',
    
    // Home page
    'home.welcome': 'स्वागत है',
    'home.subtitle': 'आपकी आवाज, हमारी प्राथमिकता',
    'home.description': 'अपने शहर की समस्याओं की रिपोर्ट करें और उनका समाधान देखें। पारदर्शी और तीव्र सेवा के लिए हमारे साथ जुड़ें।',
    'home.citizen': 'नागरिक पोर्टल',
    'home.admin': 'सरकारी पोर्टल',
    'home.features.report': 'समस्या रिपोर्ट करें',
    'home.features.track': 'स्थिति ट्रैक करें',
    'home.features.resolve': 'तुरंत समाधान',
    
    // Authentication
    'auth.login': 'लॉगिन',
    'auth.register': 'पंजीकरण',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूरा नाम',
    'auth.phone': 'फ़ोन नंबर',
    'auth.loginBtn': 'लॉगिन करें',
    'auth.registerBtn': 'पंजीकरण करें',
    'auth.switchToRegister': 'नया खाता बनाएं',
    'auth.switchToLogin': 'पहले से खाता है? लॉगिन करें',
    
    // Citizen Dashboard
    'citizen.dashboard': 'डैशबोर्ड',
    'citizen.reportIssue': 'समस्या रिपोर्ट करें',
    'citizen.myIssues': 'मेरी समस्याएं',
    'citizen.totalIssues': 'कुल समस्याएं',
    'citizen.resolved': 'हल की गई',
    'citizen.pending': 'लंबित',
    
    // Admin Dashboard
    'admin.dashboard': 'प्रशासनिक डैशबोर्ड',
    'admin.welcome': 'नमस्ते',
    'admin.subtitle': 'नागरिक सेवा प्रबंधन',
    'admin.totalIssues': 'कुल समस्याएं',
    'admin.pendingIssues': 'लंबित समस्याएं',
    'admin.resolvedIssues': 'हल की गई',
    'admin.highPriority': 'उच्च प्राथमिकता',
    'admin.thisMonth': 'इस महीने',
    'admin.needsAttention': 'तत्काल ध्यान देने की आवश्यकता',
    'admin.resolutionRate': 'रिजोल्यूशन दर',
    'admin.immediateAction': 'तुरंत कार्रवाई चाहिए',
    'admin.searchIssues': 'समस्या खोजें...',
    'admin.allStatuses': 'सभी स्थितियां',
    'admin.allCategories': 'सभी श्रेणियां',
    'admin.allPriorities': 'सभी प्राथमिकताएं',
    'admin.highPriorityText': 'उच्च प्राथमिकता',
    'admin.mediumPriorityText': 'मध्यम प्राथमिकता',
    'admin.lowPriorityText': 'कम प्राथमिकता',
    'admin.downloadReport': 'रिपोर्ट डाउनलोड करें',
    'admin.citizenIssues': 'नागरिक समस्याएं',
    'admin.issuesFound': 'समस्याएं मिलीं',
    'admin.issue': 'समस्या',
    'admin.reporter': 'रिपोर्टर',
    'admin.category': 'श्रेणी',
    'admin.status': 'स्थिति',
    'admin.priority': 'प्राथमिकता',
    'admin.date': 'दिनांक',
    'admin.action': 'कार्रवाई',
    'admin.viewDetails': 'विवरण देखें',
    'admin.noIssuesFound': 'कोई समस्या नहीं मिली',
    'admin.departmentPerformance': 'विभाग प्रदर्शन',
    'admin.sanitationDept': 'स्वच्छता विभाग',
    'admin.pwdDept': 'पीडब्ल्यूडी',
    'admin.waterBoard': 'जल बोर्ड',
    'admin.resolution': 'रिजोल्यूशन',
    'admin.todayActivity': 'आज की गतिविधि',
    'admin.newComplaints': 'नई शिकायतें',
    'admin.resolved': 'हल की गई',
    'admin.averageTime': 'औसत समय',
    'admin.hours': 'घंटे',
    
    // Issue Status
    'status.submitted': 'प्रस्तुत',
    'status.acknowledged': 'स्वीकृत',
    'status.assigned': 'सौंपा गया',
    'status.in_progress': 'प्रगति में',
    'status.resolved': 'हल',
    'status.rejected': 'अस्वीकृत',
    
    // Categories
    'category.sanitation': 'स्वच्छता',
    'category.road': 'सड़क',
    'category.streetlight': 'स्ट्रीट लाइट',
    'category.water': 'पानी',
    'category.other': 'अन्य',
    
    // Common
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हुआ',
    'common.success': 'सफल!',
  },
  en: {
    // Header
    'header.title': 'CivicConnect',
    'header.subtitle': 'Citizen Issue Resolution System',
    'header.language': 'हिंदी',
    
    // Home page
    'home.welcome': 'Welcome to',
    'home.subtitle': 'Your Voice, Our Priority',
    'home.description': 'Report civic issues in your city and track their resolution. Join us for transparent and swift service delivery.',
    'home.citizen': 'Citizen Portal',
    'home.admin': 'Government Portal',
    'home.features.report': 'Report Issues',
    'home.features.track': 'Track Status',
    'home.features.resolve': 'Quick Resolution',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.loginBtn': 'Sign In',
    'auth.registerBtn': 'Create Account',
    'auth.switchToRegister': 'Create new account',
    'auth.switchToLogin': 'Already have an account? Sign in',
    
    // Citizen Dashboard
    'citizen.dashboard': 'Dashboard',
    'citizen.reportIssue': 'Report Issue',
    'citizen.myIssues': 'My Issues',
    'citizen.totalIssues': 'Total Issues',
    'citizen.resolved': 'Resolved',
    'citizen.pending': 'Pending',
    
    // Admin Dashboard
    'admin.dashboard': 'Administrative Dashboard',
    'admin.welcome': 'Hello',
    'admin.subtitle': 'Civic Service Management',
    'admin.totalIssues': 'Total Issues',
    'admin.pendingIssues': 'Pending Issues',
    'admin.resolvedIssues': 'Resolved',
    'admin.highPriority': 'High Priority',
    'admin.thisMonth': 'this month',
    'admin.needsAttention': 'Needs immediate attention',
    'admin.resolutionRate': 'Resolution Rate',
    'admin.immediateAction': 'Immediate action required',
    'admin.searchIssues': 'Search issues...',
    'admin.allStatuses': 'All Statuses',
    'admin.allCategories': 'All Categories',
    'admin.allPriorities': 'All Priorities',
    'admin.highPriorityText': 'High Priority',
    'admin.mediumPriorityText': 'Medium Priority',
    'admin.lowPriorityText': 'Low Priority',
    'admin.downloadReport': 'Download Report',
    'admin.citizenIssues': 'Citizen Issues',
    'admin.issuesFound': 'issues found',
    'admin.issue': 'Issue',
    'admin.reporter': 'Reporter',
    'admin.category': 'Category',
    'admin.status': 'Status',
    'admin.priority': 'Priority',
    'admin.date': 'Date',
    'admin.action': 'Action',
    'admin.viewDetails': 'View Details',
    'admin.noIssuesFound': 'No issues found',
    'admin.departmentPerformance': 'Department Performance',
    'admin.sanitationDept': 'Sanitation Department',
    'admin.pwdDept': 'PWD',
    'admin.waterBoard': 'Water Board',
    'admin.resolution': 'Resolution',
    'admin.todayActivity': 'Today\'s Activity',
    'admin.newComplaints': 'New Complaints',
    'admin.resolved': 'Resolved',
    'admin.averageTime': 'Average Time',
    'admin.hours': 'hours',
    
    // Issue Status
    'status.submitted': 'Submitted',
    'status.acknowledged': 'Acknowledged',
    'status.assigned': 'Assigned',
    'status.in_progress': 'In Progress',
    'status.resolved': 'Resolved',
    'status.rejected': 'Rejected',
    
    // Categories
    'category.sanitation': 'Sanitation',
    'category.road': 'Road',
    'category.streetlight': 'Street Light',
    'category.water': 'Water',
    'category.other': 'Other',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.success': 'Success!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['hi']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};