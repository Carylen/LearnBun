// index.ts
import { Elysia } from 'elysia';
import { PORT } from './config/env.ts';
import publicRoutes from './routes/public.ts';
import adminRoutes from './routes/admin';

const app = new Elysia();

app.use(publicRoutes);
app.use(adminRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
  console.log(`🔓 POST /api/submit-profile`);
  console.log(`🔐 POST /api/admin/register`);
  console.log(`🔑 POST /api/admin/login`);
  console.log(`🔒 GET /api/admin/submissions`);
});