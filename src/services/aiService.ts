// AI Service for image captioning and speech recognition
export class AIService {
  private static instance: AIService;
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Normalize Hinglish text to English keywords
  private normalizeText(text: string): string {
    const text_lower = text.toLowerCase();
    const replacements: Record<string, string> = {
      'paani': 'water',
      'pani': 'water',
      'gaddha': 'pothole',
      'gadda': 'pothole',
      'sadak': 'road',
      'sarak': 'road',
      'bijli': 'electricity',
      'light': 'streetlight',
      'batti': 'streetlight',
      'kooda': 'garbage',
      'kachra': 'garbage',
      'dustbin': 'dustbin',
      'pipe': 'pipeline',
      'leak': 'leakage',
      'safai': 'sanitation',
      'ganda': 'dirty',
      'toot': 'broken',
      'kharab': 'broken'
    };
    
    let normalized = text_lower;
    Object.entries(replacements).forEach(([hindi, english]) => {
      normalized = normalized.replace(new RegExp(hindi, 'g'), english);
    });
    
    return normalized;
  }

  // Identify problem type from text and image analysis
  public identifyProblem(imageCaption: string, userText: string): string {
    const combined = (imageCaption + ' ' + this.normalizeText(userText)).toLowerCase();
    
    if (combined.includes('pothole') || combined.includes('road') || combined.includes('crack')) {
      return 'road';
    } else if (combined.includes('streetlight') || combined.includes('light') || combined.includes('electricity') || combined.includes('lamp')) {
      return 'streetlight';
    } else if (combined.includes('water') || combined.includes('leak') || combined.includes('pipeline') || combined.includes('pipe')) {
      return 'water';
    } else if (combined.includes('garbage') || combined.includes('trash') || combined.includes('waste') || combined.includes('dustbin')) {
      return 'sanitation';
    } else {
      return 'other';
    }
  }

  // Map problem to department
  public mapDepartment(problemType: string): string {
    const mapping: Record<string, string> = {
      'road': 'Roads Department',
      'streetlight': 'Electrical Department',
      'water': 'Water Department',
      'sanitation': 'Sanitation Department',
      'other': 'General Complaints Department'
    };
    return mapping[problemType] || 'General Complaints Department';
  }

  // Generate issue title from image and text
  public generateTitle(imageCaption: string, userText: string, problemType: string): string {
    if (userText.trim()) {
      return userText.trim();
    }
    
    const templates: Record<string, string> = {
      'road': 'Road damage reported',
      'streetlight': 'Street light issue',
      'water': 'Water supply problem',
      'sanitation': 'Sanitation issue',
      'other': 'Civic issue reported'
    };
    
    return templates[problemType] || 'Civic issue reported';
  }

  // Simple image analysis (mock implementation)
  public async analyzeImage(imageFile: File): Promise<string> {
    // In a real implementation, this would use a proper image captioning model
    // For now, we'll return a mock caption based on file name or random selection
    const mockCaptions = [
      'A street with visible damage and potholes',
      'A broken street light on a road',
      'Garbage scattered on the street',
      'Water leakage from a pipe',
      'A damaged road surface with cracks'
    ];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
  }

  // Speech to text (using Web Speech API)
  public startSpeechRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'hi-IN'; // Hindi language
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
      };

      recognition.start();
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        try {
          recognition.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }, 10000);
    });
  }

  // Determine priority based on keywords
  public determinePriority(text: string, imageCaption: string): 1 | 2 | 3 {
    const combined = (text + ' ' + imageCaption).toLowerCase();
    
    // High priority keywords
    if (combined.includes('urgent') || combined.includes('emergency') || combined.includes('danger') || 
        combined.includes('accident') || combined.includes('तुरंत') || combined.includes('खतरा')) {
      return 1;
    }
    
    // Medium priority keywords
    if (combined.includes('broken') || combined.includes('damage') || combined.includes('leak') ||
        combined.includes('टूटा') || combined.includes('खराब')) {
      return 2;
    }
    
    // Default to low priority
    return 3;
  }
}

export const aiService = AIService.getInstance();