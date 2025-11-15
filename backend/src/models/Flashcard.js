const pool = require('../config/database');

class Flashcard {
  static async findBySetId(setId) {
    const result = await pool.query(
      'SELECT * FROM flashcards WHERE flashcard_set_id = $1 ORDER BY id',
      [setId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM flashcards WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(flashcardSetId, question, answer, difficulty = 'medium') {
    const result = await pool.query(
      'INSERT INTO flashcards (flashcard_set_id, question, answer, difficulty) VALUES ($1, $2, $3, $4) RETURNING *',
      [flashcardSetId, question, answer, difficulty]
    );
    return result.rows[0];
  }

  static async update(id, question, answer, difficulty) {
    const result = await pool.query(
      'UPDATE flashcards SET question = $1, answer = $2, difficulty = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [question, answer, difficulty, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [id]);
  }
}

module.exports = Flashcard;
