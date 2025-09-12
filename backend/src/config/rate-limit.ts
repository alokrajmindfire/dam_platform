import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    error: 'Too many requests. Please try again after 5 minutes.',
  },

  handler: (req: Request, res: Response) => {
    console.warn(
      `Rate limit exceeded: IP=${req.ip}, URL=${req.originalUrl}, Time=${new Date().toISOString()}`,
    );

    res.status(429).json({
      success: false,
      error:
        'You have sent too many requests in a short period. Please wait 5 minutes before trying again.',
    });
  },

  skipSuccessfulRequests: false,
});
