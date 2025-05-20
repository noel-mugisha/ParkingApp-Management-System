import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, statusCode: number, message: string, data?: any) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data || null
    });
  }

  static error(res: Response, statusCode: number, message: string, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || null
    });
  }

  static serverError(res: Response, error: any) {
    console.error('Server error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
}