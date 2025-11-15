# ScholarSync Architecture

## System Overview

ScholarSync is a full-stack PERN (PostgreSQL, Express, React, Node.js) web application designed to help students manage academic overhead through automated email alert detection and AI-generated flashcards.

## Technology Stack

### Frontend
- **React 18.2.0**: UI framework
- **React Router DOM 6.20.0**: Client-side routing
- **Axios 1.6.2**: HTTP client for API calls
- **CSS3**: Styling with modern features (gradients, animations, flexbox, grid)

### Backend
- **Node.js**: JavaScript runtime
- **Express 4.18.2**: Web application framework
- **PostgreSQL**: Relational database
- **pg 8.11.3**: PostgreSQL client for Node.js
- **cors 2.8.5**: Cross-origin resource sharing
- **dotenv 16.3.1**: Environment variable management
- **body-parser 1.20.2**: Request body parsing

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React SPA - Port 3000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Dashboard  │  │   Alerts    │  │   Classes   │         │
│  │    Page     │  │    Page     │  │    Page     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌─────────────┐  ┌─────────────────────────────┐          │
│  │ Flashcards  │  │      Components:            │          │
│  │    Page     │  │  - AlertCard                │          │
│  └─────────────┘  │  - ClassCard                │          │
│                   │  - FlashcardViewer          │          │
│                   │  - EmailSimulator           │          │
│                   └─────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────┐              │
│  │          API Service (Axios)               │              │
│  └───────────────────────────────────────────┘              │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
                      │ (JSON)
┌─────────────────────┴───────────────────────────────────────┐
│                         Backend                              │
│                  (Express API - Port 5000)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Routes Layer                       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  /api/users          - User management               │    │
│  │  /api/classes        - Class management              │    │
│  │  /api/alerts         - Alert management              │    │
│  │  /api/flashcard-sets - Flashcard set management      │    │
│  │  /api/flashcards     - Flashcard management          │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Models Layer                       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  User, Class, Alert, FlashcardSet, Flashcard        │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Utilities Layer                     │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  emailParser      - Detect alert types               │    │
│  │  flashcardGenerator - Generate flashcards            │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Database Configuration                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL Queries
                      │ (pg Pool)
┌─────────────────────┴───────────────────────────────────────┐
│                    PostgreSQL Database                       │
│                       (Port 5432)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ classes  │  │  alerts  │  │flashcard_│   │
│  │          │  │          │  │          │  │  sets    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                         │                                    │
│                  ┌──────┴──────┐                            │
│                  │ flashcards  │                            │
│                  └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Email Alert Detection Flow

```
User Input (Email Simulator)
    │
    ├─> Frontend: EmailSimulator Component
    │       │
    │       ├─> POST /api/alerts/process-email
    │       │
    ├─> Backend: alerts.js Route
    │       │
    │       ├─> emailParser.processEmail()
    │       │       │
    │       │       ├─> detectAlertType() - Pattern matching
    │       │       └─> extractClassInfo() - Data extraction
    │       │
    │       ├─> Alert.create() - Save to database
    │       │
    │       └─> Response with alert object
    │
    └─> Frontend: Update alerts list
            │
            └─> Display new alert in AlertCard
```

### 2. Flashcard Generation Flow

```
User Input (Create Flashcard Set)
    │
    ├─> Frontend: FlashcardSetForm Component
    │       │
    │       ├─> POST /api/flashcard-sets/generate
    │       │
    ├─> Backend: flashcardSets.js Route
    │       │
    │       ├─> FlashcardSet.create() - Create set
    │       │
    │       ├─> flashcardGenerator.generateFlashcardsByTopic()
    │       │       │
    │       │       └─> Generate question-answer pairs
    │       │
    │       ├─> For each flashcard:
    │       │       └─> Flashcard.create() - Save to database
    │       │
    │       └─> Response with set and flashcards
    │
    └─> Frontend: Update flashcard sets list
            │
            └─> Display new set in FlashcardSetCard
```

### 3. Study Session Flow

```
User clicks "Study" on a flashcard set
    │
    ├─> Frontend: FlashcardViewer Component
    │       │
    │       ├─> GET /api/flashcards/set/:setId
    │       │
    ├─> Backend: flashcards.js Route
    │       │
    │       ├─> Flashcard.findBySetId() - Query database
    │       │
    │       └─> Response with array of flashcards
    │
    └─> Frontend: Interactive study mode
            │
            ├─> Display current flashcard
            ├─> Flip animation (question ↔ answer)
            ├─> Navigation (previous/next)
            └─> Progress tracking
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │◄───────┐
│ email       │        │
│ name        │        │
│ created_at  │        │
│ updated_at  │        │
└─────────────┘        │
                       │
                       │ user_id (FK)
                       │
┌─────────────┐        │
│   classes   │        │
├─────────────┤        │
│ id (PK)     │◄───┐   │
│ user_id(FK) ├────┘   │
│ name        │        │
│ code        │        │
│ description │        │
│ instructor  │        │
│ created_at  │        │
│ updated_at  │        │
└─────────────┘        │
       ▲               │
       │               │
       │ class_id (FK) │
       │               │
┌─────────────┐        │
│   alerts    │        │
├─────────────┤        │
│ id (PK)     │        │
│ user_id(FK) ├────────┘
│ class_id(FK)├────────────┐
│ type        │            │
│ title       │            │
│ message     │            │
│ email_subject│           │
│ email_from  │            │
│ detected_at │            │
│ is_read     │            │
│ created_at  │            │
└─────────────┘            │
                           │
                           │
┌─────────────────┐        │
│ flashcard_sets  │        │
├─────────────────┤        │
│ id (PK)         │◄───┐   │
│ user_id (FK)    ├────┤───┘
│ class_id (FK)   ├────┘
│ title           │
│ description     │
│ created_at      │
│ updated_at      │
└─────────────────┘
       ▲
       │
       │ flashcard_set_id (FK)
       │
┌─────────────────┐
│   flashcards    │
├─────────────────┤
│ id (PK)         │
│ flashcard_set_id│
│    (FK)         ├────────┘
│ question        │
│ answer          │
│ difficulty      │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## Component Hierarchy

### Frontend Component Tree

```
App
├── Router
    ├── Navbar
    │   ├── Logo
    │   ├── Navigation Menu
    │   └── User Info
    │
    ├── Dashboard (/)
    │   ├── Stats Cards
    │   │   ├── Alerts Stat
    │   │   ├── Classes Stat
    │   │   └── Flashcards Stat
    │   └── Recent Alerts List
    │
    ├── Alerts (/alerts)
    │   ├── Alerts Toolbar
    │   │   ├── Filter Buttons
    │   │   └── Email Simulator Toggle
    │   ├── EmailSimulator
    │   │   ├── Template Buttons
    │   │   └── Email Form
    │   └── Alerts Grid
    │       └── AlertCard (multiple)
    │           ├── Alert Header
    │           ├── Alert Content
    │           └── Alert Actions
    │
    ├── Classes (/classes)
    │   ├── Page Header
    │   ├── ClassForm (conditional)
    │   └── Classes Grid
    │       └── ClassCard (multiple)
    │           ├── Class Info
    │           └── Actions
    │
    └── Flashcards (/flashcards)
        ├── FlashcardSetForm (conditional)
        │   ├── Basic Info Fields
        │   ├── AI Generation Toggle
        │   └── Topic Input
        ├── Flashcard Sets Grid
        │   └── FlashcardSetCard (multiple)
        │       ├── Set Info
        │       └── Actions
        └── FlashcardViewer (conditional)
            ├── Viewer Header
            ├── Progress Bar
            ├── Flashcard Display
            │   ├── Question Side
            │   └── Answer Side
            └── Navigation Controls
```

## API Endpoints Structure

### RESTful API Design

```
/api
├── /users
│   ├── GET    /           - List all users
│   ├── GET    /:id        - Get user by ID
│   ├── POST   /           - Create user
│   ├── PUT    /:id        - Update user
│   └── DELETE /:id        - Delete user
│
├── /classes
│   ├── GET    /user/:userId  - Get classes for user
│   ├── GET    /:id           - Get class by ID
│   ├── POST   /              - Create class
│   ├── PUT    /:id           - Update class
│   └── DELETE /:id           - Delete class
│
├── /alerts
│   ├── GET    /user/:userId     - Get alerts for user
│   ├── GET    /:id              - Get alert by ID
│   ├── POST   /                 - Create alert
│   ├── POST   /process-email    - Process email & create alert
│   ├── PATCH  /:id/read         - Mark alert as read
│   └── DELETE /:id              - Delete alert
│
├── /flashcard-sets
│   ├── GET    /user/:userId  - Get sets for user
│   ├── GET    /:id           - Get set by ID
│   ├── POST   /              - Create set
│   ├── POST   /generate      - Create set with AI flashcards
│   ├── PUT    /:id           - Update set
│   └── DELETE /:id           - Delete set
│
└── /flashcards
    ├── GET    /set/:setId    - Get flashcards for set
    ├── GET    /:id           - Get flashcard by ID
    ├── POST   /              - Create flashcard
    ├── PUT    /:id           - Update flashcard
    └── DELETE /:id           - Delete flashcard
```

## Key Features Implementation

### 1. Email Alert Detection

**Algorithm:**
1. Receive email content (from, subject, body)
2. Combine subject and body into searchable content
3. Convert to lowercase for case-insensitive matching
4. Iterate through predefined keyword patterns:
   - cancellation: "class cancelled", "no class", etc.
   - exam_change: "exam moved", "test rescheduled", etc.
   - extra_credit: "extra credit", "bonus points", etc.
   - assignment: "assignment due", "homework due", etc.
   - schedule_change: "room change", "time change", etc.
5. Return first matching type
6. Generate appropriate title and message
7. Save to database

**Pattern Matching:**
- Uses simple string inclusion (substring search)
- Multiple keywords per category for better detection
- Extensible design - easy to add new categories

### 2. AI Flashcard Generation

**Current Implementation (Simplified):**
1. Accept topic and count from user
2. Use template-based generation:
   - "Define [topic]"
   - "What are the main characteristics of [topic]?"
   - "How does [topic] relate to other concepts?"
   - "Why is [topic] important?"
   - "Give an example of [topic]"
3. Assign difficulty levels based on question complexity
4. Save to database

**Future Enhancement:**
- Integration with OpenAI GPT API
- Context-aware generation based on class materials
- Personalized difficulty adjustment
- Spaced repetition algorithm

### 3. State Management

**Frontend State:**
- Component-level state with React hooks (useState, useEffect)
- No global state management (Redux not needed for current scope)
- API calls trigger re-renders on data changes
- Loading states handled per component

**Backend State:**
- Stateless API design
- Database serves as single source of truth
- Connection pooling for database efficiency
- No session management (can be added for auth)

## Security Considerations

### Current Implementation

1. **SQL Injection Prevention:**
   - Parameterized queries using pg library
   - All user input passed as parameters, not concatenated

2. **CORS Configuration:**
   - Configured to allow frontend origin
   - Can be restricted to specific domains in production

3. **Input Validation:**
   - Required field validation in routes
   - Type checking on database inserts
   - Error handling for invalid data

### Future Enhancements

1. **Authentication & Authorization:**
   - JWT tokens for user sessions
   - Password hashing with bcrypt
   - Role-based access control

2. **Rate Limiting:**
   - Prevent API abuse
   - Protect against DDoS

3. **HTTPS:**
   - Encrypt data in transit
   - SSL/TLS certificates

4. **Input Sanitization:**
   - XSS prevention
   - HTML entity encoding
   - Content Security Policy

## Performance Optimization

### Current Implementation

1. **Database:**
   - Connection pooling with pg
   - Indexed primary keys
   - Foreign key relationships for efficient joins

2. **Frontend:**
   - Component-based architecture for reusability
   - Lazy loading potential with React Router
   - Minimal bundle size with selective imports

3. **API:**
   - Efficient queries with specific field selection
   - Pagination support in list endpoints
   - RESTful design for caching potential

### Future Enhancements

1. **Caching:**
   - Redis for session storage
   - API response caching
   - Static asset caching

2. **Database:**
   - Query optimization
   - Indexes on frequently searched fields
   - Database read replicas

3. **Frontend:**
   - Code splitting
   - Image optimization
   - Service workers for offline support

## Deployment Architecture

### Development Environment

```
Localhost:3000 (React Dev Server)
    │
    ├─> Localhost:5000 (Express API)
    │       │
    │       └─> Localhost:5432 (PostgreSQL)
```

### Production Environment (Recommended)

```
Internet
    │
    ├─> CDN (Static Assets)
    │
    ├─> Load Balancer
            │
            ├─> Web Server 1 (Nginx)
            │       │
            │       └─> React Build (Static)
            │
            ├─> Web Server 2 (Nginx)
            │       │
            │       └─> React Build (Static)
            │
            └─> API Server 1 (Node.js/Express)
                    │
                    ├─> Database (PostgreSQL)
                    │       └─> Read Replicas
                    │
                    └─> Cache (Redis)
```

## Scalability Considerations

### Horizontal Scaling

1. **Frontend:**
   - Static files served from CDN
   - Multiple web servers behind load balancer
   - Stateless design allows easy scaling

2. **Backend:**
   - Multiple API server instances
   - Stateless API design
   - Shared database and cache

3. **Database:**
   - Master-slave replication
   - Read replicas for query distribution
   - Connection pooling per instance

### Vertical Scaling

1. **Database:**
   - Increase RAM for larger datasets
   - Faster CPUs for complex queries
   - SSD storage for I/O performance

2. **API Servers:**
   - Increase memory for concurrent requests
   - More CPU cores for processing

## Monitoring and Logging

### Recommended Tools

1. **Application Monitoring:**
   - PM2 for Node.js process management
   - Application Performance Monitoring (APM)
   - Error tracking (Sentry, Rollbar)

2. **Database Monitoring:**
   - PostgreSQL logs
   - Query performance analysis
   - Connection pool monitoring

3. **Infrastructure:**
   - Server metrics (CPU, memory, disk)
   - Network monitoring
   - Log aggregation (ELK stack)

## Conclusion

ScholarSync's architecture is designed to be:
- **Modular**: Clear separation of concerns
- **Scalable**: Can handle growth in users and data
- **Maintainable**: Well-organized code structure
- **Extensible**: Easy to add new features
- **Secure**: Basic security practices implemented
- **Performant**: Efficient queries and rendering

The PERN stack provides a solid foundation for a modern web application with room for future enhancements.
