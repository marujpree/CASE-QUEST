const { OpenAI } = require('openai');

let openai = null;
const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return openai;
}

function sanitizeLLMJSON(text) {
  if (!text) return text;
  let s = String(text).trim();
  s = s.replace(/```\w*\s*[\s\S]*?```/g, m => m.replace(/```\w*\s*|```/g, ''));
  s = s.replace(/```/g, '');
  s = s.replace(/^json\s*/i, '');
  s = s.replace(/`+/g, '');
  s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  const arrayMatch = s.match(/\[[\s\S]*\]/);
  if (arrayMatch) s = arrayMatch[0];
  s = s.replace(/,\s*([}\]])/g, '$1');
  return s.trim();
}

/**
 * Generate flashcards from text content using OpenAI GPT
 * @param {string} content - Text content to generate flashcards from
 * @param {number} count - Number of flashcards to generate
 * @returns {Array} - Array of flashcard objects
 */
async function generateFlashcards(content, count = 10) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not set, using fallback generator');
    return generateFlashcardsFallback(content, count);
  }

  try {
    const prompt = `Generate exactly ${count} flashcards (question-answer pairs) from the following study notes. 
    
    Format each flashcard as JSON in this exact format:
    {"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}
    
    Return ONLY a valid JSON array, nothing else. No markdown, no code blocks, just pure JSON.
    
    Study Notes:
    ${content}`;

    const message = await getOpenAIClient().chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful educational assistant that creates flashcards. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Parse the response
    let responseText = message.choices[0].message.content || '';
    console.log('OpenAI Response:', responseText);
    const jsonSlice = sanitizeLLMJSON(responseText);
    let flashcards;
    try {
      flashcards = JSON.parse(jsonSlice);
    } catch (parseErr) {
      const pairs = [...responseText.matchAll(/\"question\"\s*:\s*\"([\s\S]*?)\"[\s\S]*?\"answer\"\s*:\s*\"([\s\S]*?)\"/g)].map(m => ({
        question: m[1].trim(),
        answer: m[2].trim(),
        difficulty: 'medium'
      }));
      if (pairs.length) {
        flashcards = pairs;
      } else {
        throw parseErr;
      }
    }
    
    return Array.isArray(flashcards) ? flashcards.slice(0, count) : [];
  } catch (error) {
    console.error('Error generating flashcards with OpenAI:', error);
    // Surface quota/auth errors so the caller can inform the user
    if (error && (error.code === 'insufficient_quota' || error.status === 429)) {
      const err = new Error('OpenAI quota exceeded. Please check plan/billing.');
      err.status = 429;
      throw err;
    }
    if (error && (error.code === 'invalid_api_key' || error.status === 401)) {
      const err = new Error('Invalid OpenAI API key.');
      err.status = 401;
      throw err;
    }
    // Fallback to simple generation for other transient errors
    return generateFlashcardsFallback(content, count);
  }
}

/**
 * Generate flashcards from a topic using OpenAI GPT
 * @param {string} topic - Topic name
 * @param {number} count - Number of flashcards
 * @returns {Array} - Array of flashcard objects
 */
async function generateFlashcardsByTopic(topic, count = 10) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not set, using fallback generator');
    return generateFlashcardsByTopicFallback(topic, count);
  }

  try {
    const prompt = `You are an expert educator. Generate exactly ${count} educational flashcards about "${topic}".
    
    Format each flashcard as JSON in this exact format:
    {"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}
    
    Create questions that test understanding and retention.
    Vary difficulty levels appropriately.
    Return ONLY a valid JSON array, nothing else. No markdown, no code blocks, just pure JSON.`;

    const message = await getOpenAIClient().chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful educational assistant that creates flashcards. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Parse the response
    let responseText = message.choices[0].message.content || '';
    console.log('OpenAI Response:', responseText);
    const jsonSlice2 = sanitizeLLMJSON(responseText);
    let flashcards;
    try {
      flashcards = JSON.parse(jsonSlice2);
    } catch (parseErr) {
      const pairs = [...responseText.matchAll(/\"question\"\s*:\s*\"([\s\S]*?)\"[\s\S]*?\"answer\"\s*:\s*\"([\s\S]*?)\"/g)].map(m => ({
        question: m[1].trim(),
        answer: m[2].trim(),
        difficulty: 'medium'
      }));
      if (pairs.length) {
        flashcards = pairs;
      } else {
        throw parseErr;
      }
    }
    
    return Array.isArray(flashcards) ? flashcards.slice(0, count) : [];
  } catch (error) {
    console.error('Error generating flashcards with OpenAI:', error);
    // Surface quota/auth errors so the caller can inform the user
    if (error && (error.code === 'insufficient_quota' || error.status === 429)) {
      const err = new Error('OpenAI quota exceeded. Please check plan/billing.');
      err.status = 429;
      throw err;
    }
    if (error && (error.code === 'invalid_api_key' || error.status === 401)) {
      const err = new Error('Invalid OpenAI API key.');
      err.status = 401;
      throw err;
    }
    // Fallback to simple generation for other transient errors
    return generateFlashcardsByTopicFallback(topic, count);
  }
}

/**
 * Fallback generator when OpenAI is unavailable
 */
function generateFlashcardsFallback(content, count = 5) {
  const flashcards = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    const sentence = sentences[i].trim();
    const flashcard = createFlashcardFromSentence(sentence);
    if (flashcard) {
      flashcards.push(flashcard);
    }
  }

  return flashcards;
}

/**
 * Fallback topic-based generator
 */
function generateFlashcardsByTopicFallback(topic, count = 5) {
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

/**
 * Create a flashcard from a sentence
 */
function createFlashcardFromSentence(sentence) {
  if (!sentence || sentence.length < 20) {
    return null;
  }

  let question = sentence;
  let answer = sentence;

  const isPattern = sentence.match(/^(.+?)\s+is\s+(.+)$/i);
  if (isPattern) {
    question = `What is ${isPattern[1].trim()}?`;
    answer = isPattern[2].trim();
  } else if (sentence.match(/^(.+?)\s+are\s+(.+)$/i)) {
    const match = sentence.match(/^(.+?)\s+are\s+(.+)$/i);
    question = `What are ${match[1].trim()}?`;
    answer = match[2].trim();
  } else {
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

module.exports = {
  generateFlashcards,
  generateFlashcardsByTopic,
  createFlashcardFromSentence,
  determineDifficulty
};
