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