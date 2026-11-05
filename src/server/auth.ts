import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { AdminUser } from '../types/index.ts';

// Configurable admin credentials via environment variables
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@exposysdata.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Exposys@2026!';
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'exposys_edl_2026_secret';

// Active sessions stored in memory (token -> user)
interface Session {
  user: AdminUser;
  createdAt: number;
  expiresAt: number;
}

const sessions = new Map<string, Session>();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function authenticateAdminCredentials(email: string, password: string): { success: boolean; token?: string; user?: AdminUser; error?: string } {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid administrator credentials' };
  }

  const user: AdminUser = {
    id: 'edl_admin_01',
    email: ADMIN_EMAIL,
    role: 'super_admin',
    name: 'Exposys Admissions Admin',
  };

  const token = `edl_${crypto.randomBytes(32).toString('hex')}`;
  const now = Date.now();

  sessions.set(token, {
    user,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  });

  return { success: true, token, user };
}

export function verifySessionToken(token: string): AdminUser | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return session.user;
}

export function revokeSessionToken(token: string): boolean {
  return sessions.delete(token);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing administrator authentication token' });
  }

  const user = verifySessionToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }

  // Attach user to request
  (req as unknown as { adminUser: AdminUser }).adminUser = user;
  next();
}
