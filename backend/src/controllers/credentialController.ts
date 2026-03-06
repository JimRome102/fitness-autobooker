import { Router, Request, Response, NextFunction } from 'express';
import { CredentialService } from '../services/credentialService';
import { config } from '../config/environment';
import { CreateCredentialRequest } from '../types';

const router = Router();
const credentialService = new CredentialService();

// For MVP, we use a default user ID
// In production, this would come from auth middleware
const getUserId = (req: Request): string => {
  return config.defaultUserId;
};

/**
 * POST /api/credentials
 * Create a new credential
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const request: CreateCredentialRequest = req.body;

    const credential = await credentialService.createCredential(userId, request);

    // Don't send encrypted data in response
    const response = {
      id: credential.id,
      platform: credential.platform,
      is_active: credential.is_active,
      last_tested: credential.last_tested,
      created_at: credential.created_at,
      updated_at: credential.updated_at
    };

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/credentials
 * Get all credentials for user
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const credentials = await credentialService.getCredentials(userId);

    // Don't send encrypted data
    const response = credentials.map(cred => ({
      id: cred.id,
      platform: cred.platform,
      is_active: cred.is_active,
      last_tested: cred.last_tested,
      created_at: cred.created_at,
      updated_at: cred.updated_at
    }));

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/credentials/:id
 * Update a credential
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const credentialId = req.params.id;
    const { username, password } = req.body;

    const credential = await credentialService.updateCredential(
      userId,
      credentialId,
      { username, password }
    );

    const response = {
      id: credential.id,
      platform: credential.platform,
      is_active: credential.is_active,
      updated_at: credential.updated_at
    };

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/credentials/:id
 * Delete a credential
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const credentialId = req.params.id;

    await credentialService.deleteCredential(userId, credentialId);

    res.status(200).json({
      success: true,
      message: 'Credential deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as credentialRoutes };
