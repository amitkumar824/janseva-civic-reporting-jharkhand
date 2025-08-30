@echo off
echo Testing ML Model Integration...
echo.

echo Step 1: Testing Python script...
cd backend\ml-models
python civic_analyzer.py --help
if %errorlevel% neq 0 (
    echo ERROR: ML model test failed!
    echo Please run setup-ml-model.bat first
    pause
    exit /b 1
)

echo.
echo Step 2: Testing with sample data...
echo Testing text analysis...
python civic_analyzer.py --text "Sadak mein gaddha hai" --output json

echo.
echo Step 3: Testing Node.js integration...
cd ..
node -e "
const { analyzeCivicIssueWithCustomModel } = require('./src/services/customAIService.ts');
console.log('Testing custom AI service...');
analyzeCivicIssueWithCustomModel('', 'Road mein pothole hai')
  .then(result => console.log('Result:', JSON.stringify(result, null, 2)))
  .catch(err => console.error('Error:', err));
"

echo.
echo ML Model test completed!
echo If you see any errors, please check the setup guide.
pause
