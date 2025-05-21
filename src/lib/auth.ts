import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { User } from '@/services/auth.service';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'MiClaveUltraSecretaQueDebeSerDeAlMenos256BitsDeLargo123456';

export function getUserFromRequest(req: IncomingMessage): Omit<User, 'token'> | null {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) return null;

  try {
    const user = jwt.verify(token, JWT_SECRET) as Omit<User, 'token'> & {
      iat: number;
      exp: number;
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      dni: user.dni,
      role: user.role,
      status: user.status,
    };
  } catch (err) {
    return null;
  }
}

export async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
}
