// middleware/auth.ts
import { jwtVerify, SignJWT } from 'jose';
import { JWT_SECRET } from '../config/env';

// Buat token
export async function createAdminToken(adminId: number) {
  return await new SignJWT({ id: adminId, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verifikasi token dari header
export async function verifyToken(authHeader?: string) {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.substring(7);
  const { payload } = await jwtVerify(token, JWT_SECRET);
  console.log(`SUCCESS VERIFY JWT WITH PAYLOAD - ${payload.role}`)
  if (payload.role !== 'admin') throw new Error('Forbidden');
  return payload;
}

// Middleware Elysia
// export const adminGuard = async ({ headers }) => {
//     const authHeader = headers.authorization;
//     // 1. Check Header
//     if (!authHeader) {
//         return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//         });
//     }
//     console.log(`HEADERS NOT EMPTY - ${authHeader}`)
//   try {
//     await verifyToken(authHeader || '');
//     console.log('FINISHED VERIFY')
//     return undefined;
//   } catch {
//     return new Response('Unauthorized', { status: 401 });
//   }
// };

export const adminGuard = ({ headers }: { headers: Record<string, string | undefined> }) => {
  const authHeader = headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: missing or invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.substring(7);

  // Kembalikan promise verifikasi langsung
  return jwtVerify(token, JWT_SECRET)
    .then(({ payload }) => {
      if (payload.role !== 'admin') {
        throw new Error('Forbidden');
      }
      // Jika sampai sini, jangan return apa-apa → lanjut ke handler
      console.log("SUCCESS VERIFY")
    })
    .catch((err) => {
      console.error('🔐 Auth failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    });
};