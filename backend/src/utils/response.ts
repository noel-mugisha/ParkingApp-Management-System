import { Response } from 'express';

/**
 * Standardized API Response utility class
 */
export class ApiResponse {
  /**
   * Send success response
   * @param res Express response object
   * @param statusCode HTTP status code
   * @param message Success message
   * @param data Optional data to include in response
   */
  static success(res: Response, statusCode: number, message: string, data?: any) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data || null
    });
  }

  /**
   * Send error response
   * @param res Express response object
   * @param statusCode HTTP status code
   * @param message Error message
   * @param errors Optional errors object
   */
  static error(res: Response, statusCode: number, message: string, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || null
    });
  }

  /**
   * Send server error response
   * @param res Express response object
   * @param error Error object
   */
  static serverError(res: Response, error: any) {
    console.error('Server error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
}