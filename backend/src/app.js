import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import publicRoutes from './routes/public.routes.js';
import studentRoutes from './routes/student.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import interactionRoutes from './routes/interaction.routes.js';
import forumRoutes from './routes/forum.routes.js';
import ebookRoutes from './routes/ebook.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api', ebookRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/reviews', reviewRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('CRMISA API is running...');
});

// Error handling
app.use(errorHandler);

export default app;