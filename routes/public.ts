// routes/public.ts
import { Elysia, t } from 'elysia';
import { db } from '../databases/db';

const publicRoutes = new Elysia({ prefix: '/api' });

// Submit data
publicRoutes.post('/submit-profile', ({ body }) => {
  const { name, email, phone } = body;
  db.run(
    'INSERT INTO submissions (name, email, phone) VALUES (?, ?, ?)',
    name, email, phone
  );
  return { success: true, message: `Terimakasih ${name}, data kamu berhasil dikirim!` };
}, {
  body: t.Object({
    name: t.String({ minLength: 1 }),
    email: t.String({ format: 'email' }),
    phone: t.String({ minLength: 6 })
  })
});

// // Lihat semua 
// publicRoutes.get('/submissions', () => {
//   const submissions = db.query(`
//     SELECT id, name, email, phone, created_at
//     FROM submissions
//     ORDER BY created_at DESC
//   `).all();
//   return { submissions };
// });

// // Lihat per ID
// publicRoutes.get('/submissions/:id', ({ params: { id } }) => {
//   const idNum = Number(id);
//   if (isNaN(idNum) || idNum <= 0) {
//     return new Response('Invalid ID', { status: 400 });
//   }

//   const submission = db.query(`
//     SELECT id, name, email, phone, created_at
//     FROM submissions
//     WHERE id = ?
//   `).get(idNum);

//   if (!submission) {
//     return new Response('Not found', { status: 404 });
//   }

//   return { submission };
// });

export default publicRoutes;