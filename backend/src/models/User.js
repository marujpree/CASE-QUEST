const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async findAll() {
    const result = await pool.query('SELECT id, email, name, created_at, updated_at FROM users ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(email, name) {
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name, created_at, updated_at',
      [email, name]
    );
    return result.rows[0];
  }

  static async createWithPassword(email, name, password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at, updated_at',
      [email, name, passwordHash]
    );
    return result.rows[0];
  }

  static async verifyPassword(user, password) {
    if (!user || !user.password_hash) {
      return false;
    }
    return await bcrypt.compare(password, user.password_hash);
  }

  static async update(id, email, name) {
    const result = await pool.query(
      'UPDATE users SET email = $1, name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name, created_at, updated_at',
      [email, name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = User;
