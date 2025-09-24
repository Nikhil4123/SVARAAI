# SvaraAI Task Management System

A full-stack Task & Project Management System built with Next.js 15, React.js, TailwindCSS, Node.js, Express.js, and MongoDB.

## 🚀 Features

- User Authentication (Signup/Login/Logout) with JWT
- Project Management (Create, List, Delete)
- Task Management (Create, Edit, Delete, Filter)
- Kanban-style Board with Drag-and-Drop
- Dashboard with Project and Task Statistics
- Responsive UI with TailwindCSS

## 🏗️ Architecture

### Backend (Express.js + MongoDB)

The backend follows a modular architecture with clear separation of concerns:

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── tests/               # Unit tests
└── server.ts            # Entry point
```

#### Design Principles Applied:

1. **SOLID Principles**:
   - Single Responsibility: Each controller, service, and model has a single purpose
   - Open/Closed: Extensible through middleware and service layers
   - Liskov Substitution: Consistent interface design
   - Interface Segregation: Small, focused interfaces
   - Dependency Inversion: Dependency injection through services

2. **DRY (Don't Repeat Yourself)**:
   - Reusable middleware for authentication
   - Centralized error handling
   - Shared models and interfaces

3. **YAGNI (You Aren't Gonna Need It)**:
   - Implemented only required features
   - Minimal dependencies
   - Focused functionality

### Frontend (Next.js 15 + TailwindCSS)

The frontend follows a component-based architecture:

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── projects/
│   │   └── [id]/
│   └── layout.tsx
├── components/          # Reusable UI components
└── utils/               # Helper functions
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest for backend unit tests

## ▶️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd svara-ai-task-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

## 🧪 Testing

Run backend unit tests:
```bash
cd backend
npm test
```

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── .env
│   ├── package.json
│   └── server.ts
├── svara-ai-task-management/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── projects/
│   │   ├── components/
│   │   └── utils/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🎨 UI Components

Reusable components implemented:
- Authentication forms
- Project cards
- Task cards with priority indicators
- Modals for creating/editing
- Navigation bar
- Dashboard statistics cards

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Environment variables for secrets
- API URLs should be configured through environment variables in production

### Security Best Practices

1. Never commit sensitive files like `.env` to version control
2. Always use strong, randomly generated secrets for JWT
3. Use HTTPS in production
4. Implement rate limiting for API endpoints
5. Validate and sanitize all user inputs
6. Keep dependencies up to date

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your production server:
   ```env
   PORT=5000
   MONGODB_URI=your_production_mongodb_connection_string
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   ```

2. Build the backend:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Set environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-production-api-url.com/api
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

### Hosting Recommendations

- Backend: Deploy on platforms like Heroku, AWS, or DigitalOcean
- Frontend: Deploy on Vercel (optimized for Next.js) or Netlify
- Database: Use MongoDB Atlas for cloud MongoDB hosting

## 📈 Future Enhancements

- Real-time updates with WebSockets
- File attachments for tasks
- User roles and permissions
- Advanced filtering and search
- Dark mode support
- Mobile app version

## 📹 Demo

For a walkthrough of the application, please refer to the demo video included with this submission.