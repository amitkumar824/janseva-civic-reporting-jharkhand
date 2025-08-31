import express from 'express';
import cors from 'cors';
import { analyzeCivicIssueWithMultipleInputs } from './services/customAIService';
import path from 'path';
import authRoutes from './routes/auth';
import issuesRoutes from './routes/issues';
import adminRoutes from './routes/admin';
import usersRoutes from './routes/users';
import notificationsRoutes from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Civic Issue API is running' });
});

// AI Analysis endpoint (standalone for demo purposes)
app.post('/api/issues/analyze', async (req, res) => {
  try {
    const { imageData, text, audioData, location } = req.body;
    
    console.log('AI Analysis request received:', {
      hasImage: !!imageData,
      hasText: !!text,
      hasAudio: !!audioData,
      location
    });

    const result = await analyzeCivicIssueWithMultipleInputs(imageData, text, audioData, location);
    
    console.log('AI Analysis result:', result);
    res.json(result);
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'AI analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Civic Issue API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Analysis: http://localhost:${PORT}/api/issues/analyze`);
  console.log(`📝 Submit Issue: http://localhost:${PORT}/api/issues`);
});

export default app;
