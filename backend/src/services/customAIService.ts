import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export interface CustomAIAnalysisResult {
  success: boolean;
  data?: {
    imageCaption: string;
    complaintText: string;
    problemIdentified: string;
    department: string;
    priority: string;
    category: string;
    location: string;
    confidence: number;
  };
  error?: string;
}

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
 * Analyze civic issue using custom ML model
 * @param imageData - Base64 encoded image or file path
 * @param text - Text description
 * @param audioPath - Audio file path (optional)
 * @param location - GPS coordinates (optional)
 * @returns Promise<CustomAIAnalysisResult>
 */
export const analyzeCivicIssueWithCustomModel = async (
  imageData: string,
  text?: string,
  audioPath?: string,
  location?: string
): Promise<CustomAIAnalysisResult> => {
  try {
    // Create temporary image file if base64 data
    let imagePath = imageData;
    if (imageData.startsWith('data:image')) {
      imagePath = await saveBase64Image(imageData);
    }

    // Prepare command line arguments
    const args = ['ml-models/civic_analyzer.py'];
    
    if (imagePath) args.push('--image', imagePath);
    if (text) args.push('--text', text);
    if (audioPath) args.push('--audio', audioPath);
    if (location) args.push('--location', location);
    args.push('--output', 'json');

    // Execute Python script
    const result = await executePythonScript(args);
    
    // Clean up temporary file if created
    if (imagePath !== imageData && imagePath.startsWith('/tmp/')) {
      try {
        await fs.unlink(imagePath);
      } catch (e) {
        console.warn('Failed to clean up temporary image file:', e);
      }
    }

    return result;
  } catch (error) {
    console.error('Custom AI analysis failed:', error);
    return {
      success: false,
      error: `Custom AI analysis failed: ${error}`
    };
  }
};

/**
 * Execute Python script with arguments
 * @param args - Command line arguments
 * @returns Promise<CustomAIAnalysisResult>
 */
const executePythonScript = (args: string[]): Promise<CustomAIAnalysisResult> => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', args, {
      cwd: path.join(__dirname, '..', '..'), // Navigate to backend root
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const prediction = JSON.parse(result);
          resolve(prediction);
        } catch (e) {
          resolve({
            success: false,
            error: `Invalid model output: ${e}`
          });
        }
      } else {
        resolve({
          success: false,
          error: `Model execution failed (code ${code}): ${error}`
        });
      }
    });

    pythonProcess.on('error', (err) => {
      resolve({
        success: false,
        error: `Failed to start Python process: ${err.message}`
      });
    });

    // Set timeout
    setTimeout(() => {
      pythonProcess.kill();
      resolve({
        success: false,
        error: 'Model execution timed out'
      });
    }, 30000); // 30 second timeout
  });
};

/**
 * Save base64 image to temporary file
 * @param base64Data - Base64 encoded image
 * @returns Promise<string> - File path
 */
const saveBase64Image = async (base64Data: string): Promise<string> => {
  try {
    // Remove data URL prefix
    const imageData = base64Data.split(',')[1];
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    // Create temporary file
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempFile = path.join(tempDir, `temp_${Date.now()}.jpg`);
    await fs.writeFile(tempFile, imageBuffer);
    
    return tempFile;
  } catch (error) {
    throw new Error(`Failed to save base64 image: ${error}`);
  }
};

/**
 * Convert custom AI result to standard format
 * @param customResult - Custom AI analysis result
 * @returns AIAnalysisResult
 */
export const convertToStandardFormat = (customResult: CustomAIAnalysisResult): AIAnalysisResult => {
  if (!customResult.success || !customResult.data) {
    // Fallback to mock result
    return getMockImageAnalysis();
  }

  const data = customResult.data;
  
  return {
    caption: data.imageCaption,
    category: data.category,
    title: `${data.problemIdentified} - ${data.department}`,
    priority: priorityToNumber(data.priority),
    department: data.department,
    confidence: data.confidence,
    tags: extractTagsFromText(data.complaintText + ' ' + data.imageCaption)
  };
};

/**
 * Convert priority string to number
 * @param priority - Priority string
 * @returns number
 */
const priorityToNumber = (priority: string): number => {
  switch (priority.toUpperCase()) {
    case 'HIGH': return 1;
    case 'MEDIUM': return 2;
    case 'LOW': return 3;
    default: return 2;
  }
};

/**
 * Extract tags from text
 * @param text - Input text
 * @returns string[]
 */
const extractTagsFromText = (text: string): string[] => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = text.toLowerCase().split(/\W+/);
  
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) && 
    !/^\d+$/.test(word)
  ).slice(0, 10);
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
 * Get custom AI service status
 * @returns boolean
 */
export const isCustomAIServiceAvailable = async (): Promise<boolean> => {
  try {
    const result = await executePythonScript(['ml-models/civic_analyzer.py', '--help']);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Legacy function for backward compatibility
 * @param imageData - Base64 encoded image
 * @returns Promise<AIAnalysisResult>
 */
export const analyzeImageWithAI = async (imageData: string): Promise<AIAnalysisResult> => {
  try {
    const customResult = await analyzeCivicIssueWithCustomModel(imageData);
    return convertToStandardFormat(customResult);
  } catch (error) {
    console.error('Custom AI analysis failed, falling back to mock:', error);
    return getMockImageAnalysis();
  }
};

/**
 * Legacy function for backward compatibility
 * @param text - Text to analyze
 * @returns Promise<TextAnalysisResult>
 */
export const analyzeTextWithAI = async (text: string): Promise<TextAnalysisResult> => {
  try {
    const customResult = await analyzeCivicIssueWithCustomModel('', text);
    
    if (customResult.success && customResult.data) {
      const data = customResult.data;
      return {
        sentiment: 'negative', // Civic issues are typically negative
        language: detectLanguage(data.complaintText),
        keywords: extractTagsFromText(data.complaintText),
        urgency: data.priority === 'HIGH' ? 0.9 : data.priority === 'MEDIUM' ? 0.6 : 0.3
      };
    }
    
    return getMockTextAnalysis(text);
  } catch (error) {
    console.error('Custom AI text analysis failed, falling back to mock:', error);
    return getMockTextAnalysis(text);
  }
};

/**
 * Detect language from text
 * @param text - Input text
 * @returns string
 */
const detectLanguage = (text: string): string => {
  const hindiChars = /[\u0900-\u097F]/;
  const englishChars = /[a-zA-Z]/;
  
  if (hindiChars.test(text)) return 'hi';
  if (englishChars.test(text)) return 'en';
  return 'unknown';
};

/**
 * Mock text analysis for fallback
 * @param text - Input text
 * @returns TextAnalysisResult
 */
const getMockTextAnalysis = (text: string): TextAnalysisResult => {
  const urgency = calculateUrgency(text);
  const keywords = extractTagsFromText(text);
  const language = detectLanguage(text);
  
  return {
    sentiment: urgency > 0.5 ? 'negative' : 'neutral',
    language,
    keywords,
    urgency
  };
};

/**
 * Calculate urgency from text
 * @param text - Input text
 * @returns number
 */
const calculateUrgency = (text: string): number => {
  const urgentWords = ['urgent', 'emergency', 'critical', 'immediate', 'asap', 'broken', 'leak', 'danger'];
  const urgentCount = urgentWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length;
  
  const urgency = Math.min(urgentCount * 0.2, 1);
  return Math.max(urgency, 0.1);
};
