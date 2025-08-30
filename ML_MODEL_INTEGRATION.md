# ML Model Integration Guide

## How to Add Your Custom ML Model

### 1. **Upload Your .ipynb File**
- Place your `.ipynb` file in the `backend/ml-models/` directory
- We'll convert it to a Python script that can be called from Node.js

### 2. **Integration Options**

#### Option A: Python Script Integration (Recommended)
- Convert your `.ipynb` to `.py` file
- Use `child_process` in Node.js to call Python script
- Pass data via command line arguments or files
- Get results back as JSON

#### Option B: REST API Integration
- Convert your model to a Flask/FastAPI service
- Run it as a separate service
- Call it via HTTP requests from Node.js

#### Option C: Direct Python Integration
- Use `python-shell` npm package
- Execute Python code directly from Node.js
- Better for real-time processing

### 3. **Current AI Service Structure**
The backend already has an AI service at `backend/src/services/aiService.ts` that:
- Classifies issue images
- Analyzes issue descriptions
- Suggests categories, priorities, and departments
- Currently uses Hugging Face API as fallback

### 4. **Integration Steps**

1. **Create ML Models Directory:**
   ```bash
   mkdir backend/ml-models
   ```

2. **Upload your .ipynb file there**

3. **Convert to Python Script:**
   - Export your notebook as `.py` file
   - Remove interactive elements
   - Add command line argument support

4. **Update aiService.ts:**
   - Replace Hugging Face calls with your model
   - Handle image preprocessing
   - Process text analysis

### 5. **Example Integration Code**

```typescript
// In backend/src/services/aiService.ts
import { spawn } from 'child_process';

export const analyzeImageWithCustomModel = async (imagePath: string) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      'ml-models/your_model.py',
      '--image', imagePath,
      '--output', 'json'
    ]);

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
          reject(new Error('Invalid model output'));
        }
      } else {
        reject(new Error(`Model execution failed: ${error}`));
      }
    });
  });
};
```

### 6. **Requirements**
- Python 3.7+ installed
- Required Python packages (numpy, pandas, scikit-learn, etc.)
- Your model dependencies

### 7. **Testing Your Model**
- Test with sample images/text
- Verify output format matches expected schema
- Check performance and accuracy

## Next Steps
1. Run `setup-backend.bat` to set up the backend
2. Upload your `.ipynb` file to `backend/ml-models/`
3. I'll help you integrate it into the system

## Questions for You
1. What type of ML model is it? (Image classification, text analysis, etc.)
2. What are the input/output formats?
3. What Python packages does it require?
4. Do you want real-time processing or batch processing?
