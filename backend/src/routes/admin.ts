import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth';
import { createError, badRequest, notFound } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get dashboard statistics
router.get('/dashboard', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalIssues,
      pendingIssues,
      resolvedIssues,
      totalUsers,
      issuesByCategory,
      issuesByStatus,
      recentIssues
    ] = await Promise.all([
      prisma.issue.count(),
      prisma.issue.count({ where: { status: { not: 'RESOLVED' } } }),
      prisma.issue.count({ where: { status: 'RESOLVED' } }),
      prisma.user.count({ where: { role: 'CITIZEN' } }),
      prisma.issue.groupBy({
        by: ['category'],
        _count: { category: true }
      }),
      prisma.issue.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.issue.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { name: true } }
        }
      })
    ]);

    const stats = {
      totalIssues,
      pendingIssues,
      resolvedIssues,
      totalUsers,
      resolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0,
      issuesByCategory: issuesByCategory.map(item => ({
        category: item.category,
        count: item._count.category
      })),
      issuesByStatus: issuesByStatus.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      recentIssues
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', role, search } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (role && role !== 'all') where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              reportedIssues: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.put('/users/:id/role', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CITIZEN', 'ADMIN', 'DEPARTMENT', 'SUPERADMIN'].includes(role)) {
      throw badRequest('Invalid role');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }
});

// Assign issue to department/user
router.put('/issues/:id/assign', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { assigneeId, department } = req.body;

    const issue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!issue) {
      throw notFound('Issue not found');
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        assigneeId,
        department,
        status: 'ASSIGNED'
      },
      include: {
        reporter: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } }
      }
    });

    // Create update record
    await prisma.issueUpdate.create({
      data: {
        issueId: id,
        status: 'ASSIGNED',
        message: `Issue assigned to ${department || 'department'}`
      }
    });

    // Send real-time notification
    const io = req.app.get('io');
    io.to(`user-${issue.reporterId}`).emit('issue-updated', { 
      issueId: id, 
      status: 'ASSIGNED' 
    });

    res.json({
      message: 'Issue assigned successfully',
      issue: updatedIssue
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to assign issue' });
    }
  }
});

// Update issue status (admin only)
router.put('/issues/:id/status', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!['SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(status)) {
      throw badRequest('Invalid status');
    }

    const issue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!issue) {
      throw notFound('Issue not found');
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: { status },
      include: {
        reporter: { select: { name: true, email: true } }
      }
    });

    // Create update record
    await prisma.issueUpdate.create({
      data: {
        issueId: id,
        status,
        message: message || `Status updated to ${status}`
      }
    });

    // Send real-time notification
    const io = req.app.get('io');
    io.to(`user-${issue.reporterId}`).emit('issue-updated', { 
      issueId: id, 
      status 
    });

    res.json({
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update issue status' });
    }
  }
});

// Get analytics data
router.get('/analytics', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      issuesByDate,
      categoryTrends,
      resolutionTime,
      topReporters
    ] = await Promise.all([
      // Issues created by date
      prisma.issue.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: {
          createdAt: { gte: startDate }
        }
      }),
      // Category trends
      prisma.issue.groupBy({
        by: ['category', 'createdAt'],
        _count: { id: true },
        where: {
          createdAt: { gte: startDate }
        }
      }),
      // Average resolution time
      prisma.issue.findMany({
        where: {
          status: 'RESOLVED',
          createdAt: { gte: startDate }
        },
        select: {
          createdAt: true,
          updatedAt: true
        }
      }),
      // Top reporters
      prisma.user.findMany({
        where: {
          role: 'CITIZEN',
          reportedIssues: {
            some: {
              createdAt: { gte: startDate }
            }
          }
        },
        select: {
          name: true,
          _count: {
            select: { reportedIssues: true }
          }
        },
        orderBy: {
          reportedIssues: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculate average resolution time
    const avgResolutionTime = resolutionTime.length > 0 
      ? resolutionTime.reduce((acc, issue) => {
          const timeDiff = issue.updatedAt.getTime() - issue.createdAt.getTime();
          return acc + timeDiff;
        }, 0) / resolutionTime.length
      : 0;

    const analytics = {
      issuesByDate: issuesByDate.map(item => ({
        date: item.createdAt,
        count: item._count.id
      })),
      categoryTrends: categoryTrends.map(item => ({
        category: item.category,
        date: item.createdAt,
        count: item._count.id
      })),
      avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60 * 24)), // in days
      topReporters: topReporters.map(user => ({
        name: user.name,
        issueCount: user._count.reportedIssues
      }))
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
