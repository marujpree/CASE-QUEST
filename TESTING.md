# ScholarSync Testing Guide

This document outlines manual testing procedures for the ScholarSync application.

## Prerequisites for Testing

1. Backend server running on http://localhost:5000
2. Frontend server running on http://localhost:3000
3. PostgreSQL database initialized with tables

## Backend API Testing

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"ScholarSync API is running"}
```

### 2. User Management

**Create a User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

**Expected:** User object with id, email, name, created_at, updated_at

**Get All Users:**
```bash
curl http://localhost:5000/api/users
```

**Expected:** Array of user objects

### 3. Class Management

**Create a Class (replace USER_ID with actual user id):**
```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"name":"Computer Science 101","code":"CS101","instructor":"Dr. Smith","description":"Introduction to programming"}'
```

**Expected:** Class object with all fields

**Get Classes for User:**
```bash
curl http://localhost:5000/api/classes/user/1
```

**Expected:** Array of class objects

### 4. Alert Processing

**Process Email:**
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"classId":1,"from":"professor@university.edu","subject":"Class Cancelled","body":"Class is cancelled tomorrow due to weather conditions."}'
```

**Expected:** Alert object with detected type and title

**Get Alerts for User:**
```bash
curl http://localhost:5000/api/alerts/user/1
```

**Expected:** Array of alert objects

### 5. Flashcard Generation

**Generate Flashcard Set:**
```bash
curl -X POST http://localhost:5000/api/flashcard-sets/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"classId":1,"title":"Python Basics","description":"Fundamental Python concepts","topic":"Python Programming","count":5}'
```

**Expected:** Object with set and flashcards array

**Get Flashcards for Set (replace SET_ID):**
```bash
curl http://localhost:5000/api/flashcards/set/1
```

**Expected:** Array of flashcard objects

## Email Parser Testing

Test the email parser with various email types:

### Cancellation Detection
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"from":"prof@uni.edu","subject":"Important","body":"Class is cancelled next Monday"}'
```
**Expected Type:** `cancellation`

### Exam Change Detection
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"from":"prof@uni.edu","subject":"Exam Update","body":"The midterm exam has been rescheduled to Friday"}'
```
**Expected Type:** `exam_change`

### Extra Credit Detection
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"from":"prof@uni.edu","subject":"Opportunity","body":"Extra credit opportunity for attending the lecture"}'
```
**Expected Type:** `extra_credit`

### Assignment Detection
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"from":"prof@uni.edu","subject":"Homework","body":"Assignment due next week on Friday"}'
```
**Expected Type:** `assignment`

### Schedule Change Detection
```bash
curl -X POST http://localhost:5000/api/alerts/process-email \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"from":"prof@uni.edu","subject":"Location Update","body":"Room change: we will meet in building A from now on"}'
```
**Expected Type:** `schedule_change`

## Frontend Testing

### 1. Dashboard Page (/)

**Test Cases:**
- [ ] Page loads without errors
- [ ] Statistics cards display correct counts
- [ ] Recent alerts section shows alerts
- [ ] Unread badge appears when there are unread alerts
- [ ] Alert icons display correctly based on type
- [ ] Navigation menu works

**Expected Elements:**
- Stats cards for alerts, classes, flashcard sets
- Recent alerts list with proper formatting
- Proper date formatting
- Alert type badges with colors

### 2. Alerts Page (/alerts)

**Test Cases:**
- [ ] All alerts display correctly
- [ ] Filter buttons work (All, Unread, Read)
- [ ] Email simulator can be shown/hidden
- [ ] Email templates populate the form
- [ ] Processing email creates alerts
- [ ] Mark as read functionality works
- [ ] Delete functionality works with confirmation
- [ ] Alert cards show all information

**Steps:**
1. Navigate to Alerts page
2. Click "Show Email Simulator"
3. Try each template button
4. Process an email
5. Verify alert appears in the list
6. Test filtering buttons
7. Mark an alert as read
8. Delete an alert

### 3. Classes Page (/classes)

**Test Cases:**
- [ ] Classes list displays
- [ ] Add Class button shows form
- [ ] Form validation works (required fields)
- [ ] Creating a class works
- [ ] Class cards display all information
- [ ] Delete confirmation appears
- [ ] Deleting a class works

**Steps:**
1. Navigate to Classes page
2. Click "Add Class"
3. Fill out the form:
   - Name: "Data Structures"
   - Code: "CS201"
   - Instructor: "Prof. Johnson"
   - Description: "Advanced programming concepts"
4. Submit and verify class appears
5. Test delete functionality

### 4. Flashcards Page (/flashcards)

**Test Cases:**
- [ ] Flashcard sets list displays
- [ ] Create Set button shows form
- [ ] Form handles AI generation toggle
- [ ] Topic field appears when AI generation is selected
- [ ] Creating a set works
- [ ] Generated flashcards have questions and answers
- [ ] Study button opens flashcard viewer
- [ ] Flashcard viewer navigation works
- [ ] Flip card functionality works
- [ ] Progress bar updates
- [ ] Delete functionality works

**Steps:**
1. Navigate to Flashcards page
2. Click "Create Set"
3. Fill out the form:
   - Title: "JavaScript Fundamentals"
   - Class: Select a class
   - Description: "Core JavaScript concepts"
   - Check "Generate flashcards with AI"
   - Topic: "JavaScript"
   - Count: 5
4. Submit and verify set appears with card count
5. Click "Study" button
6. Test navigation (Previous/Next buttons)
7. Test flip card functionality
8. Verify progress bar updates
9. Return to flashcards list

### 5. UI/UX Testing

**Test Cases:**
- [ ] Navbar displays correctly on all pages
- [ ] Active page is highlighted in navigation
- [ ] User name displays in navbar
- [ ] All buttons have hover effects
- [ ] Cards have shadow and hover animations
- [ ] Forms are styled consistently
- [ ] Color scheme is consistent throughout
- [ ] Responsive design works (test different window sizes)
- [ ] Loading states display appropriately
- [ ] Empty states have helpful messages

### 6. Cross-Page Integration

**Test Cases:**
- [ ] Classes created on Classes page appear in dropdowns on other pages
- [ ] Alerts link to the correct class
- [ ] Flashcard sets link to the correct class
- [ ] Deleting a class cascades properly (alerts and flashcards remain but class_name may be null)
- [ ] Dashboard stats update after adding/deleting items

## Database Testing

### 1. Verify Table Creation

```sql
-- Connect to the database
psql -d scholarsync

-- List all tables
\dt

-- Expected tables:
-- users
-- classes
-- alerts
-- flashcard_sets
-- flashcards
```

### 2. Check Foreign Key Relationships

```sql
-- Check classes reference users
SELECT * FROM classes WHERE user_id NOT IN (SELECT id FROM users);
-- Should return 0 rows

-- Check alerts reference users and classes
SELECT * FROM alerts WHERE user_id NOT IN (SELECT id FROM users);
-- Should return 0 rows

-- Check flashcard_sets reference users and classes
SELECT * FROM flashcard_sets WHERE user_id NOT IN (SELECT id FROM users);
-- Should return 0 rows

-- Check flashcards reference flashcard_sets
SELECT * FROM flashcards WHERE flashcard_set_id NOT IN (SELECT id FROM flashcard_sets);
-- Should return 0 rows
```

### 3. Test Cascade Delete

```sql
-- Create test data
INSERT INTO users (email, name) VALUES ('test@test.com', 'Test User') RETURNING id;
-- Note the user ID (e.g., 5)

INSERT INTO classes (user_id, name, code) VALUES (5, 'Test Class', 'TEST101') RETURNING id;
-- Note the class ID (e.g., 10)

-- Delete the user
DELETE FROM users WHERE id = 5;

-- Verify cascading delete
SELECT * FROM classes WHERE id = 10;
-- Should return 0 rows (deleted due to CASCADE)
```

## Error Handling Testing

### 1. Backend Error Handling

**Duplicate User Email:**
```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"duplicate@test.com","name":"User 1"}'

# Try to create another user with same email
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"duplicate@test.com","name":"User 2"}'
```
**Expected:** 409 Conflict error

**Missing Required Fields:**
```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"userId":1}'
```
**Expected:** 400 Bad Request error

**Non-existent Resource:**
```bash
curl http://localhost:5000/api/classes/99999
```
**Expected:** 404 Not Found or null

### 2. Frontend Error Handling

**Test Cases:**
- [ ] Backend connection errors show appropriate message
- [ ] Form validation prevents submission with missing required fields
- [ ] Delete confirmations prevent accidental deletions
- [ ] Empty states show when no data exists

## Performance Testing

### 1. Load Testing

**Test Cases:**
- [ ] Dashboard loads quickly with 50+ alerts
- [ ] Classes page loads quickly with 20+ classes
- [ ] Flashcards page loads quickly with 30+ sets
- [ ] Flashcard viewer handles sets with 50+ cards
- [ ] Email processing is fast (< 1 second)
- [ ] Flashcard generation is reasonable (< 3 seconds for 5 cards)

### 2. Memory Testing

**Test Cases:**
- [ ] No memory leaks when navigating between pages
- [ ] Large lists don't cause browser slowdown
- [ ] Images and assets load efficiently

## Security Testing

### 1. Input Validation

**Test Cases:**
- [ ] SQL injection attempts are handled safely
- [ ] XSS attempts in form fields are sanitized
- [ ] Very long inputs are handled gracefully
- [ ] Special characters in inputs work correctly

**Test SQL Injection:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Robert\"); DROP TABLE users;--"}'
```
**Expected:** Should create user with escaped name, not execute SQL

### 2. API Security

**Test Cases:**
- [ ] CORS is configured properly
- [ ] No sensitive data in error messages
- [ ] Database credentials not exposed

## Test Results Template

Use this template to record test results:

```
Date: ___________
Tester: ___________

Backend API Tests:
[ ] Health Check - PASS/FAIL
[ ] User Management - PASS/FAIL
[ ] Class Management - PASS/FAIL
[ ] Alert Processing - PASS/FAIL
[ ] Flashcard Generation - PASS/FAIL

Email Parser Tests:
[ ] Cancellation Detection - PASS/FAIL
[ ] Exam Change Detection - PASS/FAIL
[ ] Extra Credit Detection - PASS/FAIL
[ ] Assignment Detection - PASS/FAIL
[ ] Schedule Change Detection - PASS/FAIL

Frontend Tests:
[ ] Dashboard - PASS/FAIL
[ ] Alerts Page - PASS/FAIL
[ ] Classes Page - PASS/FAIL
[ ] Flashcards Page - PASS/FAIL
[ ] UI/UX - PASS/FAIL

Database Tests:
[ ] Table Creation - PASS/FAIL
[ ] Foreign Keys - PASS/FAIL
[ ] Cascade Delete - PASS/FAIL

Error Handling Tests:
[ ] Backend Errors - PASS/FAIL
[ ] Frontend Errors - PASS/FAIL

Notes:
_______________________________________________________
_______________________________________________________
```

## Automated Testing (Future Enhancement)

For future development, consider adding:

1. **Backend:**
   - Jest for unit tests
   - Supertest for API integration tests
   - Test coverage for all routes and models

2. **Frontend:**
   - React Testing Library for component tests
   - Jest for unit tests
   - Cypress or Playwright for E2E tests

3. **Database:**
   - Test database with fixtures
   - Migration testing
   - Seed data for consistent testing

## Conclusion

This testing guide covers the major functionality of ScholarSync. Regular testing ensures the application works correctly and helps identify issues early. Update this document as new features are added.
