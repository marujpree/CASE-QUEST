# CampusSync - Implementation Plan

## Overview
This document outlines the step-by-step plan to transform the existing ScholarSync codebase into CampusSync with all required features.

## Phase 1: Rename Application (ScholarSync → CampusSync)

### 1.1 Update Package Names and Metadata
- [ ] Update root `package.json` - change name from "scholarsync" to "campussync"
- [ ] Update `backend/package.json` - change name and description
- [ ] Update `frontend/package.json` - change name and description
- [ ] Update database name references (scholarsync → campussync)

### 1.2 Update UI Text and Branding
- [ ] Update `frontend/src/App.js` - change navbar brand from "ScholarSync" to "CampusSync"
- [ ] Update all page headers and titles
- [ ] Update README.md, ARCHITECTURE.md, SETUP.md with new name
- [ ] Update API welcome messages in `backend/src/server.js`

## Phase 2: Database Schema Updates

### 2.1 Add Urgency Field to Alerts
- [ ] Update `backend/src/config/initDb.js` - add `urgency VARCHAR(50)` column to alerts table
- [ ] Create migration script or update init script to add column to existing tables
- [ ] Update `backend/src/models/Alert.js` - include urgency in queries
- [ ] Update `backend/src/utils/emailParser.js` - calculate urgency based on alert type

### 2.2 Add Review Tracking to Flashcards
- [ ] Update `backend/src/config/initDb.js` - add review tracking fields:
  - `last_reviewed_at TIMESTAMP`
  - `review_status VARCHAR(50)` (e.g., 'not_reviewed', 'got_it', 'forgot')
  - `review_count INTEGER DEFAULT 0`
  - `mastery_score INTEGER DEFAULT 0` (0-100)
- [ ] Update `backend/src/models/Flashcard.js` - add methods for review tracking

## Phase 3: Backend API Updates

### 3.1 Add Email Webhook Endpoint
- [ ] Create `backend/src/routes/webhook.js` - new route file
- [ ] Add `POST /api/webhook/email` endpoint that:
  - Accepts JSON: `{subject, body, from, to}`
  - Calls emailParser to detect alerts
  - Creates alert if important update detected
  - Returns appropriate response
- [ ] Mount webhook routes in `backend/src/server.js`
- [ ] Keep existing `/api/alerts/process-email` for backward compatibility (or deprecate)

### 3.2 Add Flashcard Generation Endpoint
- [ ] Add `POST /api/flashcards/generate` endpoint in `backend/src/routes/flashcards.js`
- [ ] Accept: `{userId, classId, topic, notes, count}`
- [ ] Generate flashcards using `flashcardGenerator.generateFlashcardsByTopic()`
- [ ] Create flashcard set and flashcards
- [ ] Return set with flashcards
- [ ] Keep existing `/api/flashcard-sets/generate` for backward compatibility (or deprecate)

### 3.3 Update Alert Creation with Urgency
- [ ] Update `backend/src/utils/emailParser.js` - add urgency calculation:
  - `cancellation` → "high"
  - `exam_change` → "high"
  - `extra_credit` → "medium"
  - `assignment` → "medium"
  - `schedule_change` → "low"
- [ ] Update `backend/src/models/Alert.js` - include urgency in create method
- [ ] Update `backend/src/routes/alerts.js` - pass urgency when creating alerts

### 3.4 Add Flashcard Review Endpoints
- [ ] Add `PATCH /api/flashcards/:id/review` endpoint
- [ ] Accept: `{status: 'got_it' | 'forgot'}`
- [ ] Update flashcard review tracking in database
- [ ] Update mastery score based on review history

## Phase 4: Authentication Implementation

### 4.1 Install Auth Dependencies
- [ ] Add to `backend/package.json`:
  - `jsonwebtoken` - JWT token generation
  - `bcrypt` - Password hashing
- [ ] Run `npm install` in backend

### 4.2 Update User Model for Auth
- [ ] Update `backend/src/config/initDb.js` - add `password_hash VARCHAR(255)` to users table
- [ ] Update `backend/src/models/User.js`:
  - Add `createWithPassword(email, name, password)` method
  - Add `verifyPassword(userId, password)` method
  - Add `findByEmail(email)` method (already exists, verify it works)

### 4.3 Create Auth Routes
- [ ] Create `backend/src/routes/auth.js`:
  - `POST /api/auth/signup` - Create user with password
  - `POST /api/auth/login` - Authenticate and return JWT
  - `GET /api/auth/me` - Get current user from JWT
- [ ] Implement JWT token generation and verification
- [ ] Add password hashing with bcrypt

### 4.4 Create Auth Middleware
- [ ] Create `backend/src/middleware/auth.js`:
  - `authenticateToken` middleware to verify JWT
  - Extract user from token
  - Add user to request object
- [ ] Protect routes that require authentication

### 4.5 Update Protected Routes
- [ ] Add auth middleware to routes that need protection:
  - `/api/classes/*` (except maybe GET)
  - `/api/alerts/*` (except maybe GET)
  - `/api/flashcard-sets/*`
  - `/api/flashcards/*`
- [ ] Update routes to use `req.user.id` instead of `req.params.userId` where appropriate

## Phase 5: Frontend Authentication

### 5.1 Create Auth Context/Service
- [ ] Create `frontend/src/context/AuthContext.js` - React context for auth state
- [ ] Or create `frontend/src/services/auth.js` - Auth service with token storage
- [ ] Store JWT in localStorage
- [ ] Add methods: `login()`, `logout()`, `signup()`, `getCurrentUser()`

### 5.2 Create Auth Pages
- [ ] Create `frontend/src/pages/Login.js` - Login form
- [ ] Create `frontend/src/pages/Signup.js` - Signup form
- [ ] Add routing for `/login` and `/signup`

### 5.3 Update App.js for Auth
- [ ] Remove demo user initialization
- [ ] Add auth state management
- [ ] Add protected route wrapper
- [ ] Redirect to login if not authenticated
- [ ] Update navbar to show user info and logout button

### 5.4 Update API Service
- [ ] Update `frontend/src/services/api.js`:
  - Add JWT token to request headers
  - Handle 401 errors (redirect to login)
  - Add token refresh logic if needed

## Phase 6: Frontend Feature Updates

### 6.1 Update Alerts Page
- [ ] Update `frontend/src/components/AlertCard.js` - display urgency badge
- [ ] Update `frontend/src/pages/Alerts.js` - show urgency in alert list
- [ ] Add urgency-based sorting/filtering (optional)

### 6.2 Update Flashcard Study Mode
- [ ] Update `frontend/src/components/FlashcardViewer.js`:
  - Wire up "I got it" button to call review API
  - Wire up "I forgot" button to call review API
  - Show review status on flashcards
  - Track progress through set
- [ ] Update API calls to use new `/api/flashcards/generate` endpoint

### 6.3 Update Email Processing
- [ ] Update `frontend/src/components/EmailSimulator.js`:
  - Optionally call `/api/webhook/email` instead of `/api/alerts/process-email`
  - Update to match new endpoint format

## Phase 7: Testing & Verification

### 7.1 Test Authentication Flow
- [ ] Test signup with new user
- [ ] Test login with credentials
- [ ] Test protected routes (should redirect if not logged in)
- [ ] Test logout functionality

### 7.2 Test Email Webhook
- [ ] Test `/api/webhook/email` with sample emails
- [ ] Verify alerts are created with urgency
- [ ] Test different alert types

### 7.3 Test Flashcard Generation
- [ ] Test `/api/flashcards/generate` endpoint
- [ ] Verify flashcards are created correctly
- [ ] Test review tracking ("I got it", "I forgot")

### 7.4 Test End-to-End
- [ ] Create user account
- [ ] Add classes
- [ ] Process email → create alert with urgency
- [ ] Generate flashcards
- [ ] Study flashcards and track reviews
- [ ] Mark alerts as read

## Phase 8: Documentation Updates

### 8.1 Update Documentation
- [ ] Update `README.md` with CampusSync branding
- [ ] Update `ARCHITECTURE.md` with new endpoints and auth flow
- [ ] Update `SETUP.md` with auth setup instructions
- [ ] Document new endpoints in README

### 8.2 Update Environment Variables
- [ ] Add `JWT_SECRET` to backend `.env.example`
- [ ] Document all required environment variables

## Implementation Order Recommendation

**Priority 1 (Core Features):**
1. Phase 1: Rename to CampusSync
2. Phase 2: Database schema updates (urgency, review tracking)
3. Phase 3: Backend API updates (webhook, generate endpoints, urgency)
4. Phase 6: Frontend updates (urgency display, review tracking)

**Priority 2 (Authentication):**
5. Phase 4: Backend authentication
6. Phase 5: Frontend authentication

**Priority 3 (Polish):**
7. Phase 7: Testing
8. Phase 8: Documentation

## Notes

- Keep backward compatibility where possible (maintain old endpoints temporarily)
- Use environment variables for JWT secret
- Ensure password hashing is secure (bcrypt with appropriate salt rounds)
- Consider adding rate limiting for auth endpoints
- Add input validation for all endpoints
- Consider adding error handling middleware

## Estimated Implementation Time

- Phase 1: 30 minutes
- Phase 2: 1 hour
- Phase 3: 2 hours
- Phase 4: 3 hours
- Phase 5: 2 hours
- Phase 6: 1.5 hours
- Phase 7: 1 hour
- Phase 8: 30 minutes

**Total: ~11-12 hours**

