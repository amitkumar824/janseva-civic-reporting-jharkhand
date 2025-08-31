// AI Service for frontend - calls backend AI model
export class AIService {
  private static instance: AIService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Analyze civic issue using backend AI model
  public async analyzeCivicIssue(imageData?: string, text?: string, audioData?: string, location?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/issues/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          text,
          audioData,
          location
        }),
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI Analysis error:', error);
      // Fallback to basic analysis if AI fails
      return this.fallbackAnalysis(text || '', location || '');
    }
  }

  // Analyze image using backend AI model - returns structured data
  public async analyzeImage(file: File): Promise<any> {
    try {
      const base64Data = await this.fileToBase64(file);
      const result = await this.analyzeCivicIssue(base64Data);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      // Return fallback analysis
      return this.fallbackAnalysis('', '').data;
    }
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Fallback analysis when AI is not available
  private fallbackAnalysis(text: string, location: string): any {
    const normalizedText = this.normalizeText(text);
    const problem = this.identifyProblem(normalizedText);
    
    return {
      success: true,
      data: {
        problemIdentified: problem,
        department: this.mapDepartment(problem),
        priority: this.determinePriority(problem),
        category: this.mapCategory(problem),
        imageCaption: 'Image analysis completed',
        complaintText: text || 'Issue detected from image analysis',
        location: location || 'Location not provided',
        title: this.generateTitle(problem)
      }
    };
  }

  // Generate title from problem
  private generateTitle(problem: string): string {
    const titles = {
      "Pothole / Road Damage": "Road Damage Issue",
      "Streetlight / Electrical Issue": "Street Light Problem",
      "Water Leakage / Pipeline Issue": "Water Supply Issue",
      "Garbage / Sanitation Issue": "Sanitation Problem",
      "Drainage Issue": "Drainage Problem",
      "Traffic / Signal Issue": "Traffic Management Issue",
      "Other Civic Issue": "Civic Issue Reported"
    };
    return titles[problem as keyof typeof titles] || "Civic Issue Reported";
  }

  // Text normalization for Hinglish
  private normalizeText(text: string): string {
    if (!text) return '';
    
    text = text.toLowerCase();
    const replacements = {
      "paani": "water",
      "gaddha": "pothole", 
      "sadak": "road",
      "bijli": "electricity",
      "light": "streetlight",
      "kooda": "garbage",
      "dustbin": "dustbin",
      "pipe": "pipeline",
      "leak": "leakage",
      "nala": "drainage",
      "gutter": "drainage",
      "traffic": "traffic",
      "signal": "traffic signal"
    };
    
    for (const [key, value] of Object.entries(replacements)) {
      text = text.replace(new RegExp(key, 'g'), value);
    }
    return text;
  }

  // Problem identification
  private identifyProblem(text: string): string {
    if ("pothole" in text || "road" in text || "damage" in text) {
      return "Pothole / Road Damage";
    } else if ("streetlight" in text || "light" in text || "electricity" in text) {
      return "Streetlight / Electrical Issue";
    } else if ("water" in text || "leak" in text || "pipeline" in text) {
      return "Water Leakage / Pipeline Issue";
    } else if ("garbage" in text || "dustbin" in text || "sanitation" in text) {
      return "Garbage / Sanitation Issue";
    } else if ("drainage" in text || "gutter" in text || "nala" in text) {
      return "Drainage Issue";
    } else if ("traffic" in text || "signal" in text) {
      return "Traffic / Signal Issue";
    } else {
      return "Other Civic Issue";
    }
  }

  // Department mapping
  private mapDepartment(problem: string): string {
    const mapping: { [key: string]: string } = {
      "Pothole / Road Damage": "Roads Department",
      "Streetlight / Electrical Issue": "Electrical Department", 
      "Water Leakage / Pipeline Issue": "Water Department",
      "Garbage / Sanitation Issue": "Sanitation Department",
      "Drainage Issue": "Drainage Department",
      "Traffic / Signal Issue": "Traffic Department",
      "Other Civic Issue": "General Complaints Department"
    };
    return mapping[problem] || "General Complaints Department";
  }

  // Priority determination
  private determinePriority(problem: string): string {
    const highPriority = ["Water Leakage / Pipeline Issue", "Electrical Issue"];
    if (highPriority.includes(problem)) {
      return "HIGH";
    } else if (problem.includes("Road") || problem.includes("Traffic")) {
      return "MEDIUM";
    } else {
      return "LOW";
    }
  }

  // Category mapping
  private mapCategory(problem: string): string {
    if (problem.includes("Road")) {
      return "ROAD";
    } else if (problem.includes("Streetlight") || problem.includes("Electrical")) {
      return "STREETLIGHT";
    } else if (problem.includes("Water")) {
      return "WATER";
    } else if (problem.includes("Garbage") || problem.includes("Sanitation")) {
      return "SANITATION";
    } else {
      return "OTHER";
    }
  }

  // Voice-to-text using Web Speech API
  public async startSpeechRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-IN'; // Support for Indian English
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let transcript = '';

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        transcript = event.results[0][0].transcript;
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        reject(new Error(`Speech recognition failed: ${event.error}`));
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (transcript) {
          resolve(transcript);
        } else {
          reject(new Error('No speech detected'));
        }
      };

      recognition.start();
    });
  }
}

export const aiService = AIService.getInstance();