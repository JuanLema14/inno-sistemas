import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { User } from '@/services/auth.service';
import Cookies from "js-cookie";

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
    console.error('Error al verificar el token:', err);
    return null;
  }
}

export function logout() {
  Cookies.remove("token");
  window.location.href = "/";
}