# SvaraAI Task Management System

A full-stack Task & Project Management System built with Next.js 15, React.js, TailwindCSS, Node.js, Express.js, and MongoDB.

## 📋 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [UI Components](#-ui-components)
- [Security](#-security)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)

## 🚀 Features

### User Management
- User Registration with email and password
- Secure Login/Logout functionality
- JWT-based authentication system

### Project Management
- Create new projects with name, description, dates, and status
- View all projects in a responsive grid layout
- Delete existing projects
- Project status tracking (Planning, Active, Completed, On Hold)

### Task Management
- Create tasks with title, description, priority, deadline, and assignee
- Edit existing tasks
- Delete tasks
- Assign tasks to users
- Filter tasks by assignee

### Dashboard & UI
- Responsive design that works on all devices
- Kanban-style board with drag-and-drop functionality
- Dashboard with project and task statistics
- Intuitive navigation and user experience

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
│   └── server.ts        # Entry point
├── tests/               # Unit tests
└── package.json         # Dependencies
```

### Frontend (Next.js 15 + TailwindCSS)
The frontend follows a component-based architecture:

```
svara-ai-task-management/
├── src/
│   ├── app/             # Page components and routing
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard page
│   │   └── projects/    # Projects pages
│   ├── components/      # Reusable UI components
│   └── app/apiService.ts # API service layer
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Built-in validation

### Development Tools
- **Package Manager**: npm
- **Testing**: Jest for backend unit tests
- **IDE**: VS Code
- **Version Control**: Git

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Git (for version control)

## 📥 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
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

3. Create a `.env` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── middleware/      # Authentication middleware
│   │   │   └── auth.middleware.ts
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Project.ts
│   │   │   ├── Task.ts
│   │   │   └── User.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── user.routes.ts
│   │   └── server.ts        # Entry point
│   ├── tests/               # Unit tests
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
├── svara-ai-task-management/
│   ├── src/
│   │   ├── app/             # Page components and routing
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── apiService.ts # API service layer
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── TaskCard.tsx
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   └── tailwind.config.js   # TailwindCSS configuration
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks/project/:projectId` - Get tasks for a project
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/assign` - Assign a task to a user
- `GET /api/tasks/assignee/:assigneeId` - Get tasks assigned to a user

### Users
- `GET /api/users` - Get all users

## 🧪 Testing

### Backend Unit Tests
Run backend unit tests:
```bash
cd backend
npm test
```

Test coverage includes:
- User controller tests
- Project controller tests
- Task controller tests
- Task assignment controller tests

## 🎨 UI Components

### Authentication Components
- Login form with email/password validation
- Registration form with name/email/password validation

### Project Components
- Project cards with status indicators
- Project creation modal with form validation
- Project deletion confirmation

### Task Components
- Task cards with priority indicators (High, Medium, Low)
- Task creation/editing modal
- Task assignment dropdown
- Task deletion confirmation

### Common Components
- Responsive navigation bar
- Dashboard statistics cards
- Interactive buttons with hover effects
- Modals for forms and confirmations
- Loading skeletons for better UX

## 🔐 Security

### Authentication & Authorization
- Password hashing with bcrypt
- JWT-based authentication with secure storage
- Protected routes with authentication middleware
- Role-based access control

### Data Protection
- Environment variables for sensitive configuration
- Input validation and sanitization
- Secure HTTP headers
- API rate limiting (implementation recommended)

### Best Practices Implemented
- ✅ Never commit sensitive files like `.env` to version control
- ✅ Strong, randomly generated secrets for JWT
- ✅ HTTPS usage recommended for production
- ✅ Input validation on both frontend and backend
- ✅ Dependency updates for security patches

## ☁️ Deployment

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

- **Backend**: Deploy on platforms like Heroku, AWS EC2, or DigitalOcean
- **Frontend**: Deploy on Vercel (optimized for Next.js) or Netlify
- **Database**: Use MongoDB Atlas for cloud MongoDB hosting

## 🔮 Future Enhancements

### Feature Improvements
- [ ] Real-time updates with WebSockets
- [ ] File attachments for tasks
- [ ] User roles and permissions (Admin, Manager, Member)
- [ ] Advanced filtering and search capabilities
- [ ] Dark mode support
- [ ] Task comments and activity logs
- [ ] Project timelines and Gantt charts

### Technical Improvements
- [ ] Implement API rate limiting
- [ ] Add comprehensive error handling
- [ ] Improve test coverage
- [ ] Add end-to-end testing
- [ ] Implement caching mechanisms
- [ ] Add logging and monitoring

### UI/UX Enhancements
- [ ] Mobile app version (React Native)
- [ ] Keyboard shortcuts for power users
- [ ] Customizable dashboard widgets
- [ ] Improved drag-and-drop functionality
- [ ] Export data to CSV/PDF

## 📹 Demo

For a walkthrough of the application, please refer to the demo video included with this submission.

## 📞 Support

For support, please contact the development team or open an issue in the repository.