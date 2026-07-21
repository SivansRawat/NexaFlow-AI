import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { analyzeExcel } from '../../controllers/excel/excelaiController';
import { authenticate } from '../../middlewares/auth';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Apply authentication to all routes
router.use(authenticate);

const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.error('Multer upload error in analyze-excel:', err);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    next();
  });
};

router.post('/analyze-excel', handleFileUpload, analyzeExcel);

export default router;