import { Router, Request, Response, NextFunction } from 'express';
import { PreferenceService } from '../services/preferenceService';
import { config } from '../config/environment';
import { CreatePreferenceRequest, UpdatePreferenceRequest } from '../types';

const router = Router();
const preferenceService = new PreferenceService();

const getUserId = (req: Request): string => {
  return config.defaultUserId;
};

/**
 * POST /api/preferences
 * Create a new booking preference
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const request: CreatePreferenceRequest = req.body;

    const preference = await preferenceService.createPreference(userId, request);

    res.status(201).json({
      success: true,
      data: preference
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/preferences
 * Get all preferences for user
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { active, platform, date } = req.query;

    const filters: any = {};
    if (active !== undefined) filters.active = active === 'true';
    if (platform) filters.platform = platform as string;
    if (date) filters.date = date as string;

    const preferences = await preferenceService.getPreferences(userId, filters);

    res.status(200).json({
      success: true,
      data: preferences,
      meta: {
        total: preferences.length,
        filters
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/preferences/:id
 * Get a single preference
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const preferenceId = req.params.id;

    const preference = await preferenceService.getPreferenceById(userId, preferenceId);

    if (!preference) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Preference not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/preferences/:id
 * Update a preference
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const preferenceId = req.params.id;
    const updates: UpdatePreferenceRequest = req.body;

    const preference = await preferenceService.updatePreference(
      userId,
      preferenceId,
      updates
    );

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/preferences/:id
 * Delete a preference
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const preferenceId = req.params.id;

    await preferenceService.deletePreference(userId, preferenceId);

    res.status(200).json({
      success: true,
      message: 'Preference deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as preferenceRoutes };
