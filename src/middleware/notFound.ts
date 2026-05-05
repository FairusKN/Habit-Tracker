import type { Request, Response } from 'express';
import ApiResponse from '../utils/apiResponse';

/**
 * Middleware to handle 404 Not Found errors
 * This should be mounted after all other routes
 */
const notFoundHandler = (_: Request, res: Response) => {
  ApiResponse.error(res, '🔍 Ooops! Looks like you are lost. 🗺️', 404);
};

export default notFoundHandler;
