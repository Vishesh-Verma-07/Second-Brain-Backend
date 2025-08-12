import { Response } from "express";

type ResponseStatus = "success" | "error" | "ok";


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



class apiResponse<T = any> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T, message: string = "success") {
            this.statusCode = statusCode;
            this.data = data;
            this.message = message;
            this.success = statusCode < 400;
    }
}
export {
    apiResponse
}
