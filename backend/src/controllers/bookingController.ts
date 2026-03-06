import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config/environment';
import { BookingEngine } from '../automation/core/BookingEngine';
import { BookingHistoryService } from '../services/bookingHistoryService';
import { logger } from '../utils/logger';

const router = Router();
const bookingEngine = new BookingEngine();
const historyService = new BookingHistoryService();

const getUserId = (req: Request): string => {
  return config.defaultUserId;
};

/**
 * POST /api/bookings/run
 * Manually trigger booking process
 */
router.post('/run', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { dryRun } = req.body;

    logger.info(`🚀 Booking run triggered by user ${userId}`);

    if (dryRun) {
      // Dry run mode - just return what would be processed
      return res.status(200).json({
        success: true,
        message: 'Dry run mode - no actual bookings made',
        data: {
          status: 'dry_run'
        }
      });
    }

    // Start booking process (this will take time!)
    // In production, this should be a background job
    const result = await bookingEngine.runBookingProcess(userId);

    res.status(200).json({
      success: true,
      message: 'Booking process completed',
      data: {
        status: 'completed',
        summary: {
          total: result.total,
          successful: result.successful,
          waitlisted: result.waitlisted,
          failed: result.failed
        },
        details: result.details
      }
    });

  } catch (error) {
    logger.error('Booking run failed:', error);
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
    const { platform, result, startDate, endDate, limit, offset } = req.query;

    const history = await historyService.getBookingHistory(userId, {
      platform: platform as any,
      result: result as any,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: limit ? parseInt(limit as string, 10) : 20,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.status(200).json({
      success: true,
      data: history,
      meta: {
        total: history.length
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookings/stats
 * Get booking statistics
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    const stats = await historyService.getBookingStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
});

export { router as bookingRoutes };
