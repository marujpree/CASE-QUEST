const pool = require('../config/database');

class Event {
  static async findById(id) {
    const res = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async findAllByUser(userId, from = null, to = null) {
    const params = [userId];
    let where = 'user_id = $1';
    if (from) {
      params.push(from);
      where += ` AND start_time >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      where += ` AND start_time <= $${params.length}`;
    }
    const res = await pool.query(
      `SELECT * FROM events WHERE ${where} ORDER BY start_time ASC`,
      params
    );
    return res.rows;
  }

  static async create({ userId, title, description, location, startTime, endTime, allDay = false, source = 'manual', priority = 'medium' }) {
    const res = await pool.query(
      `INSERT INTO events (user_id, title, description, location, start_time, end_time, all_day, source, priority)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [userId, title, description || null, location || null, startTime, endTime || null, allDay, source, priority]
    );
    return res.rows[0];
  }

  static async update(id, { title, description, location, startTime, endTime, allDay }) {
    const res = await pool.query(
      `UPDATE events SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         location = COALESCE($3, location),
         start_time = COALESCE($4, start_time),
         end_time = COALESCE($5, end_time),
         all_day = COALESCE($6, all_day),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, description, location, startTime, endTime, allDay, id]
    );
    return res.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
  }
}

module.exports = Event;
