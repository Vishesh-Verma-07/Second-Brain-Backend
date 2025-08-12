import { Request, Response } from "express";
import { sendResponse } from "../utility/sendResponse";

export const HealthCheck = (req: Request, res: Response) => {
    sendResponse(res, 200, { 
        status: "ok", 
        message: "Health check successful",
        data: {
          timeStamp: new Date().toISOString()
        }
    });
};
