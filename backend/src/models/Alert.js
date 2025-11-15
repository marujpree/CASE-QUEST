const pool = require('../config/database');

class Alert {
  static async findAll(userId) {
    const result = await pool.query(
      `SELECT alerts.*, classes.name as class_name 
       FROM alerts 
       LEFT JOIN classes ON alerts.class_id = classes.id
       WHERE alerts.user_id = $1 
       ORDER BY alerts.detected_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT alerts.*, classes.name as class_name 
       FROM alerts 
       LEFT JOIN classes ON alerts.class_id = classes.id
       WHERE alerts.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(userId, classId, type, title, message, emailSubject, emailFrom) {
    const result = await pool.query(
      'INSERT INTO alerts (user_id, class_id, type, title, message, email_subject, email_from) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, classId, type, title, message, emailSubject, emailFrom]
    );
    return result.rows[0];
  }

  static async markAsRead(id) {
    const result = await pool.query(
      'UPDATE alerts SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM alerts WHERE id = $1', [id]);
  }
}

module.exports = Alert;
