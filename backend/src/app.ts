// import dotenv from 'dotenv';
// import express, { Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// // Removed dynamic sitemap/robots serving; now served statically from frontend

// dotenv.config();

// const app = express();

// // Middleware
// app.use(helmet());
// // const allowedOrigins = [
// //   'https://nexaflowai.com',
// //   'https://www.nexaflowai.com',
// //   'https://hoppscotch.io',
// //   'http://localhost:3000',
// //   'http://localhost:5173',
// //   'http://127.0.0.1:5173',
// // ];

// const allowedOrigins = [
//   'https://nexaflowai.com',
//   'https://www.nexaflowai.com',
//   'https://hoppscotch.io',
//   'http://localhost:3000',
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   'https://nexa-flow-ai.vercel.app',  // ✅ Add your Vercel frontend URL
// ];

// app.use(cors({
//   origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
//     // allow requests with no origin (like curl or Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// // Increase body size limits to support base64 logos in offer letters
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Health check
// app.get('/api/health', (req: Request, res: Response) => res.json({
//   status: 'ok server is running'
// }));

// // Route imports with per-route error handling so one optional module cannot
// // block the core auth routes from mounting.
// const safeLoadRoute = (routePath: string, label: string) => {
//   try {
//     const routeModule = require(routePath);
//     const route = routeModule.default;
//     console.log(`${label} routes imported successfully:`, typeof route);
//     return route;
//   } catch (error) {
//     console.error(`❌ ERROR IMPORTING ${label} ROUTES:`, error);
//     if (error instanceof Error) {
//       console.error('Error details:', error.message);
//       console.error('Stack trace:', error.stack);
//     } else {
//       console.error('Error details:', error);
//     }
//     return null;
//   }
// };

// const userRoutes = safeLoadRoute('./routes/user', 'User');
// if (userRoutes) app.use('/api/user', userRoutes);

// const adminRoutes = safeLoadRoute('./routes/admin', 'Admin');
// if (adminRoutes) app.use('/api/admin', adminRoutes);

// const premiumRoutes = safeLoadRoute('./routes/premium', 'Premium');
// if (premiumRoutes) app.use('/api/premium', premiumRoutes);

// const razorpayRoutes = safeLoadRoute('./routes/razorpay', 'Razorpay');
// if (razorpayRoutes) app.use('/api/razorpay', razorpayRoutes);

// const aiRoutes = safeLoadRoute('./routes/excel/ai', 'AI Excel');
// if (aiRoutes) app.use('/api/ai', aiRoutes);

// const aiFormulaRoutes = safeLoadRoute('./routes/excel/aiFormula', 'AI Formula');
// if (aiFormulaRoutes) app.use('/api/ai/formula', aiFormulaRoutes);

// const chatRoutes = safeLoadRoute('./routes/excel/chat', 'Chat');
// if (chatRoutes) app.use('/api/chat', chatRoutes);

// const errorTrendRoutes = safeLoadRoute('./routes/excel/errorTrend', 'Error Trend');
// if (errorTrendRoutes) app.use('/api/error-trend', errorTrendRoutes);

// const captionRewriterRoutes = safeLoadRoute('./routes/socialpro/captionRewriter', 'Caption Rewriter');
// if (captionRewriterRoutes) app.use('/api/socialpro/captionrewriter', captionRewriterRoutes);

// const aiworkmateChatRoutes = safeLoadRoute('./routes/aiworkmate/aiworkmatechat', 'AI Workmate Chat');
// if (aiworkmateChatRoutes) app.use('/api/aiworkmate/chat', aiworkmateChatRoutes);

// const aiworkmatePromptRoutes = safeLoadRoute('./routes/aiworkmate/prompt', 'AI Workmate Prompt');
// if (aiworkmatePromptRoutes) app.use('/api/aiworkmate/prompt', aiworkmatePromptRoutes);

// const pdfBrainRoutes = safeLoadRoute('./routes/pdf/pdfBrainRoutes', 'PDF Brain');
// if (pdfBrainRoutes) app.use('/api/pdf/brain', pdfBrainRoutes);

// const pdfChatAgentRoutes = safeLoadRoute('./routes/pdf/pdfChatAgentRoutes', 'PDF Chat Agent');
// if (pdfChatAgentRoutes) app.use('/api/pdf/chatagent', pdfChatAgentRoutes);

// const pdfChartRoutes = safeLoadRoute('./routes/pdf/pdfChartRoutes', 'PDF Chart');
// if (pdfChartRoutes) app.use('/api/pdf/chart', pdfChartRoutes);

// const smartDataExtractorRoutes = safeLoadRoute('./routes/pdf/smartDataExtractor', 'Smart Data Extractor');
// if (smartDataExtractorRoutes) app.use('/api/pdf/smartdata', smartDataExtractorRoutes);

// const offerLetterRoutes = safeLoadRoute('./routes/smartdocs/offerletter', 'Offer Letter');
// if (offerLetterRoutes) app.use('/api/smartdocs/offer-letters', offerLetterRoutes);

// const smartInvoiceRoutes = safeLoadRoute('./routes/smartdocs/smartinvoice', 'Smart Invoice');
// if (smartInvoiceRoutes) app.use('/api/smartdocs/smart-invoices', smartInvoiceRoutes);

// const pdfConverterProRoutes = safeLoadRoute('./routes/pdf/pdfConverterPro', 'PDF Converter Pro');
// if (pdfConverterProRoutes) app.use('/api/pdf/convert', pdfConverterProRoutes);

// const bulkmailerExcelEngineRoutes = safeLoadRoute('./routes/bulkmailer/excelEngine', 'Bulk Mailer Excel Engine');
// if (bulkmailerExcelEngineRoutes) app.use('/api/bulkmailer/excel-engine', bulkmailerExcelEngineRoutes);

// const mailmergeRoutes = safeLoadRoute('./routes/bulkmailer/mailmerge', 'Mail Merge');
// if (mailmergeRoutes) app.use('/api/bulkmailer/mailmerge', mailmergeRoutes);

// const smartTemplatesRoutes = safeLoadRoute('./routes/bulkmailer/smartTemplates', 'Smart Templates');
// if (smartTemplatesRoutes) app.use('/api/bulkmailer/smart-templates', smartTemplatesRoutes);

// const mailcraftRoutes = safeLoadRoute('./routes/mailcraft/emailwizard', 'Mailcraft Email Wizard');
// if (mailcraftRoutes) app.use('/api/mailcraft/emailwizard', mailcraftRoutes);

// const subjectLineOptimizerRoutes = safeLoadRoute('./routes/mailcraft/subjectlineoptimizer', 'Subject Line Optimizer');
// if (subjectLineOptimizerRoutes) app.use('/api/mailcraft/subjectlineoptimizer', subjectLineOptimizerRoutes);

// const tonePolisherRoutes = safeLoadRoute('./routes/mailcraft/tonepolisher', 'Tone Polisher');
// if (tonePolisherRoutes) app.use('/api/mailcraft/tonepolisher', tonePolisherRoutes);

// const captionProRoutes = safeLoadRoute('./routes/socialpro/captionPro', 'Caption Pro');
// if (captionProRoutes) app.use('/api/socialpro/captionpro', captionProRoutes);

// const hashtagStrategistRoutes = safeLoadRoute('./routes/socialpro/hashtagStrategist', 'Hashtag Strategist');
// if (hashtagStrategistRoutes) app.use('/api/socialpro/hashtagstrategist', hashtagStrategistRoutes);

// const adCaptionRoutes = safeLoadRoute('./routes/socialpro/adCaption', 'Ad Caption');
// if (adCaptionRoutes) app.use('/api/socialpro/adcaption', adCaptionRoutes);

// // Add a catch-all route for debugging 404s
// app.use('/api/mailcraft/emailwizard/*', (req: Request, res: Response) => {
//   res.status(404).json({ 
//     error: 'Route not found',
//     method: req.method,
//     url: req.originalUrl,
//     availableRoutes: [
//       'GET /api/mailcraft/emailwizard/chat/:chat_id',
//       'POST /api/mailcraft/emailwizard/chat/send'
//     ]
//   });
// });

// // List all registered routes for debugging
// app.get('/api/debug/routes', (req: Request, res: Response) => {
//   const routes: any[] = [];
//   app._router.stack.forEach((middleware: any) => {
//     if (middleware.route) {
//       routes.push({
//         path: middleware.route.path,
//         methods: Object.keys(middleware.route.methods)
//       });
//     } else if (middleware.name === 'router') {
//       middleware.handle.stack.forEach((handler: any) => {
//         if (handler.route) {
//           routes.push({
//             path: middleware.regexp.source.replace('\\/?(?=\\/|$)', '') + handler.route.path,
//             methods: Object.keys(handler.route.methods)
//           });
//         }
//       });
//     }
//   });
//   res.json({ routes });
// });

// // Note: robots.txt and sitemap.xml are served by the frontend at the root domain

// // FIXED: Single error handler (removed duplicate)
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error('❌ Global error handler caught:', err);
//   console.error('Error message:', err.message);
//   console.error('Error stack:', err.stack);
//   res.status(500).json({ 
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // 404 handler for all other routes
// app.use('*', (req: Request, res: Response) => {
//   res.status(404).json({ 
//     error: 'Route not found',
//     method: req.method,
//     url: req.originalUrl
//   });
// });

// // Test LLM endpoint (for debugging)
// import { testLLMConnection } from './controllers/testLLM';
// app.get('/api/test-llm', testLLMConnection);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on port ${PORT}`);
// });








// backend/src/app.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
// Removed dynamic sitemap/robots serving; now served statically from frontend

// Import new modules
import healthRoutes from './routes/health';
import { apiRateLimiter, ragRateLimiter, uploadRateLimiter } from './middlewares/rateLimiter';
import { errorHandler, AppError } from './middlewares/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Middleware
app.use(helmet());

const allowedOrigins = [
  'https://nexaflowai.com',
  'https://www.nexaflowai.com',
  'https://hoppscotch.io',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://nexa-flow-ai.vercel.app',
];

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Increase body size limits to support base64 logos in offer letters
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check - basic
app.get('/api/health', (req: Request, res: Response) => res.json({
  status: 'ok server is running'
}));

// Apply rate limiting to API routes
app.use('/api/rag', ragRateLimiter);
app.use('/api/ai', apiRateLimiter);
app.use('/api/pdf/chatagent', uploadRateLimiter);
app.use('/api/pdf/smartdata', uploadRateLimiter);

// Route imports with per-route error handling so one optional module cannot
// block the core auth routes from mounting.
const safeLoadRoute = (routePath: string, label: string) => {
  try {
    const routeModule = require(routePath);
    const route = routeModule.default;
    logger.info(`${label} routes imported successfully`);
    return route;
  } catch (error) {
    logger.error(`❌ ERROR IMPORTING ${label} ROUTES:`, error);
    if (error instanceof Error) {
      logger.error('Error details:', error.message);
      logger.error('Stack trace:', error.stack);
    }
    return null;
  }
};

// Import health routes
app.use('/api', healthRoutes);

// Import all other routes
const userRoutes = safeLoadRoute('./routes/user', 'User');
if (userRoutes) {
  app.use('/api/user', userRoutes);
  app.use('/user', userRoutes);
}

const adminRoutes = safeLoadRoute('./routes/admin', 'Admin');
if (adminRoutes) app.use('/api/admin', adminRoutes);

const premiumRoutes = safeLoadRoute('./routes/premium', 'Premium');
if (premiumRoutes) app.use('/api/premium', premiumRoutes);

const razorpayRoutes = safeLoadRoute('./routes/razorpay', 'Razorpay');
if (razorpayRoutes) app.use('/api/razorpay', razorpayRoutes);

const aiRoutes = safeLoadRoute('./routes/excel/ai', 'AI Excel');
if (aiRoutes) app.use('/api/ai', aiRoutes);

const aiFormulaRoutes = safeLoadRoute('./routes/excel/aiFormula', 'AI Formula');
if (aiFormulaRoutes) app.use('/api/ai/formula', aiFormulaRoutes);

const chatRoutes = safeLoadRoute('./routes/excel/chat', 'Chat');
if (chatRoutes) app.use('/api/chat', chatRoutes);

const errorTrendRoutes = safeLoadRoute('./routes/excel/errorTrend', 'Error Trend');
if (errorTrendRoutes) app.use('/api/error-trend', errorTrendRoutes);

const captionRewriterRoutes = safeLoadRoute('./routes/socialpro/captionRewriter', 'Caption Rewriter');
if (captionRewriterRoutes) app.use('/api/socialpro/captionrewriter', captionRewriterRoutes);

const aiworkmateChatRoutes = safeLoadRoute('./routes/aiworkmate/aiworkmatechat', 'AI Workmate Chat');
if (aiworkmateChatRoutes) app.use('/api/aiworkmate/chat', aiworkmateChatRoutes);

const aiworkmatePromptRoutes = safeLoadRoute('./routes/aiworkmate/prompt', 'AI Workmate Prompt');
if (aiworkmatePromptRoutes) app.use('/api/aiworkmate/prompt', aiworkmatePromptRoutes);

const pdfBrainRoutes = safeLoadRoute('./routes/pdf/pdfBrainRoutes', 'PDF Brain');
if (pdfBrainRoutes) app.use('/api/pdf/brain', pdfBrainRoutes);

const pdfChatAgentRoutes = safeLoadRoute('./routes/pdf/pdfChatAgentRoutes', 'PDF Chat Agent');
if (pdfChatAgentRoutes) app.use('/api/pdf/chatagent', pdfChatAgentRoutes);

const pdfChartRoutes = safeLoadRoute('./routes/pdf/pdfChartRoutes', 'PDF Chart');
if (pdfChartRoutes) app.use('/api/pdf/chart', pdfChartRoutes);

const smartDataExtractorRoutes = safeLoadRoute('./routes/pdf/smartDataExtractor', 'Smart Data Extractor');
if (smartDataExtractorRoutes) app.use('/api/pdf/smartdata', smartDataExtractorRoutes);

const offerLetterRoutes = safeLoadRoute('./routes/smartdocs/offerletter', 'Offer Letter');
if (offerLetterRoutes) app.use('/api/smartdocs/offer-letters', offerLetterRoutes);

const smartInvoiceRoutes = safeLoadRoute('./routes/smartdocs/smartinvoice', 'Smart Invoice');
if (smartInvoiceRoutes) app.use('/api/smartdocs/smart-invoices', smartInvoiceRoutes);

const pdfConverterProRoutes = safeLoadRoute('./routes/pdf/pdfConverterPro', 'PDF Converter Pro');
if (pdfConverterProRoutes) app.use('/api/pdf/convert', pdfConverterProRoutes);

const bulkmailerExcelEngineRoutes = safeLoadRoute('./routes/bulkmailer/excelEngine', 'Bulk Mailer Excel Engine');
if (bulkmailerExcelEngineRoutes) app.use('/api/bulkmailer/excel-engine', bulkmailerExcelEngineRoutes);

const mailmergeRoutes = safeLoadRoute('./routes/bulkmailer/mailmerge', 'Mail Merge');
if (mailmergeRoutes) app.use('/api/bulkmailer/mailmerge', mailmergeRoutes);

const smartTemplatesRoutes = safeLoadRoute('./routes/bulkmailer/smartTemplates', 'Smart Templates');
if (smartTemplatesRoutes) app.use('/api/bulkmailer/smart-templates', smartTemplatesRoutes);

const mailcraftRoutes = safeLoadRoute('./routes/mailcraft/emailwizard', 'Mailcraft Email Wizard');
if (mailcraftRoutes) app.use('/api/mailcraft/emailwizard', mailcraftRoutes);

const subjectLineOptimizerRoutes = safeLoadRoute('./routes/mailcraft/subjectlineoptimizer', 'Subject Line Optimizer');
if (subjectLineOptimizerRoutes) app.use('/api/mailcraft/subjectlineoptimizer', subjectLineOptimizerRoutes);

const tonePolisherRoutes = safeLoadRoute('./routes/mailcraft/tonepolisher', 'Tone Polisher');
if (tonePolisherRoutes) app.use('/api/mailcraft/tonepolisher', tonePolisherRoutes);

const captionProRoutes = safeLoadRoute('./routes/socialpro/captionPro', 'Caption Pro');
if (captionProRoutes) app.use('/api/socialpro/captionpro', captionProRoutes);

const hashtagStrategistRoutes = safeLoadRoute('./routes/socialpro/hashtagStrategist', 'Hashtag Strategist');
if (hashtagStrategistRoutes) app.use('/api/socialpro/hashtagstrategist', hashtagStrategistRoutes);

const adCaptionRoutes = safeLoadRoute('./routes/socialpro/adCaption', 'Ad Caption');
if (adCaptionRoutes) app.use('/api/socialpro/adcaption', adCaptionRoutes);

// Add a catch-all route for debugging 404s
app.use('/api/mailcraft/emailwizard/*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /api/mailcraft/emailwizard/chat/:chat_id',
      'POST /api/mailcraft/emailwizard/chat/send'
    ]
  });
});

// List all registered routes for debugging
app.get('/api/debug/routes', (req: Request, res: Response) => {
  const routes: any[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push({
            path: middleware.regexp.source.replace('\\/?(?=\\/|$)', '') + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

// Note: robots.txt and sitemap.xml are served by the frontend at the root domain

// Test LLM endpoint (for debugging)
import { testLLMConnection } from './controllers/testLLM';
app.get('/api/test-llm', testLLMConnection);

// === ERROR HANDLING MIDDLEWARE ===
// All error handling middleware must come AFTER all route definitions

// 404 handler for unmatched routes
app.use('*', (req: Request, res: Response) => {
  const error = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
  res.status(404).json({ 
    success: false,
    error: error.message,
    code: 'NOT_FOUND',
    method: req.method,
    url: req.originalUrl
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Server started on port ${PORT}`);
  logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`🔗 RAG health: http://localhost:${PORT}/api/rag/rag/health`);
});

export default app;