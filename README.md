# ScholarSync - CASE-QUEST
Academic Co-Pilot

## Overview

ScholarSync is a PERN (PostgreSQL, Express, React, Node.js) web application that helps students manage academic overhead. It automatically detects important class updates from emails (cancellations, exam changes, extra credit opportunities) and displays them as clean alerts. It also generates and manages AI-created flashcards for each class.

## Features

- **📧 Email Alert Detection**: Automatically processes emails to detect important class updates
  - Class cancellations
  - Exam schedule changes
  - Extra credit opportunities
  - Assignment deadlines
  - Schedule changes

- **🎴 AI Flashcard Generation**: Create study materials with AI-generated flashcards
  - Generate flashcards by topic
  - Organize by class
  - Interactive study mode with flip cards
  - Difficulty levels

- **📚 Class Management**: Organize your academic courses
  - Add classes with course codes
  - Track instructors
  - Associate alerts and flashcards with classes

- **📊 Dashboard**: Get an overview of your academic activities
  - Recent alerts
  - Statistics on classes and flashcards
  - Unread alert tracking

## Tech Stack

### Backend
- **Node.js** & **Express**: RESTful API server
- **PostgreSQL**: Relational database
- **pg**: PostgreSQL client for Node.js
- **dotenv**: Environment configuration
- **cors**: Cross-origin resource sharing

### Frontend
- **React**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CASE-QUEST
   ```

2. **Set up the database**
   - Create a PostgreSQL database named `scholarsync`
   - Update database credentials in `backend/.env`

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Initialize database tables
   npm run init-db
   
   # Start the server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Database Schema

### Users
- id, email, name, created_at, updated_at

### Classes
- id, user_id, name, code, description, instructor, created_at, updated_at

### Alerts
- id, user_id, class_id, type, title, message, email_subject, email_from, detected_at, is_read, created_at

### Flashcard Sets
- id, user_id, class_id, title, description, created_at, updated_at

### Flashcards
- id, flashcard_set_id, question, answer, difficulty, created_at, updated_at

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Classes
- `GET /api/classes/user/:userId` - Get all classes for a user
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Alerts
- `GET /api/alerts/user/:userId` - Get all alerts for a user
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create alert manually
- `POST /api/alerts/process-email` - Process email and create alert
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `DELETE /api/alerts/:id` - Delete alert

### Flashcard Sets
- `GET /api/flashcard-sets/user/:userId` - Get all flashcard sets for a user
- `GET /api/flashcard-sets/:id` - Get flashcard set by ID
- `POST /api/flashcard-sets` - Create flashcard set
- `POST /api/flashcard-sets/generate` - Create flashcard set with AI generation
- `PUT /api/flashcard-sets/:id` - Update flashcard set
- `DELETE /api/flashcard-sets/:id` - Delete flashcard set

### Flashcards
- `GET /api/flashcards/set/:setId` - Get all flashcards for a set
- `GET /api/flashcards/:id` - Get flashcard by ID
- `POST /api/flashcards` - Create flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard

## Usage

### Adding Classes
1. Navigate to the Classes page
2. Click "Add Class"
3. Fill in class details (name, code, instructor, description)
4. Submit to create the class

### Processing Emails
1. Navigate to the Alerts page
2. Click "Show Email Simulator"
3. Select a template or enter custom email content
4. Click "Process Email" to detect important updates
5. If an important update is detected, an alert will be created

### Creating Flashcards
1. Navigate to the Flashcards page
2. Click "Create Set"
3. Enter set details and topic
4. Choose to generate with AI or create an empty set
5. Study the flashcards in interactive mode

## Development

### Project Structure
```
CASE-QUEST/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Future Enhancements

- Real email integration (IMAP/Gmail API)
- Advanced AI integration (OpenAI GPT)
- User authentication and authorization
- Mobile responsive design improvements
- Spaced repetition algorithm for flashcards
- Export/import flashcard sets
- Collaborative study features
- Calendar integration
- Push notifications for alerts

## License

MIT
