# AI Flashcard Generation Setup Guide

## Overview
Your Classify app now has AI-powered flashcard generation using Claude 3.5 Sonnet (via Anthropic API).

## Setup Steps

### 1. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for an Anthropic account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

### 2. Set Up Environment Variables

In your backend root directory, create or update your `.env` file:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=sk-ant-your_api_key_here
```

### 3. Install Dependencies

The OpenAI package (which works with Claude via compatibility layer) is already in package.json. Install it:

```bash
cd backend
npm install
```

### 4. How It Works

The flashcard generation now has two modes:

**Mode 1: Generate from Notes**
- Users paste their study notes
- Claude analyzes the content and creates relevant question-answer pairs
- Perfect for exam prep

**Mode 2: Generate from Topic**
- Users just enter a topic name
- Claude generates comprehensive educational flashcards about that topic
- Great for general studying

### 5. Frontend Integration

The Dashboard already has the form set up for flashcard generation:
- Input field for topic name
- Textarea for pasting notes
- "Generate Flashcards" button
- Will create 10 flashcards by default

### 6. API Endpoint

```bash
POST /flashcard-sets/generate
```

Request body:
```json
{
  "userId": "user_id",
  "classId": "optional_class_id",
  "topic": "Psychology 101",
  "notes": "optional notes text",
  "count": 10,
  "title": "optional custom title",
  "description": "optional description"
}
```

Response:
```json
{
  "message": "Flashcards generated successfully",
  "set": { "id": "...", "title": "..." },
  "flashcards": [
    {
      "id": "...",
      "question": "...",
      "answer": "...",
      "difficulty": "easy|medium|hard"
    }
  ]
}
```

### 7. Fallback Behavior

If the API key is not set or the API fails, the app will:
- Fall back to simple pattern-based generation
- Still create flashcards (just less intelligent)
- No user-facing errors

### 8. Testing

Test the flashcard generation:

1. Start the backend:
   ```bash
   npm run dev
   ```

2. Log in to the app

3. Go to Dashboard

4. In the "Create Flashcards" section:
   - Enter a topic like "Photosynthesis"
   - Or paste study notes
   - Click "Generate Flashcards"

5. The AI will create 10 educational flashcards

## Pricing

Anthropic Claude 3.5 Sonnet pricing:
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

Generating 10 flashcards typically costs $0.01-0.05

## Troubleshooting

**Issue: "Error generating flashcards"**
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify the API key is valid
- Check API usage limits on Anthropic console

**Issue: Flashcards are generic/not AI-generated**
- The app is using fallback generation (API key might be missing)
- Check backend logs for errors
- Ensure `.env` is properly configured

**Issue: Rate limiting**
- Anthropic has rate limits on free tier
- Upgrade your account for higher limits
- Add small delays between requests if needed

## Next Steps

1. Deploy backend with `OPENAI_API_KEY` env var
2. Update frontend to show loading state while generating
3. Add ability to regenerate flashcards
4. Add difficulty filter to flashcard review
5. Track generation statistics

