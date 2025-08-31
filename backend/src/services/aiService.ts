import { spawn } from 'child_process';
import path from 'path';

export class AIService {
  private static instance: AIService;
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    this.pythonPath = 'python3'; // or 'python' depending on your system
    this.scriptPath = path.join(__dirname, '../../ml-models/enhanced_civic_analyzer.py');
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async analyzeCivicIssue(imageData?: string, text?: string, audioData?: string, location?: string): Promise<any> {
    try {
      // For now, use the simplified analysis without Python
      return this.simplifiedAnalysis(imageData, text, audioData, location);
    } catch (error) {
      console.error('AI Analysis error:', error);
      // Return fallback analysis
      return this.fallbackAnalysis(text || '', location || '');
    }
  }

  private simplifiedAnalysis(imageData?: string, text?: string, audioData?: string, location?: string): any {
    // Simulate AI analysis based on input
    let caption = "Image analysis completed";
    let complaintText = text || "";
    
    // If we have image data, simulate some analysis
    if (imageData) {
      caption = "Civic issue detected in uploaded image";
    }
    
    // If we have audio data, simulate speech-to-text
    if (audioData) {
      complaintText = "Voice complaint recorded and processed";
    }
    
    // Combine text for analysis
    const combinedText = (caption + " " + complaintText).toLowerCase();
    const problem = this.identifyProblem(combinedText);
    const department = this.mapDepartment(problem);
    const priority = this.determinePriority(problem);
    const category = this.mapCategory(problem);
    const title = this.generateTitle(problem);
    
    return {
      success: true,
      data: {
        title: title,
        problemIdentified: problem,
        department: department,
        priority: priority,
        category: category,
        imageCaption: caption,
        complaintText: complaintText || `Issue detected from image analysis: ${caption}`,
        location: location || "Location not provided",
        aiConfidence: "medium"
      }
    };
  }

  private runPythonScript(inputData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const inputJson = JSON.stringify(inputData);
      
      const pythonProcess = spawn(this.pythonPath, [this.scriptPath, inputJson]);
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (error) {
            console.error('Error parsing Python output:', error);
            reject(new Error('Failed to parse AI analysis result'));
          }
        } else {
          console.error('Python script error:', stderr);
          reject(new Error(`AI analysis failed with code ${code}: ${stderr}`));
        }
      });
      
      pythonProcess.on('error', (error) => {
        console.error('Error spawning Python process:', error);
        reject(new Error('Failed to start AI analysis'));
      });
    });
  }

  private fallbackAnalysis(text: string, location: string): any {
    const normalizedText = this.normalizeText(text);
    const problem = this.identifyProblem(normalizedText);
    
    return {
      success: true,
      data: {
        title: this.generateTitle(problem),
        problemIdentified: problem,
        department: this.mapDepartment(problem),
        priority: this.determinePriority(problem),
        category: this.mapCategory(problem),
        imageCaption: 'Image analysis completed',
        complaintText: text || 'Issue detected from image analysis',
        location: location || 'Location not provided',
        aiConfidence: 'low'
      }
    };
  }

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

  private identifyProblem(text: string): string {
    if (text.includes("pothole") || text.includes("road") || text.includes("damage")) {
      return "Pothole / Road Damage";
    } else if (text.includes("streetlight") || text.includes("light") || text.includes("electricity")) {
      return "Streetlight / Electrical Issue";
    } else if (text.includes("water") || text.includes("leak") || text.includes("pipeline")) {
      return "Water Leakage / Pipeline Issue";
    } else if (text.includes("garbage") || text.includes("dustbin") || text.includes("sanitation")) {
      return "Garbage / Sanitation Issue";
    } else if (text.includes("drainage") || text.includes("gutter") || text.includes("nala")) {
      return "Drainage Issue";
    } else if (text.includes("traffic") || text.includes("signal")) {
      return "Traffic / Signal Issue";
    } else {
      return "Other Civic Issue";
    }
  }

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
}

export const aiService = AIService.getInstance();
