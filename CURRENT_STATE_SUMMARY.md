# CampusSync - Current State Summary

## Repository Structure Overview

### Backend (Node.js + Express)
**Location:** `backend/`

**Structure:**
- `src/server.js` - Express server setup with CORS, body-parser, route mounting
- `src/config/` - Database configuration and initialization
  - `database.js` - PostgreSQL connection pool
  - `initDb.js` - Database schema creation (users, classes, alerts, flashcard_sets, flashcards)
- `src/models/` - Database models (User, Class, Alert, FlashcardSet, Flashcard)
- `src/routes/` - API route handlers
  - `users.js` - User CRUD operations
  - `classes.js` - Class management
  - `alerts.js` - Alert management with `/process-email` endpoint
  - `flashcardSets.js` - Flashcard set management with `/generate` endpoint
  - `flashcards.js` - Individual flashcard operations
- `src/utils/` - Utility functions
  - `emailParser.js` - Email parsing and alert detection (pattern matching)
  - `flashcardGenerator.js` - Mock AI flashcard generation (template-based)

**Current API Endpoints:**
- `/api/users` - User management
- `/api/classes` - Class management
- `/api/alerts` - Alert management
  - `POST /api/alerts/process-email` - Process email and create alert
- `/api/flashcard-sets` - Flashcard set management
  - `POST /api/flashcard-sets/generate` - Generate flashcards with AI
- `/api/flashcards` - Individual flashcard operations

**Database Schema:**
- `users` - id, email, name, created_at, updated_at
- `classes` - id, user_id, name, code, description, instructor, created_at, updated_at
- `alerts` - id, user_id, class_id, type, title, message, email_subject, email_from, detected_at, is_read, created_at
- `flashcard_sets` - id, user_id, class_id, title, description, created_at, updated_at
- `flashcards` - id, flashcard_set_id, question, answer, difficulty, created_at, updated_at

**Dependencies:**
- express, pg, cors, dotenv, body-parser, nodemon

### Frontend (React SPA)
**Location:** `frontend/`

**Structure:**
- `src/App.js` - Main app component with routing and demo user initialization
- `src/pages/` - Page components
  - `Dashboard.js` - Overview with stats and recent alerts
  - `Alerts.js` - Alerts list with filtering and email simulator
  - `Classes.js` - Class management
  - `Flashcards.js` - Flashcard set management and study mode
- `src/components/` - Reusable components
  - `AlertCard.js` - Alert display card
  - `ClassCard.js` - Class display card
  - `ClassForm.js` - Class creation form
  - `EmailSimulator.js` - Email input simulator for testing
  - `FlashcardSetCard.js` - Flashcard set display
  - `FlashcardSetForm.js` - Flashcard set creation form
  - `FlashcardViewer.js` - Interactive flashcard study viewer
- `src/services/api.js` - Axios API client configuration

**Current Features:**
- Dashboard with statistics
- Alerts page with filtering (all/unread/read) and "Mark as read" functionality
- Classes page with CRUD operations
- Flashcards page with AI generation and study mode
- Email simulator for testing alert detection

**Dependencies:**
- react, react-dom, react-router-dom, axios, react-scripts

### Root Level
- `package.json` - Root scripts for running both backend and frontend
- Documentation files: `README.md`, `ARCHITECTURE.md`, `SETUP.md`, `TESTING.md`

## What's Already Implemented ✅

1. **Database Schema** - All tables created with proper relationships
2. **Backend API** - RESTful API with all CRUD operations
3. **Email Processing** - Pattern-based email parsing and alert detection
4. **Flashcard Generation** - Mock AI generation using templates
5. **Frontend Pages** - All main pages (Dashboard, Alerts, Classes, Flashcards)
6. **UI Components** - Reusable components for cards, forms, viewers
7. **Basic Routing** - React Router setup
8. **API Integration** - Frontend calling backend API

## What's Missing ❌

1. **Authentication System**
   - No JWT or session-based auth
   - Currently uses a hardcoded demo user
   - No signup/login pages
   - No password hashing or user authentication

2. **Endpoint Alignment**
   - Email webhook: Currently `/api/alerts/process-email`, needs `/api/webhook/email`
   - Flashcard generation: Currently `/api/flashcard-sets/generate`, needs `/api/flashcards/generate`

3. **Alert Features**
   - Missing "urgency" field in alerts table and UI
   - No urgency calculation based on alert type

4. **Flashcard Review Tracking**
   - No storage for review status ("I got it", "I forgot")
   - FlashcardViewer has buttons but no persistence
   - Need to add review tracking fields to database

5. **App Naming**
   - Currently called "ScholarSync" throughout
   - Needs to be renamed to "CampusSync"

6. **Flashcard Study Features**
   - "I got it" / "I forgot" buttons exist but don't save state
   - No review history or spaced repetition data

## Current App Name
The application is currently named **"ScholarSync"** but should be **"CampusSync"** per requirements.

