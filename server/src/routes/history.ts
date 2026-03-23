import { Router } from 'express';
import Analysis from '../models/Analysis.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import type { Response } from 'express';

const router = Router();

// GET /api/history - Fetch analysis results with pagination and search
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const { page = '1', limit = '10', q, from, to } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};

    // Search by diagnosis or family summary
    if (q) {
      filter.$or = [
        { diagnosis: { $regex: q, $options: 'i' } },
        { familySummary: { $regex: q, $options: 'i' } },
      ];
    }

    // Date range filtering
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from as string);
      if (to) filter.createdAt.$lte = new Date(to as string);
    }

    const [results, total] = await Promise.all([
      Analysis.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-originalText'),
      Analysis.countDocuments(filter),
    ]);

    res.json({
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/history/:id - Get a single analysis record
router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/history/:id - Delete an analysis record
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
