import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// In-memory storage for demo (use database in production)
let issues = [
  {
    id: '1',
    title: 'स्ट्रीट लाइट खराब है',
    description: 'मुख्य रोड पर स्ट्रीट लाइट काम नहीं कर रही',
    category: 'streetlight',
    status: 'submitted',
    priority: 2,
    location: 'कनॉट प्लेस, नई दिल्ली',
    reporterName: 'राहुल शर्मा',
    reporterId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'इलेक्ट्रिकल',
    images: []
  }
];

let users = [
  {
    id: 'user1',
    name: 'राहुल शर्मा',
    email: 'rahul@example.com',
    role: 'citizen',
    phone: '+91 98765 43210'
  },
  {
    id: 'admin1',
    name: 'श्रीमती प्रिया पटेल',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+91 98765 43211'
  }
];

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Mock authentication
  const user = users.find(u => u.email === email && u.role === role);
  
  if (user) {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      success: true,
      user: user,
      token: token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: 'user' + Date.now(),
    name,
    email,
    role: 'citizen',
    phone
  };
  
  users.push(newUser);
  
  const token = 'mock-jwt-token-' + Date.now();
  res.json({
    success: true,
    user: newUser,
    token: token
  });
});

// Issues endpoints
app.get('/api/issues', (req, res) => {
  const { userId, role } = req.query;
  
  let filteredIssues = issues;
  
  // If citizen, only show their issues
  if (role === 'citizen') {
    filteredIssues = issues.filter(issue => issue.reporterId === userId);
  }
  
  res.json({
    success: true,
    issues: filteredIssues
  });
});

app.get('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const issue = issues.find(i => i.id === id);
  
  if (issue) {
    res.json({
      success: true,
      issue: issue
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }
});

app.post('/api/issues', upload.array('images', 3), (req, res) => {
  try {
    const { title, description, category, location, coordinates, reporterId } = req.body;
    
    // Process uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newIssue = {
      id: Date.now().toString(),
      title,
      description,
      category,
      status: 'submitted',
      priority: 2, // Default priority
      location,
      coordinates: coordinates ? JSON.parse(coordinates) : null,
      reporterName: users.find(u => u.id === reporterId)?.name || 'Unknown',
      reporterId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      department: getDepartmentByCategory(category),
      images: imageUrls
    };
    
    issues.push(newIssue);
    
    res.json({
      success: true,
      issue: newIssue,
      message: 'Issue reported successfully'
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue'
    });
  }
});

app.put('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const { status, department, assignedTo, resolutionNote } = req.body;
  
  const issueIndex = issues.findIndex(i => i.id === id);
  
  if (issueIndex !== -1) {
    issues[issueIndex] = {
      ...issues[issueIndex],
      status,
      department: department || issues[issueIndex].department,
      assignedTo,
      resolutionNote,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      issue: issues[issueIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }
});

// Helper function to map category to department
function getDepartmentByCategory(category) {
  const mapping = {
    'electricity_connection': 'विद्युत विभाग',
    'fund_not_received': 'वित्त विभाग',
    'pmay_handover': 'आवास विभाग',
    'hydt_repairing': 'जल विभाग',
    'motor_repairing': 'मैकेनिकल विभाग',
    'new_boring': 'जल विभाग',
    'water_bill': 'जल बोर्ड',
    'hand_pump_repairing': 'जल विभाग',
    'water_leakage': 'जल विभाग',
    'septic_tank': 'स्वच्छता विभाग',
    'rnb_issues': 'सड़क और भवन विभाग',
    'new_holding_trade': 'नगर निगम',
    'trade_renewal': 'नगर निगम',
    'tax_increase': 'राजस्व विभाग',
    'number_not_generated': 'नगर निगम',
    'receipt_not_generated': 'वित्त विभाग',
    'bill_correction': 'नगर निगम',
    'sanitation': 'स्वच्छता विभाग',
    'road': 'सड़क विभाग',
    'streetlight': 'विद्युत विभाग',
    'water': 'जल विभाग',
    'other': 'सामान्य शिकायत विभाग'
  };
  
  return mapping[category] || 'सामान्य शिकायत विभाग';
}

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const pending = issues.filter(i => ['submitted', 'acknowledged', 'assigned', 'in_progress'].includes(i.status)).length;
  const highPriority = issues.filter(i => i.priority === 1 && i.status !== 'resolved').length;
  
  res.json({
    success: true,
    stats: {
      total,
      resolved,
      pending,
      highPriority
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});