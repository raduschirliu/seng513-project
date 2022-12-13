import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export type ApiResponse<T> =
  | { success: false; error: string }
  | {
      success: true;
      data: T;
    };

export function successResponse<T>(res: Response, data: T) {
  res.json({
    success: true,
    data,
  } as ApiResponse<T>);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode?: StatusCodes
) {
  const code = statusCode || StatusCodes.OK;
  res.status(code).json({
    error: message,
  } as ApiResponse<any>);
}
