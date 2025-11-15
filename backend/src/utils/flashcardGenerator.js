/**
 * Utility functions to generate AI-style flashcards from content
 * This is a simplified version that generates flashcards based on patterns
 * In production, this would integrate with an AI API like OpenAI
 */

/**
 * Generate flashcards from text content
 * @param {string} content - Text content to generate flashcards from
 * @param {number} count - Number of flashcards to generate
 * @returns {Array} - Array of flashcard objects
 */
function generateFlashcards(content, count = 5) {
  const flashcards = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

  // Simple algorithm: convert statements to questions
  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    const sentence = sentences[i].trim();
    
    // Create question-answer pairs
    const flashcard = createFlashcardFromSentence(sentence);
    if (flashcard) {
      flashcards.push(flashcard);
    }
  }

  return flashcards;
}

/**
 * Create a flashcard from a sentence
 * @param {string} sentence - Input sentence
 * @returns {object|null} - Flashcard object or null
 */
function createFlashcardFromSentence(sentence) {
  if (!sentence || sentence.length < 20) {
    return null;
  }

  // Simple pattern: turn statements into questions
  let question = sentence;
  let answer = sentence;

  // Pattern 1: "X is Y" -> "What is X?"
  const isPattern = sentence.match(/^(.+?)\s+is\s+(.+)$/i);
  if (isPattern) {
    question = `What is ${isPattern[1].trim()}?`;
    answer = isPattern[2].trim();
  }
  // Pattern 2: "X are Y" -> "What are X?"
  else if (sentence.match(/^(.+?)\s+are\s+(.+)$/i)) {
    const match = sentence.match(/^(.+?)\s+are\s+(.+)$/i);
    question = `What are ${match[1].trim()}?`;
    answer = match[2].trim();
  }
  // Pattern 3: Generic question formation
  else {
    question = `What do you know about: ${sentence.substring(0, 50)}...?`;
    answer = sentence;
  }

  return {
    question: question,
    answer: answer,
    difficulty: determineDifficulty(sentence)
  };
}

/**
 * Determine difficulty based on sentence complexity
 * @param {string} sentence - Input sentence
 * @returns {string} - Difficulty level
 */
function determineDifficulty(sentence) {
  const wordCount = sentence.split(/\s+/).length;
  
  if (wordCount < 10) {
    return 'easy';
  } else if (wordCount < 20) {
    return 'medium';
  } else {
    return 'hard';
  }
}

/**
 * Generate flashcards for a specific topic
 * @param {string} topic - Topic name
 * @param {number} count - Number of flashcards
 * @returns {Array} - Array of flashcard objects
 */
function generateFlashcardsByTopic(topic, count = 5) {
  // This is a simplified version
  // In production, this would call an AI API to generate relevant flashcards
  
  const templates = [
    {
      question: `Define ${topic}`,
      answer: `${topic} is a key concept in this subject area.`,
      difficulty: 'easy'
    },
    {
      question: `What are the main characteristics of ${topic}?`,
      answer: `The main characteristics include various important features.`,
      difficulty: 'medium'
    },
    {
      question: `How does ${topic} relate to other concepts?`,
      answer: `${topic} connects to multiple related concepts in the field.`,
      difficulty: 'hard'
    },
    {
      question: `Why is ${topic} important?`,
      answer: `${topic} is important because it forms a fundamental part of understanding.`,
      difficulty: 'medium'
    },
    {
      question: `Give an example of ${topic}`,
      answer: `An example of ${topic} would demonstrate its practical application.`,
      difficulty: 'easy'
    }
  ];

  return templates.slice(0, count);
}

module.exports = {
  generateFlashcards,
  generateFlashcardsByTopic,
  createFlashcardFromSentence,
  determineDifficulty
};
