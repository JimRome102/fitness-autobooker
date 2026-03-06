import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';

const router = Router();

const getUserId = (req: Request): string => {
  return config.defaultUserId;
};

/**
 * POST /api/bookings/run
 * Manually trigger booking process
 * (Automation engine implementation coming next)
 */
router.post('/run', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    // TODO: Implement booking engine

    res.status(202).json({
      success: true,
      message: 'Booking engine not yet implemented',
      data: {
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/history
 * Get booking history
 */
router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    // TODO: Implement history fetching

    res.status(200).json({
      success: true,
      data: [],
      meta: {
        total: 0
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as bookingRoutes };
