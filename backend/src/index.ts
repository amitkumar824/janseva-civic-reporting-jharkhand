import express from 'express';
import cors from 'cors';
import { aiService } from './services/aiService';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory storage for issues (replace with database in production)
let issues: any[] = [];
let issueIdCounter = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Civic Issue API is running' });
});

// AI Analysis endpoint
app.post('/api/issues/analyze', async (req, res) => {
  try {
    const { imageData, text, audioData, location } = req.body;
    
    console.log('AI Analysis request received:', {
      hasImage: !!imageData,
      hasText: !!text,
      hasAudio: !!audioData,
      location
    });

    const result = await aiService.analyzeCivicIssue(imageData, text, audioData, location);
    
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

// Submit issue endpoint
app.post('/api/issues', async (req, res) => {
  try {
    const issueData = req.body;
    
    // Create new issue
    const newIssue = {
      id: issueIdCounter++,
      ...issueData,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolutionPhoto: null,
      assignedTo: null,
      comments: []
    };

    issues.push(newIssue);
    
    console.log('Issue submitted:', newIssue);
    
    res.status(201).json({
      success: true,
      message: 'Issue submitted successfully',
      data: newIssue
    });
  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all issues endpoint
app.get('/api/issues', async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    
    let filteredIssues = [...issues];
    
    // Apply filters
    if (status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === status);
    }
    
    if (category) {
      filteredIssues = filteredIssues.filter(issue => issue.category === category);
    }
    
    if (priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === priority);
    }
    
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredIssues = filteredIssues.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm) ||
        issue.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by creation date (newest first)
    filteredIssues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({
      success: true,
      data: filteredIssues,
      total: filteredIssues.length
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issues',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get single issue endpoint
app.get('/api/issues/:id', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    const issue = issues.find(i => i.id === issueId);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }
    
    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update issue status endpoint
app.put('/api/issues/:id', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    const { status, resolutionPhoto } = req.body;
    
    const issueIndex = issues.findIndex(i => i.id === issueId);
    
    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }
    
    // Update issue
    issues[issueIndex] = {
      ...issues[issueIndex],
      status: status || issues[issueIndex].status,
      resolutionPhoto: resolutionPhoto || issues[issueIndex].resolutionPhoto,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Issue updated:', issues[issueIndex]);
    
    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: issues[issueIndex]
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update issue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add comment to issue endpoint
app.post('/api/issues/:id/comments', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id);
    const { content, author } = req.body;
    
    const issueIndex = issues.findIndex(i => i.id === issueId);
    
    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }
    
    const comment = {
      id: Date.now(),
      content,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString()
    };
    
    issues[issueIndex].comments.push(comment);
    issues[issueIndex].updatedAt = new Date().toISOString();
    
    console.log('Comment added to issue:', comment);
    
    res.json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalIssues = issues.length;
    const submittedIssues = issues.filter(i => i.status === 'SUBMITTED').length;
    const inProgressIssues = issues.filter(i => i.status === 'IN_PROGRESS').length;
    const resolvedIssues = issues.filter(i => i.status === 'RESOLVED').length;
    
    const categoryStats = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as any);
    
    const priorityStats = issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1;
      return acc;
    }, {} as any);
    
    res.json({
      success: true,
      data: {
        total: totalIssues,
        submitted: submittedIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues,
        categories: categoryStats,
        priorities: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Civic Issue API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Analysis: http://localhost:${PORT}/api/issues/analyze`);
  console.log(`📝 Submit Issue: http://localhost:${PORT}/api/issues`);
});

export default app;
