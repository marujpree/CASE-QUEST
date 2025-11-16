const pool = require('../config/database');

/**
 * Migration to add priority column to events table
 */
const addPriorityToEvents = async () => {
  try {
    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='events' AND column_name='priority'
    `);

    if (checkColumn.rows.length === 0) {
      // Add priority column
      await pool.query(`
        ALTER TABLE events 
        ADD COLUMN priority VARCHAR(50) DEFAULT 'medium'
      `);
      console.log('✓ Added priority column to events table');
    } else {
      console.log('✓ Priority column already exists in events table');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error adding priority column:', error);
    process.exit(1);
  }
};

addPriorityToEvents();
