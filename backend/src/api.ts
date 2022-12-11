import { Response } from 'express';

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

export function errorResponse(res: Response, message: string) {
  res.json({
    error: message,
  } as ApiResponse<any>);
}
