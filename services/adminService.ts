// services/adminService.ts
import * as bcrypt from 'bcrypt';
import { db } from '../databases/db';

export async function registerAdmin(email: string, password: string) {
  const existing = db.query('SELECT email FROM admins WHERE email = ? LIMIT 1').get(email);
  console.log(existing)
  if (existing) {
    throw new Error('Admin already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO admins (email, password_hash) VALUES (?, ?)', email, passwordHash);
}

export async function validateAdminCredentials(email: string, password: string) {
  const admin = db.query('SELECT id, password_hash FROM admins WHERE email = ?').get(email);
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password_hash);
  return isValid ? { id: admin.id } : null;
}

export function getAllSubmissions() {
    try {
        console.log("PROCESS THE QUERY....")
        const result = db.query(`SELECT id, name, email, phone, created_at FROM submissions ORDER BY created_at DESC`).all();
        // result = {"submissions": [{ "id": 1, "name": 'Test' }]}
        console.log(`RESULT QUERY - ${result}`)
        return result
    } catch (error) {
        console.error(`ERROR WHILE QUERY TO DB : ${error}`);
        throw error;
    }
}