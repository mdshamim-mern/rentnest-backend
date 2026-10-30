import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
export const retiredDemoEmails = ['demo@rentnest.example', 'admin.demo@rentnest.example', 'landlord.demo@rentnest.example'];
// Reject still-valid tokens issued for the retired virtual identities.
// Never let their former ADMIN role fall through to real controllers.
export function adminDemo(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) return next();
  let identity: any;
  try { identity = jwt.verify(token, config.jwt.access_secret as Secret); } catch { return next(); }
  if (retiredDemoEmails.includes(identity.email) || ['demo-user', 'demo-admin', 'demo-landlord'].includes(identity.id)) {
    return res.status(401).json({ success: false, message: 'Sample previews have been retired. Please sign in with your real account.' });
  }
  return next();
}
