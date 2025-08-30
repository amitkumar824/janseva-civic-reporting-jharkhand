import { Router, Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../services/cloudinary';
import { analyzeImageWithAI } from '../services/aiService';
import { createError, badRequest, notFound, forbidden } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Validation middleware
const validateIssueCreation = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(['ROAD', 'STREETLIGHT', 'WATER', 'SANITATION', 'OTHER']).withMessage('Invalid category'),
  body('location').trim().isLength({ min: 5, max: 200 }).withMessage('Location must be 5-200 characters'),
  body('priority').optional().isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Invalid priority')
];

const validateIssueUpdate = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('status').optional().isIn(['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).withMessage('Invalid status'),
  body('priority').optional().isIn(['HIGH', 'MEDIUM', 'LOW']).withMessage('Invalid priority')
];

// Create new issue
router.post('/', validateIssueCreation, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, description, category, location, coordinates, priority = 'MEDIUM' } = req.body;
    const userId = req.user!.id;

    // Create issue
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        category,
        location,
        coordinates: coordinates ? JSON.parse(coordinates) : null,
        priority,
        reporterId: userId,
        images: []
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Send real-time notification
    const io = req.app.get('io');
    io.emit('new-issue', { issue });

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Get all issues (with filtering and pagination)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      status, 
      category, 
      priority,
      search,
      userId 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status && status !== 'all') where.status = status;
    if (category && category !== 'all') where.category = category;
    if (priority && priority !== 'all') where.priority = priority;
    if (userId) where.reporterId = userId;
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get issues with pagination
    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { id: true, name: true, email: true }
          },
          assignee: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.issue.count({ where })
    ]);

    res.json({
      issues,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get single issue by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        updates: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!issue) {
      throw notFound('Issue not found');
    }

    res.json({ issue });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch issue' });
    }
  }
});

// Update issue
router.put('/:id', validateIssueUpdate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      throw notFound('Issue not found');
    }

    // Check permissions
    if (userRole === 'CITIZEN' && existingIssue.reporterId !== userId) {
      throw forbidden('You can only update your own issues');
    }

    // Update issue
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: req.body,
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create update record if status changed
    if (req.body.status && req.body.status !== existingIssue.status) {
      await prisma.issueUpdate.create({
        data: {
          issueId: id,
          status: req.body.status,
          message: `Status updated to ${req.body.status}`
        }
      });

      // Send real-time notification
      const io = req.app.get('io');
      io.to(`user-${existingIssue.reporterId}`).emit('issue-updated', { 
        issueId: id, 
        status: req.body.status 
      });
    }

    res.json({
      message: 'Issue updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update issue' });
    }
  }
});

// Delete issue
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      throw notFound('Issue not found');
    }

    // Check permissions
    if (userRole === 'CITIZEN' && existingIssue.reporterId !== userId) {
      throw forbidden('You can only delete your own issues');
    }

    // Delete issue (cascade will handle related records)
    await prisma.issue.delete({
      where: { id }
    });

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete issue' });
    }
  }
});

// Upload images for issue
router.post('/:id/images', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // Array of base64 images

    if (!images || !Array.isArray(images)) {
      throw badRequest('Images array required');
    }

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      throw notFound('Issue not found');
    }

    // Upload images to Cloudinary
    const uploadedUrls = [];
    for (const imageData of images) {
      try {
        const url = await uploadToCloudinary(imageData);
        uploadedUrls.push(url);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
      }
    }

    // Update issue with new images
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        images: [...existingIssue.images, ...uploadedUrls]
      }
    });

    res.json({
      message: 'Images uploaded successfully',
      images: updatedIssue.images
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to upload images' });
    }
  }
});

// Add comment to issue
router.post('/:id/comments', [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters')
], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      throw notFound('Issue not found');
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        issueId: id,
        userId
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    // Send real-time notification
    const io = req.app.get('io');
    io.to(`user-${existingIssue.reporterId}`).emit('new-comment', { 
      issueId: id, 
      comment 
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to add comment' });
    }
  }
});

export default router;
