const pool = require('../config/database');
const Alert = require('../models/Alert');

/**
 * Check for upcoming events and create reminder alerts
 * This function should be called periodically (e.g., every hour)
 */
async function checkUpcomingEvents() {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Find events happening in the next 24 hours
    const result = await pool.query(
      `SELECT e.*, u.id as user_id 
       FROM events e
       JOIN users u ON e.user_id = u.id
       WHERE e.start_time BETWEEN $1 AND $2
       AND e.start_time > $1
       ORDER BY e.start_time ASC`,
      [now, tomorrow]
    );
    
    const events = result.rows;
    
    for (const event of events) {
      // Check if we already created an alert for this event
      const existingAlert = await pool.query(
        `SELECT id FROM alerts 
         WHERE user_id = $1 
         AND type = 'event_reminder'
         AND message LIKE $2
         AND detected_at > $3`,
        [event.user_id, `%${event.title}%`, new Date(now.getTime() - 48 * 60 * 60 * 1000)]
      );
      
      if (existingAlert.rows.length === 0) {
        // Create reminder alert
        const eventTime = new Date(event.start_time);
        const hoursUntil = Math.round((eventTime - now) / (1000 * 60 * 60));
        
        let timeDescription = '';
        if (hoursUntil < 1) {
          const minutesUntil = Math.round((eventTime - now) / (1000 * 60));
          timeDescription = `in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`;
        } else if (hoursUntil === 1) {
          timeDescription = 'in 1 hour';
        } else {
          timeDescription = `in ${hoursUntil} hours`;
        }
        
        await Alert.create(
          event.user_id,
          null,
          'event_reminder',
          `Reminder: ${event.title}`,
          `Your event "${event.title}" is scheduled ${timeDescription} at ${eventTime.toLocaleString()}${event.location ? ` at ${event.location}` : ''}.`,
          null,
          'System',
          hoursUntil <= 2 ? 'high' : 'medium'
        );
        
        console.log(`Created reminder alert for event: ${event.title} (User: ${event.user_id})`);
      }
    }
    
    console.log(`Event reminder check completed. Checked ${events.length} upcoming events.`);
  } catch (error) {
    console.error('Error checking upcoming events:', error);
  }
}

/**
 * Start the event reminder service
 * Checks every hour for upcoming events
 */
function startEventReminderService() {
  // Run immediately on startup
  checkUpcomingEvents();
  
  // Then run every hour
  const HOUR_IN_MS = 60 * 60 * 1000;
  setInterval(checkUpcomingEvents, HOUR_IN_MS);
  
  console.log('Event reminder service started (checking every hour)');
}

module.exports = {
  checkUpcomingEvents,
  startEventReminderService
};
