import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
const JWT_SECRETE = "jasdklfjawofnwaeoign"

declare global {
    namespace Express {
      interface Request {
        userId: string  | JwtPayload
      }
    }
  }

export function auth(req: Request, res: Response, next: NextFunction){
  // Try to get token from headers or cookies

  const token = req.headers['token'] || req.cookies?.token;
  
  if (!token) {
    res.status(401).json({message: "No token provided"});
    return;
  }

  try {
    const decodedInfo = jwt.verify(token as string, JWT_SECRETE) as JwtPayload;

    if(decodedInfo && typeof decodedInfo !== 'string'){
      req.userId = decodedInfo.userId;
      next();
    } else {
      res.status(403).json({message: "Invalid credentials"});
    }
  } catch (error) {
    res.status(403).json({message: "Invalid token"});
  }
}