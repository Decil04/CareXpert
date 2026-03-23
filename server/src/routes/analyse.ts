import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { extractText } from '../services/parser.js';
import { analyseText } from '../services/ai.js';
import Analysis from '../models/Analysis.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (Privacy first: No disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per TRD
  }
});

// Optionally use authenticate if user is present, else continue as guest
router.post('/', (req, res, next) => {
  authenticate(req, res, () => next());
}, upload.single('document'), async (req, res, next) => {
  try {
    const { file } = req;
    const { age, language } = req.query;

    if (!file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    // Strict MIME validation
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Supported: PDF, JPG, PNG, TXT.',
        code: 'INVALID_MIME_TYPE'
      });
    }

    // Step 2 — Text Extraction
    const extractedText = await extractText(file);

    // Step 3 — AI Orchestration
    const analysis = await analyseText(extractedText, { 
      age: age as string | undefined, 
      language: language as string | undefined 
    });

    // Step 4 — Persistence (MongoDB)
    const savedAnalysis = new Analysis({
      ...analysis,
      userId: (req as any).user?.id,
      status: 'completed',
      fileType: file.mimetype,
      fileSize: file.size,
      originalText: extractedText,
    });
    
    await savedAnalysis.save();

    res.json(savedAnalysis);
  } catch (error) {
    console.error('[Route:Analyse] Error:', error);
    next(error);
  }
});

// POST /api/analyse/text
router.post('/text', (req, res, next) => {
  authenticate(req, res, () => next());
}, async (req, res, next) => {
  try {
    const { text } = req.body;
    const { age, language } = req.query;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Directly orchestrate the AI analysis
    const analysis = await analyseText(text, { 
      age: age as string | undefined, 
      language: language as string | undefined 
    });

    // Persistence (MongoDB)
    const savedAnalysis = new Analysis({
      ...analysis,
      userId: (req as any).user?.id,
      status: 'completed',
      fileType: 'text/plain',
      fileSize: text.length,
      originalText: text,
    });
    
    await savedAnalysis.save();

    res.json(savedAnalysis);
  } catch (error) {
    console.error('[Route:AnalyseText] Error:', error);
    next(error);
  }
});

export default router;
