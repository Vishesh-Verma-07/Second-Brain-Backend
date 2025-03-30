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
    const token = req.headers['token'];

    const decodedInfo = jwt.verify(token as string, JWT_SECRETE) as JwtPayload;

    if(decodedInfo && typeof decodedInfo !== 'string'){
        req.userId = decodedInfo.userId
        next()
    }
    else{
        res.status(403).json({message: "invalid credentaials"})
    }
}