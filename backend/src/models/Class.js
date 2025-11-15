const pool = require('../config/database');

class Class {
  static async findAll(userId) {
    const result = await pool.query(
      'SELECT * FROM classes WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(userId, name, code, description, instructor) {
    const result = await pool.query(
      'INSERT INTO classes (user_id, name, code, description, instructor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, code, description, instructor]
    );
    return result.rows[0];
  }

  static async update(id, name, code, description, instructor) {
    const result = await pool.query(
      'UPDATE classes SET name = $1, code = $2, description = $3, instructor = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, code, description, instructor, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
  }
}

module.exports = Class;
