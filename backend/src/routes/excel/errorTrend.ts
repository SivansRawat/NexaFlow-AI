import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { 
  analyzeExcelForErrorsAndTrends, 
  getAnalysisById, 
  getLatestAnalysis, 
  deleteAnalysis 
} from '../../controllers/excel/errorTrendController';
import { authenticate } from '../../middlewares/auth';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls, .csv) are allowed'));
    }
  }
});

const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.error('Multer upload error in error-trend/analyze:', err);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    next();
  });
};

// POST /api/error-trend/analyze - Analyze Excel file for errors and trends
router.post('/analyze', authenticate, handleFileUpload, analyzeExcelForErrorsAndTrends);

// GET /api/error-trend/analysis/:id - Get analysis by ID
router.get('/analysis/:id', authenticate, getAnalysisById);

// GET /api/error-trend/latest - Get latest analysis for user
router.get('/latest', authenticate, getLatestAnalysis);

// DELETE /api/error-trend/analysis/:id - Delete analysis
router.delete('/analysis/:id', authenticate, deleteAnalysis);

export default router;