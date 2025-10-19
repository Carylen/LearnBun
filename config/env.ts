// config/env.ts
export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretkey123'
);

export const PORT = Number(process.env.PORT) || 3000;