/**
 * Utility functions to parse and detect important class updates from email content
 */

const alertKeywords = {
  cancellation: ['class cancelled', 'class canceled', 'no class', 'cancelled class', 'canceled class', 'will not meet'],
  exam_change: ['exam moved', 'exam rescheduled', 'test moved', 'test rescheduled', 'quiz moved', 'midterm', 'final exam'],
  extra_credit: ['extra credit', 'bonus points', 'bonus opportunity', 'additional credit'],
  assignment: ['assignment due', 'homework due', 'project due', 'deadline'],
  schedule_change: ['room change', 'time change', 'location change', 'schedule change']
};

/**
 * Detect alert type from email content
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {string|null} - Alert type or null if no match
 */
function detectAlertType(subject, body) {
  const content = `${subject} ${body}`.toLowerCase();

  for (const [type, keywords] of Object.entries(alertKeywords)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        return type;
      }
    }
  }

  return null;
}

/**
 * Extract class-related information from email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {object} - Extracted information
 */
function extractClassInfo(subject, body) {
  const type = detectAlertType(subject, body);
  
  if (!type) {
    return null;
  }

  // Generate title based on type
  let title = 'Class Update';
  switch (type) {
    case 'cancellation':
      title = 'Class Cancelled';
      break;
    case 'exam_change':
      title = 'Exam Schedule Change';
      break;
    case 'extra_credit':
      title = 'Extra Credit Opportunity';
      break;
    case 'assignment':
      title = 'Assignment Update';
      break;
    case 'schedule_change':
      title = 'Schedule Change';
      break;
  }

  return {
    type,
    title,
    message: body.substring(0, 500) // Limit message length
  };
}

/**
 * Calculate urgency based on alert type
 * @param {string} type - Alert type
 * @returns {string} - Urgency level (high, medium, low)
 */
function calculateUrgency(type) {
  switch (type) {
    case 'cancellation':
    case 'exam_change':
      return 'high';
    case 'extra_credit':
    case 'assignment':
      return 'medium';
    case 'schedule_change':
      return 'low';
    default:
      return 'medium';
  }
}

/**
 * Process incoming email and create alert if relevant
 * @param {string} from - Email sender
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {object|null} - Alert data or null
 */
function processEmail(from, subject, body) {
  const classInfo = extractClassInfo(subject, body);
  
  if (!classInfo) {
    return null;
  }

  const urgency = calculateUrgency(classInfo.type);

  return {
    type: classInfo.type,
    title: classInfo.title,
    message: classInfo.message,
    urgency: urgency,
    emailSubject: subject,
    emailFrom: from
  };
}

module.exports = {
  detectAlertType,
  extractClassInfo,
  processEmail,
  calculateUrgency
};
