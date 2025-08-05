import { Response } from "express";

type ResponseStatus = "success" | "error";


interface ApiResponse<T> {
  status: ResponseStatus;
  message: string;
  data?: T;
  error?: any;
}

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>
): void {
  res.status(statusCode).json(payload);
}