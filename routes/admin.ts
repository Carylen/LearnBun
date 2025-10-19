// routes/admin.ts
import { Elysia, t } from 'elysia';
import { createAdminToken } from '../middleware/auth';
import { registerAdmin, validateAdminCredentials, getAllSubmissions } from '../services/adminService';
import { adminGuard } from '../middleware/auth';

const adminRoutes = new Elysia({ prefix: '/api/admin' });

// Register (hanya jika belum ada admin)
adminRoutes.post('/register', async ({ body }) => {
  try {
    await registerAdmin(body.email, body.password);
    return { success: true, message: 'Admin berhasil didaftarkan!' };
  } catch (err: any) {
    if (err.message === 'Admin already exists') {
      return new Response('Admin sudah terdaftar. Registrasi ditutup.', { status: 403 });
    }
    throw err;
  }
}, {
  body: t.Object ({
    email: t.String ({ format: 'email' }),
    password: t.String ({ minLength: 6 })
  })
});

// Login
adminRoutes.post('/login', async ({ body }) => {
  const admin = await validateAdminCredentials(body.email, body.password);
  if (!admin) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = await createAdminToken(admin.id);
  return { success: true, token };
}, {
  body: t.Object ({
    email: t.String ({ format: 'email' }),
    password: t.String ({ minLength: 6 })
  })
});

// Data terproteksi
adminRoutes.get('/submissions', () => {
  console.log('🚀 Handler /submissions DIPANGGIL!');
  const submissions = getAllSubmissions();
  console.log('✅ Handler dipanggil!');
  // return { 
  //   success: true,
  //   message: 'Hardcode test berhasil!',
  //   submissions: [{ id: 999, name: 'Test User' }]
  // };
  return { submissions };
});

adminRoutes.get('/test', () => {
  console.log('✅ RUTE TEST DIPANGGIL!');
  return { message: 'Test berhasil!' };
},{
  beforeHandle: adminGuard
});
export default adminRoutes;