# Experiment 16 – MERN Student Management (with Teacher Login)

MongoDB Atlas + Express/Node (Render) + React/Vite (Vercel)

## 1. Run locally

### Backend
    cd backend
    npm install
    copy .env.example to .env  (Windows: copy .env.example .env) and edit values
    npm run dev          # -> "MongoDB connected", "Backend running on port 3000"

### Frontend (new terminal)
    cd frontend
    npm install
    copy .env.example to .env
    npm run dev          # -> http://localhost:5173

1. Open http://localhost:5173/login -> "Register here" -> create a teacher
   (invite code = value of TEACHER_INVITE_CODE in backend/.env).
2. Dashboard -> add students. They are saved in MongoDB:
   database `collegeDB`, collections `Students` and `Teachers`.
3. Home page (/) shows every student in cards with search, like the screenshot.

## 2. Deploy

### MongoDB Atlas
Create free cluster -> Database Access (create user) -> Network Access (allow 0.0.0.0/0)
-> Connect -> Drivers -> copy the connection string.

### Backend on Render (Web Service)
- Push the project to GitHub. New Web Service -> select repo.
- Root Directory: backend | Build: npm install | Start: node server.js
- Environment variables: MONGODB_URI, JWT_SECRET, TEACHER_INVITE_CODE
- (Render sets PORT itself.) Test: https://<your-service>.onrender.com/students

### Frontend on Vercel
- Import the same repo. Root Directory: frontend | Framework: Vite
- Environment variable: VITE_API_URL = https://<your-service>.onrender.com
- Deploy, then open https://<your-project>.vercel.app

## API
| Method | URL                  | Auth    | Purpose            |
|--------|----------------------|---------|--------------------|
| POST   | /api/auth/register   | -       | Register teacher   |
| POST   | /api/auth/login      | -       | Teacher login      |
| GET    | /students            | public  | List students      |
| POST   | /students            | teacher | Add student        |
| PUT    | /students/:id        | teacher | Update student     |
| DELETE | /students/:id        | teacher | Delete student     |
