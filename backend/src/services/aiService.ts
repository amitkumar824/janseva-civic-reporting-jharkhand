import axios from 'axios';

// Free Hugging Face API for ML models
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

export interface AIAnalysisResult {
  caption: string;
  category: string;
  title: string;
  priority: number;
  department: string;
  confidence: number;
  tags: string[];
}

export interface TextAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  language: string;
  keywords: string[];
  urgency: number;
}

/**
 * Analyze image using Hugging Face image classification model
 * @param imageData - Base64 encoded image
 * @returns Promise<AIAnalysisResult>
 */
export const analyzeImageWithAI = async (imageData: string): Promise<AIAnalysisResult> => {
  try {
    if (!API_KEY) {
      // Fallback to mock analysis if no API key
      return getMockImageAnalysis();
    }

    // Use Microsoft's ResNet model for image classification
    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/microsoft/resnet-50`,
      {
        inputs: imageData,
        parameters: {
          top_k: 5
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictions = response.data;
    return processImagePredictions(predictions);
  } catch (error) {
    console.error('AI image analysis failed:', error);
    // Fallback to mock analysis
    return getMockImageAnalysis();
  }
};

/**
 * Analyze text using Hugging Face text classification model
 * @param text - Text to analyze
 * @returns Promise<TextAnalysisResult>
 */
export const analyzeTextWithAI = async (text: string): Promise<TextAnalysisResult> => {
  try {
    if (!API_KEY) {
      return getMockTextAnalysis(text);
    }

    // Use BERT model for text classification
    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/nlptown/bert-base-multilingual-uncased-sentiment`,
      {
        inputs: text
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return processTextPredictions(text, response.data);
  } catch (error) {
    console.error('AI text analysis failed:', error);
    return getMockTextAnalysis(text);
  }
};

/**
 * Process image classification predictions
 * @param predictions - Raw model predictions
 * @returns AIAnalysisResult
 */
const processImagePredictions = (predictions: any[]): AIAnalysisResult => {
  const topPrediction = predictions[0];
  const label = topPrediction.label.toLowerCase();
  const confidence = topPrediction.score;

  // Map predictions to civic issue categories
  const category = mapImageToCategory(label);
  const priority = determinePriorityFromImage(label, confidence);
  const department = mapDepartment(category);
  const title = generateTitleFromImage(label, category);
  const tags = extractTagsFromLabel(label);

  return {
    caption: `Image shows: ${label}`,
    category,
    title,
    priority,
    department,
    confidence,
    tags
  };
};

/**
 * Process text classification predictions
 * @param text - Original text
 * @param predictions - Raw model predictions
 * @returns TextAnalysisResult
 */
const processTextPredictions = (text: string, predictions: any[]): TextAnalysisResult => {
  const topPrediction = predictions[0];
  const sentiment = mapSentiment(topPrediction.label);
  const urgency = calculateUrgency(text);
  const keywords = extractKeywords(text);
  const language = detectLanguage(text);

  return {
    sentiment,
    language,
    keywords,
    urgency
  };
};

/**
 * Map image labels to civic issue categories
 * @param label - Image classification label
 * @returns string
 */
const mapImageToCategory = (label: string): string => {
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes('road') || labelLower.includes('pothole') || labelLower.includes('crack')) {
    return 'ROAD';
  } else if (labelLower.includes('light') || labelLower.includes('lamp') || labelLower.includes('electric')) {
    return 'STREETLIGHT';
  } else if (labelLower.includes('water') || labelLower.includes('pipe') || labelLower.includes('leak')) {
    return 'WATER';
  } else if (labelLower.includes('garbage') || labelLower.includes('trash') || labelLower.includes('waste')) {
    return 'SANITATION';
  } else {
    return 'OTHER';
  }
};

/**
 * Map category to department
 * @param category - Issue category
 * @returns string
 */
const mapDepartment = (category: string): string => {
  const departmentMap: Record<string, string> = {
    'ROAD': 'Public Works Department (PWD)',
    'STREETLIGHT': 'Electrical Department',
    'WATER': 'Water Supply Department',
    'SANITATION': 'Municipal Corporation',
    'OTHER': 'General Complaints Department'
  };
  
  return departmentMap[category] || 'General Complaints Department';
};

/**
 * Determine priority from image analysis
 * @param label - Image label
 * @param confidence - Model confidence
 * @returns number (1=high, 2=medium, 3=low)
 */
const determinePriorityFromImage = (label: string, confidence: number): number => {
  const labelLower = label.toLowerCase();
  
  // High priority indicators
  if (labelLower.includes('danger') || labelLower.includes('accident') || labelLower.includes('emergency')) {
    return 1;
  }
  
  // Medium priority indicators
  if (labelLower.includes('damage') || labelLower.includes('broken') || labelLower.includes('leak')) {
    return 2;
  }
  
  // Low priority by default
  return 3;
};

/**
 * Generate title from image analysis
 * @param label - Image label
 * @param category - Issue category
 * @returns string
 */
const generateTitleFromImage = (label: string, category: string): string => {
  const categoryNames: Record<string, string> = {
    'ROAD': 'Road Issue',
    'STREETLIGHT': 'Street Light Issue',
    'WATER': 'Water Supply Issue',
    'SANITATION': 'Sanitation Issue',
    'OTHER': 'Civic Issue'
  };
  
  return `${categoryNames[category]} - ${label}`;
};

/**
 * Extract tags from image label
 * @param label - Image label
 * @returns string[]
 */
const extractTagsFromLabel = (label: string): string[] => {
  const words = label.toLowerCase().split(/[^a-zA-Z]+/);
  return words.filter(word => word.length > 2);
};

/**
 * Map sentiment score to sentiment
 * @param label - Sentiment label
 * @returns string
 */
const mapSentiment = (label: string): 'positive' | 'negative' | 'neutral' => {
  const score = parseInt(label.split(' ')[0]);
  if (score >= 4) return 'positive';
  if (score <= 2) return 'negative';
  return 'neutral';
};

/**
 * Calculate urgency from text
 * @param text - Input text
 * @returns number (0-1)
 */
const calculateUrgency = (text: string): number => {
  const urgentWords = ['urgent', 'emergency', 'immediate', 'critical', 'danger', 'accident'];
  const textLower = text.toLowerCase();
  
  let urgency = 0;
  urgentWords.forEach(word => {
    if (textLower.includes(word)) urgency += 0.2;
  });
  
  return Math.min(urgency, 1);
};

/**
 * Extract keywords from text
 * @param text - Input text
 * @returns string[]
 */
const extractKeywords = (text: string): string[] => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = text.toLowerCase().split(/\W+/);
  
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) && 
    !/^\d+$/.test(word)
  ).slice(0, 10);
};

/**
 * Detect language from text
 * @param text - Input text
 * @returns string
 */
const detectLanguage = (text: string): string => {
  // Simple language detection based on character sets
  const hindiChars = /[\u0900-\u097F]/;
  const englishChars = /[a-zA-Z]/;
  
  if (hindiChars.test(text)) return 'hi';
  if (englishChars.test(text)) return 'en';
  return 'unknown';
};

/**
 * Mock image analysis for fallback
 * @returns AIAnalysisResult
 */
const getMockImageAnalysis = (): AIAnalysisResult => {
  const mockResults = [
    {
      caption: 'Image shows road damage with visible potholes',
      category: 'ROAD',
      title: 'Road Issue - Potholes detected',
      priority: 2,
      department: 'Public Works Department (PWD)',
      confidence: 0.85,
      tags: ['road', 'pothole', 'damage']
    },
    {
      caption: 'Image shows broken street light fixture',
      category: 'STREETLIGHT',
      title: 'Street Light Issue - Broken fixture',
      priority: 2,
      department: 'Electrical Department',
      confidence: 0.78,
      tags: ['light', 'broken', 'fixture']
    },
    {
      caption: 'Image shows water leakage from pipe',
      category: 'WATER',
      title: 'Water Issue - Pipe leakage',
      priority: 1,
      department: 'Water Supply Department',
      confidence: 0.92,
      tags: ['water', 'leak', 'pipe']
    }
  ];
  
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

/**
 * Mock text analysis for fallback
 * @param text - Input text
 * @returns TextAnalysisResult
 */
const getMockTextAnalysis = (text: string): TextAnalysisResult => {
  const urgency = calculateUrgency(text);
  const keywords = extractKeywords(text);
  const language = detectLanguage(text);
  
  return {
    sentiment: urgency > 0.5 ? 'negative' : 'neutral',
    language,
    keywords,
    urgency
  };
};

/**
 * Get AI service status
 * @returns boolean
 */
export const isAIServiceAvailable = (): boolean => {
  return !!API_KEY;
};
