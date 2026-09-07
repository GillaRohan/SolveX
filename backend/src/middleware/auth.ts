import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For seamless demo exploration, if demo-role header is provided:
    const demoRole = req.headers['x-demo-role'] as string;
    if (demoRole) {
      req.user = {
        id: `demo-${demoRole.toLowerCase()}-id`,
        email: `${demoRole.toLowerCase()}@solvex.in`,
        role: demoRole.toUpperCase(),
        name: `Demo ${demoRole.toUpperCase()}`
      };
      return next();
    }
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: `Access denied. Role '${req.user.role}' is not authorized for this resource.` 
      });
      return;
    }

    next();
  };
};
