const pool = require('../config/database');

class FlashcardSet {
  static async findAll(userId) {
    const result = await pool.query(
      `SELECT flashcard_sets.*, classes.name as class_name,
       (SELECT COUNT(*) FROM flashcards WHERE flashcard_set_id = flashcard_sets.id) as card_count
       FROM flashcard_sets
       LEFT JOIN classes ON flashcard_sets.class_id = classes.id
       WHERE flashcard_sets.user_id = $1
       ORDER BY flashcard_sets.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT flashcard_sets.*, classes.name as class_name 
       FROM flashcard_sets 
       LEFT JOIN classes ON flashcard_sets.class_id = classes.id
       WHERE flashcard_sets.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(userId, classId, title, description) {
    const result = await pool.query(
      'INSERT INTO flashcard_sets (user_id, class_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, classId, title, description]
    );
    return result.rows[0];
  }

  static async update(id, title, description) {
    const result = await pool.query(
      'UPDATE flashcard_sets SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM flashcard_sets WHERE id = $1', [id]);
  }
}

module.exports = FlashcardSet;
