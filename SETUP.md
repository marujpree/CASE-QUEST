# CampusSync Setup Guide

This guide will help you set up and run the CampusSync application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**

## Step-by-Step Setup

### 1. Install PostgreSQL

If you haven't already, install PostgreSQL on your system.

**Windows:**
- Download and run the PostgreSQL installer
- Remember the password you set for the postgres user

**Mac (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create the Database

Open PostgreSQL command line or pgAdmin and create a new database:

```sql
CREATE DATABASE campussync;
```

Or using the command line:
```bash
# For Mac/Linux
psql postgres
CREATE DATABASE campussync;
\q

# For Windows (in PowerShell)
psql -U postgres
CREATE DATABASE campussync;
\q
```

### 3. Install Dependencies

```bash
# From the root directory, install all dependencies
npm install

# This will install root dependencies (concurrently) and you can also run:
npm run install-all
# This installs backend and frontend dependencies separately
```

### 4. Setup Backend Environment

```bash
# Navigate to the backend directory
cd backend

# Create environment file (if .env.example exists)
# Or create .env manually
```

Edit the `backend/.env` file with your database credentials:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/campussync
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Replace `yourpassword` with your PostgreSQL password.

### 5. Initialize Database Tables

```bash
# From the root directory
npm run init-db

# Or from backend directory
cd backend
npm run init-db
```

You should see:
```
Connected to PostgreSQL database
Users table created
Classes table created
Alerts table created
Flashcard sets table created
Flashcards table created
All tables created successfully!
```

### 6. Start the Application

**Single Command (Recommended):**

```bash
# From the root directory - runs both backend and frontend
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

The React development server will automatically open your browser.

**Alternative - Separate Commands:**

If you prefer to run them separately:

```bash
# Terminal 1 - Backend
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

## Verifying the Setup

### Backend API Test

Open your browser or use curl to test the backend:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"CampusSync API is running"}
```

### Frontend Test

1. Open `http://localhost:3000` in your browser
2. You should see the CampusSync login page
3. Create an account or login to access the dashboard

## Using the Application

### 1. Add a Class

- Navigate to the "Classes" page
- Click "Add Class"
- Fill in the form:
  - **Name**: Introduction to Computer Science
  - **Code**: CS 101
  - **Instructor**: Dr. Smith
  - **Description**: Fundamentals of programming and computer science
- Click "Add Class"

### 2. Test Email Alert Detection

- Navigate to the "Alerts" page
- Click "Show Email Simulator"
- Try one of the quick templates:
  - Click "Class Cancellation"
  - Select a class from the dropdown (if you added one)
  - Click "Process Email"
- An alert should be created and displayed

### 3. Create Flashcards

- Navigate to the "Flashcards" page
- Click "Create Set"
- Fill in the form:
  - **Title**: Chapter 1 Review
  - **Class**: Select a class (optional)
  - **Description**: Key concepts from chapter 1
  - Check "Generate flashcards with AI"
  - **Topic**: Variables and Data Types
  - **Number of Cards**: 5
- Click "Generate Set"
- Click "Study" on the created set to review flashcards

## Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Make sure PostgreSQL is running
- Check if the port 5432 is correct (default PostgreSQL port)
- Verify your DATABASE_URL in `.env`

**Error: "password authentication failed"**
- Check your PostgreSQL password in the DATABASE_URL
- Make sure the user has access to the database

### Port Already in Use

**Backend Port 5000:**
```bash
# Find and kill the process using port 5000
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend Port 3000:**
- React will automatically suggest port 3001 if 3000 is busy
- You can accept the alternative port

### npm Install Errors

If you encounter errors during `npm install`:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### React Build Warnings

If you see warnings about missing dependencies in useEffect:
- These are common in development and won't affect functionality
- The app will still work correctly

## Environment Variables

### Backend (.env)

```env
PORT=5000                              # Port for the backend server
DATABASE_URL=postgresql://...          # PostgreSQL connection string
JWT_SECRET=your-secret-key             # Secret key for JWT tokens (change in production)
NODE_ENV=development                   # Environment (development/production)
```

### Frontend

The frontend uses `REACT_APP_API_URL` for the API endpoint. By default, it uses `http://localhost:5000/api`.

To change it, create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Production Deployment

For production deployment:

1. **Backend:**
   - Set `NODE_ENV=production` in `.env`
   - Use a production PostgreSQL database
   - Consider using PM2 for process management
   - Set up proper SSL/TLS

2. **Frontend:**
   - Build the production bundle: `npm run build`
   - Serve the build folder with a static file server
   - Update `REACT_APP_API_URL` to your production API URL

3. **Database:**
   - Use connection pooling
   - Set up regular backups
   - Configure proper SSL connections

## Next Steps

- Add more classes to organize your academic schedule
- Process emails to create alerts
- Generate flashcard sets for different topics
- Explore the dashboard to see your stats

## Support

If you encounter any issues not covered here, please check:
- The main README.md for API documentation
- PostgreSQL documentation for database issues
- React documentation for frontend issues

Happy studying with CampusSync! 📚
