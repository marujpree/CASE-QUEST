const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create a new PDF document
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 50, bottom: 50, left: 50, right: 50 }
});

// Output file path
const outputPath = path.join(__dirname, '..', 'CampusSync-Architecture.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Helper function to add a title
function addTitle(text, size = 24) {
  doc.fontSize(size).font('Helvetica-Bold').text(text, { align: 'center' });
  doc.moveDown(0.5);
}

// Helper function to add a section header
function addSectionHeader(text, size = 16) {
  doc.moveDown(1);
  doc.fontSize(size).font('Helvetica-Bold').text(text, { underline: true });
  doc.moveDown(0.3);
}

// Helper function to add body text
function addBodyText(text, size = 11) {
  doc.fontSize(size).font('Helvetica').text(text);
  doc.moveDown(0.3);
}

// Helper function to add code/monospace text
function addCodeText(text, size = 10) {
  doc.fontSize(size).font('Courier').text(text);
  doc.moveDown(0.3);
}

// Helper function to add a horizontal line
function addLine() {
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
}

// ===== COVER PAGE =====
addTitle('CampusSync', 36);
doc.moveDown(1);
addTitle('Web Architecture Documentation', 24);
doc.moveDown(2);
addBodyText('Version 1.0.0', 14);
doc.moveDown(1);
addBodyText('Generated: ' + new Date().toLocaleString(), 12);

// ===== PAGE 1: SYSTEM OVERVIEW =====
doc.addPage();
addTitle('System Overview', 24);
doc.moveDown(0.5);

addSectionHeader('Technology Stack', 16);
addBodyText('CampusSync is a full-stack PERN (PostgreSQL, Express, React, Node.js) web application designed to help students manage academic overhead through automated email alert detection and AI-generated flashcards.', 11);

doc.moveDown(0.5);
addBodyText('Frontend:', 12);
doc.font('Helvetica-Bold');
addBodyText('• React 18.2.0 - UI framework', 10);
addBodyText('• React Router DOM 6.20.0 - Client-side routing', 10);
addBodyText('• Axios 1.6.2 - HTTP client for API calls', 10);
addBodyText('• CSS3 - Modern styling', 10);

doc.moveDown(0.3);
doc.font('Helvetica');
addBodyText('Backend:', 12);
doc.font('Helvetica-Bold');
addBodyText('• Node.js - JavaScript runtime', 10);
addBodyText('• Express 4.18.2 - Web application framework', 10);
addBodyText('• PostgreSQL - Relational database', 10);
addBodyText('• pg 8.11.3 - PostgreSQL client', 10);
addBodyText('• JWT - Authentication tokens', 10);
addBodyText('• bcrypt - Password hashing', 10);

// ===== PAGE 2: ARCHITECTURE DIAGRAM =====
doc.addPage();
addTitle('System Architecture', 24);
doc.moveDown(0.5);

addSectionHeader('High-Level Architecture', 16);
addCodeText('┌─────────────────────────────────────────────────────────────┐', 9);
addCodeText('│                         Frontend                             │', 9);
addCodeText('│                    (React SPA - Port 3000)                   │', 9);
addCodeText('├─────────────────────────────────────────────────────────────┤', 9);
addCodeText('│                                                               │', 9);
addCodeText('│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │', 9);
addCodeText('│  │  Dashboard  │  │   Alerts    │  │   Classes   │         │', 9);
addCodeText('│  │    Page     │  │    Page     │  │    Page     │         │', 9);
addCodeText('│  └─────────────┘  └─────────────┘  └─────────────┘         │', 9);
addCodeText('│                                                               │', 9);
addCodeText('│  ┌─────────────┐  ┌─────────────────────────────┐          │', 9);
addCodeText('│  │ Flashcards  │  │      Components:            │          │', 9);
addCodeText('│  │    Page     │  │  - AlertCard                │          │', 9);
addCodeText('│  └─────────────┘  │  - ClassCard                │          │', 9);
addCodeText('│                   │  - FlashcardViewer          │          │', 9);
addCodeText('│                   │  - EmailSimulator           │          │', 9);
addCodeText('│                   └─────────────────────────────┘          │', 9);
addCodeText('│                                                               │', 9);
addCodeText('│  ┌───────────────────────────────────────────┐              │', 9);
addCodeText('│  │          API Service (Axios)               │              │', 9);
addCodeText('│  └───────────────────────────────────────────┘              │', 9);
addCodeText('└─────────────────────┬───────────────────────────────────────┘', 9);
addCodeText('                      │ HTTP/REST API', 9);
addCodeText('                      │ (JSON + JWT)', 9);
addCodeText('┌─────────────────────┴───────────────────────────────────────┐', 9);
addCodeText('│                         Backend                              │', 9);
addCodeText('│                  (Express API - Port 5000)                   │', 9);
addCodeText('├─────────────────────────────────────────────────────────────┤', 9);
addCodeText('│                                                               │', 9);
addCodeText('│  ┌─────────────────────────────────────────────────────┐    │', 9);
addCodeText('│  │                   Routes Layer                       │    │', 9);
addCodeText('│  ├─────────────────────────────────────────────────────┤    │', 9);
addCodeText('│  │  /api/auth          - Authentication                 │    │', 9);
addCodeText('│  │  /api/users         - User management                │    │', 9);
addCodeText('│  │  /api/classes       - Class management              │    │', 9);
addCodeText('│  │  /api/alerts        - Alert management              │    │', 9);
addCodeText('│  │  /api/flashcard-sets- Flashcard set management      │    │', 9);
addCodeText('│  │  /api/flashcards    - Flashcard management          │    │', 9);
addCodeText('│  │  /api/webhook       - Email webhook                 │    │', 9);
addCodeText('│  └─────────────────────────────────────────────────────┘    │', 9);
addCodeText('│                           │                                   │', 9);
addCodeText('│  ┌─────────────────────────────────────────────────────┐    │', 9);
addCodeText('│  │                   Models Layer                       │    │', 9);
addCodeText('│  ├─────────────────────────────────────────────────────┤    │', 9);
addCodeText('│  │  User, Class, Alert, FlashcardSet, Flashcard       │    │', 9);
addCodeText('│  └─────────────────────────────────────────────────────┘    │', 9);
addCodeText('│                           │                                   │', 9);
addCodeText('│  ┌─────────────────────────────────────────────────────┐    │', 9);
addCodeText('│  │                  Utilities Layer                     │    │', 9);
addCodeText('│  ├─────────────────────────────────────────────────────┤    │', 9);
addCodeText('│  │  emailParser      - Detect alert types               │    │', 9);
addCodeText('│  │  flashcardGenerator - Generate flashcards            │    │', 9);
addCodeText('│  └─────────────────────────────────────────────────────┘    │', 9);
addCodeText('│                           │                                   │', 9);
addCodeText('│  ┌─────────────────────────────────────────────────────┐    │', 9);
addCodeText('│  │              Database Configuration                  │    │', 9);
addCodeText('│  └─────────────────────────────────────────────────────┘    │', 9);
addCodeText('└─────────────────────┬───────────────────────────────────────┘', 9);
addCodeText('                      │ SQL Queries', 9);
addCodeText('                      │ (pg Pool)', 9);
addCodeText('┌─────────────────────┴───────────────────────────────────────┐', 9);
addCodeText('│                    PostgreSQL Database                       │', 9);
addCodeText('│                       (Port 5432)                            │', 9);
addCodeText('├─────────────────────────────────────────────────────────────┤', 9);
addCodeText('│                                                               │', 9);
addCodeText('│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │', 9);
addCodeText('│  │  users   │  │ classes  │  │  alerts  │  │flashcard_│   │', 9);
addCodeText('│  │          │  │          │  │          │  │  sets    │   │', 9);
addCodeText('│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │', 9);
addCodeText('│       │             │             │             │           │', 9);
addCodeText('│       └─────────────┴─────────────┴─────────────┘           │', 9);
addCodeText('│                         │                                    │', 9);
addCodeText('│                  ┌──────┴──────┐                            │', 9);
addCodeText('│                  │ flashcards  │                            │', 9);
addCodeText('│                  └─────────────┘                            │', 9);
addCodeText('└─────────────────────────────────────────────────────────────┘', 9);

// ===== PAGE 3: DATA FLOW =====
doc.addPage();
addTitle('Data Flow Diagrams', 24);
doc.moveDown(0.5);

addSectionHeader('1. Authentication Flow', 16);
addCodeText('User Action (Login/Signup)', 10);
addCodeText('    │', 9);
addCodeText('    ├─> Frontend: Login/Signup Component', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> POST /api/auth/login', 9);
addCodeText('    │       │   or POST /api/auth/signup', 9);
addCodeText('    │       │', 9);
addCodeText('    ├─> Backend: auth.js Route', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> User.findByEmail() / User.createWithPassword()', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> Password verification (bcrypt)', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> Generate JWT token', 9);
addCodeText('    │       │', 9);
addCodeText('    │       └─> Response with user + token', 9);
addCodeText('    │', 9);
addCodeText('    └─> Frontend: Store token in localStorage', 9);
addCodeText('            │', 9);
addCodeText('            └─> Redirect to Dashboard', 9);

doc.moveDown(1);
addSectionHeader('2. Email Alert Detection Flow', 16);
addCodeText('Email Webhook / User Input (Email Simulator)', 10);
addCodeText('    │', 9);
addCodeText('    ├─> POST /api/webhook/email', 9);
addCodeText('    │   or POST /api/alerts/process-email', 9);
addCodeText('    │', 9);
addCodeText('    ├─> Backend: webhook.js / alerts.js Route', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> emailParser.processEmail()', 9);
addCodeText('    │       │       │', 9);
addCodeText('    │       │       ├─> detectAlertType() - Pattern matching', 9);
addCodeText('    │       │       └─> extractClassInfo() - Data extraction', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> Alert.create() - Save to database', 9);
addCodeText('    │       │', 9);
addCodeText('    │       └─> Response with alert object', 9);
addCodeText('    │', 9);
addCodeText('    └─> Frontend: Update alerts list', 9);
addCodeText('            │', 9);
addCodeText('            └─> Display new alert in AlertCard', 9);

// ===== PAGE 4: MORE DATA FLOWS =====
doc.addPage();
addSectionHeader('3. Flashcard Generation Flow', 16);
addCodeText('User Input (Create Flashcard Set)', 10);
addCodeText('    │', 9);
addCodeText('    ├─> Frontend: FlashcardSetForm Component', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> POST /api/flashcard-sets/generate', 9);
addCodeText('    │       │', 9);
addCodeText('    ├─> Backend: flashcardSets.js Route', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> FlashcardSet.create() - Create set', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> flashcardGenerator.generateFlashcardsByTopic()', 9);
addCodeText('    │       │       │', 9);
addCodeText('    │       │       └─> Generate question-answer pairs', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> For each flashcard:', 9);
addCodeText('    │       │       └─> Flashcard.create() - Save to database', 9);
addCodeText('    │       │', 9);
addCodeText('    │       └─> Response with set and flashcards', 9);
addCodeText('    │', 9);
addCodeText('    └─> Frontend: Update flashcard sets list', 9);
addCodeText('            │', 9);
addCodeText('            └─> Display new set in FlashcardSetCard', 9);

doc.moveDown(1);
addSectionHeader('4. Study Session Flow', 16);
addCodeText('User clicks "Study" on a flashcard set', 10);
addCodeText('    │', 9);
addCodeText('    ├─> Frontend: FlashcardViewer Component', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> GET /api/flashcards/set/:setId', 9);
addCodeText('    │       │', 9);
addCodeText('    ├─> Backend: flashcards.js Route', 9);
addCodeText('    │       │', 9);
addCodeText('    │       ├─> Flashcard.findBySetId() - Query database', 9);
addCodeText('    │       │', 9);
addCodeText('    │       └─> Response with array of flashcards', 9);
addCodeText('    │', 9);
addCodeText('    └─> Frontend: Interactive study mode', 9);
addCodeText('            │', 9);
addCodeText('            ├─> Display current flashcard', 9);
addCodeText('            ├─> Flip animation (question ↔ answer)', 9);
addCodeText('            ├─> Navigation (previous/next)', 9);
addCodeText('            └─> Progress tracking', 9);

// ===== PAGE 5: DATABASE SCHEMA =====
doc.addPage();
addTitle('Database Schema', 24);
doc.moveDown(0.5);

addSectionHeader('Entity Relationship Diagram', 16);
addCodeText('┌─────────────┐', 9);
addCodeText('│    users    │', 9);
addCodeText('├─────────────┤', 9);
addCodeText('│ id (PK)     │◄───────┐', 9);
addCodeText('│ email       │        │', 9);
addCodeText('│ name        │        │', 9);
addCodeText('│ password_hash│       │', 9);
addCodeText('│ created_at  │        │', 9);
addCodeText('│ updated_at  │        │', 9);
addCodeText('└─────────────┘        │', 9);
addCodeText('                       │ user_id (FK)', 9);
addCodeText('                       │', 9);
addCodeText('┌─────────────┐        │', 9);
addCodeText('│   classes   │        │', 9);
addCodeText('├─────────────┤        │', 9);
addCodeText('│ id (PK)     │◄───┐   │', 9);
addCodeText('│ user_id(FK) ├────┘   │', 9);
addCodeText('│ name        │        │', 9);
addCodeText('│ code        │        │', 9);
addCodeText('│ description │        │', 9);
addCodeText('│ instructor  │        │', 9);
addCodeText('│ created_at  │        │', 9);
addCodeText('│ updated_at  │        │', 9);
addCodeText('└─────────────┘        │', 9);
addCodeText('       ▲               │', 9);
addCodeText('       │               │', 9);
addCodeText('       │ class_id (FK) │', 9);
addCodeText('       │               │', 9);
addCodeText('┌─────────────┐        │', 9);
addCodeText('│   alerts    │        │', 9);
addCodeText('├─────────────┤        │', 9);
addCodeText('│ id (PK)     │        │', 9);
addCodeText('│ user_id(FK) ├────────┘', 9);
addCodeText('│ class_id(FK)├────────────┐', 9);
addCodeText('│ type        │            │', 9);
addCodeText('│ title       │            │', 9);
addCodeText('│ message     │            │', 9);
addCodeText('│ email_subject│           │', 9);
addCodeText('│ email_from  │            │', 9);
addCodeText('│ urgency     │            │', 9);
addCodeText('│ detected_at │            │', 9);
addCodeText('│ is_read     │            │', 9);
addCodeText('│ created_at  │            │', 9);
addCodeText('└─────────────┘            │', 9);
addCodeText('                           │', 9);
addCodeText('┌─────────────────┐        │', 9);
addCodeText('│ flashcard_sets  │        │', 9);
addCodeText('├─────────────────┤        │', 9);
addCodeText('│ id (PK)         │◄───┐   │', 9);
addCodeText('│ user_id (FK)    ├────┤───┘', 9);
addCodeText('│ class_id (FK)   ├────┘', 9);
addCodeText('│ title           │', 9);
addCodeText('│ description     │', 9);
addCodeText('│ created_at      │', 9);
addCodeText('│ updated_at      │', 9);
addCodeText('└─────────────────┘', 9);
addCodeText('       ▲', 9);
addCodeText('       │', 9);
addCodeText('       │ flashcard_set_id (FK)', 9);
addCodeText('       │', 9);
addCodeText('┌─────────────────┐', 9);
addCodeText('│   flashcards    │', 9);
addCodeText('├─────────────────┤', 9);
addCodeText('│ id (PK)         │', 9);
addCodeText('│ flashcard_set_id│', 9);
addCodeText('│    (FK)         ├────────┘', 9);
addCodeText('│ question        │', 9);
addCodeText('│ answer          │', 9);
addCodeText('│ difficulty      │', 9);
addCodeText('│ created_at      │', 9);
addCodeText('│ updated_at      │', 9);
addCodeText('└─────────────────┘', 9);

// ===== PAGE 6: API ENDPOINTS =====
doc.addPage();
addTitle('API Endpoints', 24);
doc.moveDown(0.5);

addSectionHeader('RESTful API Structure', 16);
addCodeText('/api', 10);
addCodeText('├── /auth', 9);
addCodeText('│   ├── POST   /signup        - Create user account', 9);
addCodeText('│   ├── POST   /login         - Authenticate user', 9);
addCodeText('│   └── GET    /me            - Get current user (protected)', 9);
addCodeText('│', 9);
addCodeText('├── /users', 9);
addCodeText('│   ├── GET    /              - List all users', 9);
addCodeText('│   ├── GET    /:id           - Get user by ID', 9);
addCodeText('│   ├── POST   /              - Create user', 9);
addCodeText('│   ├── PUT    /:id           - Update user', 9);
addCodeText('│   └── DELETE /:id           - Delete user', 9);
addCodeText('│', 9);
addCodeText('├── /classes', 9);
addCodeText('│   ├── GET    /user/:userId  - Get classes for user', 9);
addCodeText('│   ├── GET    /:id           - Get class by ID', 9);
addCodeText('│   ├── POST   /              - Create class', 9);
addCodeText('│   ├── PUT    /:id           - Update class', 9);
addCodeText('│   └── DELETE /:id           - Delete class', 9);
addCodeText('│', 9);
addCodeText('├── /alerts', 9);
addCodeText('│   ├── GET    /user/:userId     - Get alerts for user', 9);
addCodeText('│   ├── GET    /:id              - Get alert by ID', 9);
addCodeText('│   ├── POST   /                 - Create alert', 9);
addCodeText('│   ├── POST   /process-email     - Process email & create alert', 9);
addCodeText('│   ├── PATCH  /:id/read         - Mark alert as read', 9);
addCodeText('│   └── DELETE /:id              - Delete alert', 9);
addCodeText('│', 9);
addCodeText('├── /flashcard-sets', 9);
addCodeText('│   ├── GET    /user/:userId  - Get sets for user', 9);
addCodeText('│   ├── GET    /:id           - Get set by ID', 9);
addCodeText('│   ├── POST   /              - Create set', 9);
addCodeText('│   ├── POST   /generate      - Create set with AI flashcards', 9);
addCodeText('│   ├── PUT    /:id           - Update set', 9);
addCodeText('│   └── DELETE /:id           - Delete set', 9);
addCodeText('│', 9);
addCodeText('├── /flashcards', 9);
addCodeText('│   ├── GET    /set/:setId    - Get flashcards for set', 9);
addCodeText('│   ├── GET    /:id           - Get flashcard by ID', 9);
addCodeText('│   ├── POST   /              - Create flashcard', 9);
addCodeText('│   ├── PUT    /:id           - Update flashcard', 9);
addCodeText('│   └── DELETE /:id           - Delete flashcard', 9);
addCodeText('│', 9);
addCodeText('└── /webhook', 9);
addCodeText('    └── POST   /email         - Email webhook endpoint', 9);

// ===== PAGE 7: COMPONENT HIERARCHY =====
doc.addPage();
addTitle('Frontend Component Hierarchy', 24);
doc.moveDown(0.5);

addSectionHeader('React Component Tree', 16);
addCodeText('App', 10);
addCodeText('├── Router', 9);
addCodeText('    ├── Navbar', 9);
addCodeText('    │   ├── Logo', 9);
addCodeText('    │   ├── Navigation Menu', 9);
addCodeText('    │   └── User Info', 9);
addCodeText('    │', 9);
addCodeText('    ├── Dashboard (/)', 9);
addCodeText('    │   ├── Stats Cards', 9);
addCodeText('    │   │   ├── Alerts Stat', 9);
addCodeText('    │   │   ├── Classes Stat', 9);
addCodeText('    │   │   └── Flashcards Stat', 9);
addCodeText('    │   └── Recent Alerts List', 9);
addCodeText('    │', 9);
addCodeText('    ├── Alerts (/alerts)', 9);
addCodeText('    │   ├── Alerts Toolbar', 9);
addCodeText('    │   │   ├── Filter Buttons', 9);
addCodeText('    │   │   └── Email Simulator Toggle', 9);
addCodeText('    │   ├── EmailSimulator', 9);
addCodeText('    │   │   ├── Template Buttons', 9);
addCodeText('    │   │   └── Email Form', 9);
addCodeText('    │   └── Alerts Grid', 9);
addCodeText('    │       └── AlertCard (multiple)', 9);
addCodeText('    │           ├── Alert Header', 9);
addCodeText('    │           ├── Alert Content', 9);
addCodeText('    │           └── Alert Actions', 9);
addCodeText('    │', 9);
addCodeText('    ├── Classes (/classes)', 9);
addCodeText('    │   ├── Page Header', 9);
addCodeText('    │   ├── ClassForm (conditional)', 9);
addCodeText('    │   └── Classes Grid', 9);
addCodeText('    │       └── ClassCard (multiple)', 9);
addCodeText('    │           ├── Class Info', 9);
addCodeText('    │           └── Actions', 9);
addCodeText('    │', 9);
addCodeText('    ├── Flashcards (/flashcards)', 9);
addCodeText('    │   ├── FlashcardSetForm (conditional)', 9);
addCodeText('    │   │   ├── Basic Info Fields', 9);
addCodeText('    │   │   ├── AI Generation Toggle', 9);
addCodeText('    │   │   └── Topic Input', 9);
addCodeText('    │   ├── Flashcard Sets Grid', 9);
addCodeText('    │   │   └── FlashcardSetCard (multiple)', 9);
addCodeText('    │   │       ├── Set Info', 9);
addCodeText('    │   │       └── Actions', 9);
addCodeText('    │   └── FlashcardViewer (conditional)', 9);
addCodeText('    │       ├── Viewer Header', 9);
addCodeText('    │       ├── Progress Bar', 9);
addCodeText('    │       ├── Flashcard Display', 9);
addCodeText('    │       │   ├── Question Side', 9);
addCodeText('    │       │   └── Answer Side', 9);
addCodeText('    │       └── Navigation Controls', 9);
addCodeText('    │', 9);
addCodeText('    ├── Login (/login)', 9);
addCodeText('    │   └── Login Form', 9);
addCodeText('    │', 9);
addCodeText('    └── Signup (/signup)', 9);
addCodeText('        └── Signup Form', 9);

// ===== PAGE 8: KEY FEATURES =====
doc.addPage();
addTitle('Key Features & Implementation', 24);
doc.moveDown(0.5);

addSectionHeader('1. Authentication System', 16);
addBodyText('• JWT-based authentication', 11);
addBodyText('• Password hashing with bcrypt', 11);
addBodyText('• Protected routes with token verification', 11);
addBodyText('• Token stored in localStorage', 11);
addBodyText('• Auto-logout on token expiration', 11);

doc.moveDown(0.5);
addSectionHeader('2. Email Alert Detection', 16);
addBodyText('Algorithm:', 11);
addBodyText('1. Receive email content (from, subject, body)', 10);
addBodyText('2. Combine subject and body into searchable content', 10);
addBodyText('3. Convert to lowercase for case-insensitive matching', 10);
addBodyText('4. Iterate through predefined keyword patterns:', 10);
addBodyText('   - cancellation: "class cancelled", "no class", etc.', 9);
addBodyText('   - exam_change: "exam moved", "test rescheduled", etc.', 9);
addBodyText('   - extra_credit: "extra credit", "bonus points", etc.', 9);
addBodyText('   - assignment: "assignment due", "homework due", etc.', 9);
addBodyText('   - schedule_change: "room change", "time change", etc.', 9);
addBodyText('5. Return first matching type', 10);
addBodyText('6. Generate appropriate title and message', 10);
addBodyText('7. Save to database with urgency level', 10);

doc.moveDown(0.5);
addSectionHeader('3. AI Flashcard Generation', 16);
addBodyText('Current Implementation (Template-based):', 11);
addBodyText('1. Accept topic and count from user', 10);
addBodyText('2. Use template-based generation:', 10);
addBodyText('   - "Define [topic]"', 9);
addBodyText('   - "What are the main characteristics of [topic]?"', 9);
addBodyText('   - "How does [topic] relate to other concepts?"', 9);
addBodyText('   - "Why is [topic] important?"', 9);
addBodyText('   - "Give an example of [topic]"', 9);
addBodyText('3. Assign difficulty levels based on question complexity', 10);
addBodyText('4. Save to database', 10);

// ===== PAGE 9: SECURITY & DEPLOYMENT =====
doc.addPage();
addTitle('Security & Deployment', 24);
doc.moveDown(0.5);

addSectionHeader('Security Features', 16);
addBodyText('• SQL Injection Prevention: Parameterized queries using pg library', 11);
addBodyText('• CORS Configuration: Configured to allow frontend origin', 11);
addBodyText('• Input Validation: Required field validation in routes', 11);
addBodyText('• Password Security: bcrypt hashing with salt rounds', 11);
addBodyText('• JWT Tokens: Secure token-based authentication', 11);
addBodyText('• Error Handling: Proper error messages without exposing internals', 11);

doc.moveDown(0.5);
addSectionHeader('Development Environment', 16);
addCodeText('Localhost:3000 (React Dev Server)', 10);
addCodeText('    │', 9);
addCodeText('    ├─> Localhost:5000 (Express API)', 9);
addCodeText('    │       │', 9);
addCodeText('    │       └─> Localhost:5432 (PostgreSQL)', 9);

doc.moveDown(0.5);
addSectionHeader('Production Recommendations', 16);
addBodyText('• HTTPS: Encrypt data in transit with SSL/TLS certificates', 11);
addBodyText('• Environment Variables: Store secrets in .env (not committed)', 11);
addBodyText('• Rate Limiting: Prevent API abuse and DDoS attacks', 11);
addBodyText('• Database Backups: Regular automated backups', 11);
addBodyText('• Monitoring: Application performance monitoring (APM)', 11);
addBodyText('• Logging: Centralized logging system', 11);
addBodyText('• CDN: Serve static assets from CDN', 11);
addBodyText('• Load Balancing: Multiple API server instances', 11);

// ===== FINAL PAGE =====
doc.addPage();
addTitle('Architecture Summary', 24);
doc.moveDown(1);

addSectionHeader('System Characteristics', 16);
addBodyText('CampusSync\'s architecture is designed to be:', 11);
doc.moveDown(0.3);
addBodyText('• Modular: Clear separation of concerns', 11);
addBodyText('• Scalable: Can handle growth in users and data', 11);
addBodyText('• Maintainable: Well-organized code structure', 11);
addBodyText('• Extensible: Easy to add new features', 11);
addBodyText('• Secure: Security best practices implemented', 11);
addBodyText('• Performant: Efficient queries and rendering', 11);

doc.moveDown(1);
addSectionHeader('Technology Stack Summary', 16);
addBodyText('Frontend: React + React Router + Axios', 11);
addBodyText('Backend: Node.js + Express + PostgreSQL', 11);
addBodyText('Authentication: JWT + bcrypt', 11);
addBodyText('Database: PostgreSQL with connection pooling', 11);

doc.moveDown(1);
addBodyText('--- End of Document ---', 10);
addBodyText('Generated: ' + new Date().toLocaleString(), 9);

// Finalize the PDF
doc.end();

console.log('PDF generated successfully at: ' + outputPath);

