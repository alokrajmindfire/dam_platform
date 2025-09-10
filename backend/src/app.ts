import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import assetsRouter from './routes/assets.route';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { redisConnection } from './config/queue';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './config/swagger';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(helmet());
app.use(compression());

app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('trust proxy', 1);
var options = {
  explorer: true,
};
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
app.use('/api/assets', assetsRouter);
app.use((req, res) => {
  res.status(404).send('Route Not Found');
});
export { app };
