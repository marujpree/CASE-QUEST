# N8N Integration Guide for Classify

## Overview
This guide shows how to integrate your n8n email workflow with the Classify application so that parsed emails automatically create alerts and assignments.

## N8N Workflow Setup

Your n8n workflow:
1. **Monitors Gmail** for incoming emails every minute
2. **Uses Google Gemini AI** to parse email content
3. **Sends data to Classify** webhook endpoint

## Configuration Steps

### 1. Add HTTP Request Node to N8N Workflow

Instead of using the "Add Assignment to Google Sheets" node as the final step, replace it with an HTTP Request node:

**In n8n Editor:**
1. Click **"+"** to add a new node after the AI Agent
2. Search for **"HTTP Request"**
3. Click it to add

### 2. Configure HTTP Request Node

Set the following parameters:

| Setting | Value |
|---------|-------|
| **Method** | POST |
| **URL** | `https://case-quest-production.up.railway.app/api/webhook/n8n` |
| **Authentication** | None |
| **Send Headers** | No |
| **Send Query Parameters** | No |

### 3. Add Request Body

In the "Body" tab, set **Body Type** to `JSON` and add this payload:

```json
{
  "userId": 1,
  "classId": null,
  "summary": "{{ $fromAI('summary', 'Event title or summary', 'string') }}",
  "description": "{{ $fromAI('description', 'Event description with details', 'string') }}",
  "startTime": "{{ $fromAI('startTime', 'Event start in ISO format YYYY-MM-DDTHH:MM:SS', 'string') }}",
  "endTime": "{{ $fromAI('endTime', 'Event end in ISO format YYYY-MM-DDTHH:MM:SS', 'string') }}",
  "assignment": "{{ $fromAI('assignment', 'Assignment name', 'string') }}",
  "type": "{{ $fromAI('type', 'Assignment type: homework, quiz, exam, extra credit, project, discussion', 'string') }}",
  "dueDate": "{{ $fromAI('dueDate', 'Due date in MM/DD/YYYY format', 'string') }}",
  "time": "{{ $fromAI('time', 'Due time if specified', 'string') }}"
}
```

### 4. Connect AI Agent to HTTP Request

In your workflow connections:
- Connect the **Gmail Trigger** → **AI Agent**
- Connect the **AI Agent** → **HTTP Request node**
- Remove the Google Sheets and Google Calendar connections (optional - you can keep them)

### 5. Update AI Agent System Message

Update your AI Agent's system message to instruct it to format dates properly:

```
You are an academic calendar assistant that processes important email updates.

Your task is to:
1. Analyze the email to identify academic updates (cancellations, exam changes, deadlines, etc.)
2. Extract: event title, description, dates, times, assignment name, type, class name
3. Format dates as ISO 8601 (YYYY-MM-DDTHH:MM:SS) or MM/DD/YYYY
4. If no specific time mentioned, default to 09:00:00
5. For assignment type, use: homework, quiz, exam, extra credit, project, discussion
6. Return structured data for the webhook

Important: Ensure all dates are properly formatted!
```

### 6. Test the Integration

1. **Test Email**: Send a test email to your monitored Gmail with content like:
   ```
   Subject: CS 101 - Quiz moved to Friday 2pm
   Body: The quiz scheduled for Thursday has been moved to Friday at 2:00 PM in Room 205
   ```

2. **Run Workflow**: In n8n, click **"Execute Workflow"**

3. **Check Classify**: Log into https://case-quest-dp5o.vercel.app and check the Alerts page - you should see the parsed alert!

## What Happens

When an email is processed:

1. **n8n receives it** from Gmail
2. **AI parses it** using Google Gemini
3. **HTTP POST sent** to Classify webhook with extracted data
4. **Classify creates alert** in database
5. **Students see it** in their dashboard

## Troubleshooting

**Webhook not working?**
- Check URL is correct: `https://case-quest-production.up.railway.app/api/webhook/n8n`
- Make sure Railway deployment is running
- Check n8n logs for HTTP errors

**Data not showing in Classify?**
- Verify `userId` is `1` or match your actual user ID
- Check the Classify alerts page (refresh browser)
- Check Railway logs for database errors

**Dates not parsing correctly?**
- Make sure AI Agent formats dates as ISO 8601
- Test with explicit dates: "Friday, November 15, 2024 at 2:00 PM"

## API Response

Your webhook endpoint returns:
```json
{
  "message": "N8N webhook processed successfully",
  "alert": { alert object created },
  "flashcardSet": { 
    "set": { flashcard set object },
    "flashcard": { flashcard object }
  }
}
```

## Advanced: Multiple Users

Currently using `userId: 1`. To support multiple users:
1. Create separate n8n workflows per user
2. Or modify the webhook to look up user by email
3. Update the n8n payload with the correct userId

That's it! Your n8n workflow is now integrated with Classify! 🎉
