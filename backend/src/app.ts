import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import assetsRouter from './routes/assets.route';
import teamRouter from './routes/team.routes';
import projectRouter from './routes/project.routes';
import dashboardRouter from './routes/dashboard.routes';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';
import { redisConnection } from './config/queue';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './config/swagger';
import { limiter } from './config/rate-limit';
import { ErrorHandler } from './utils/Error';
import { CORS_CONF, HELMET_CONFIG } from './utils/constants';

const app = express();

app.use(cors(CORS_CONF));
app.use(helmet(HELMET_CONFIG));
app.use(compression());
app.use(morgan('combined'));

app.use('/api/', limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1,
      redis: redisConnection.status === 'ready',
    },
  });
});
app.use('/api/auth', authRoute);
app.use('/api/', userRoute);
app.use('/api/assets', assetsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/projects', projectRouter);
app.use('/api/teams', teamRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  (error as any).statusCode = 404;
  (error as any).isOperational = true;
  next(error);
});
app.use(ErrorHandler);

export { app };
