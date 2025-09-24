# Postman Collection for SvaraAI Task Manager API

This directory contains Postman collection and environment files to help you test the SvaraAI Task Manager API.

## Files Included

1. `SvaraAI_Task_Manager_API.postman_collection.json` - The main Postman collection with all API endpoints
2. `SvaraAI_Task_Manager_Environment.postman_environment.json` - Environment variables for the API
3. `POSTMAN_INSTRUCTIONS.md` - This instruction file

## How to Use

### 1. Import the Collection and Environment

1. Open Postman
2. Click on "Import" in the top left corner
3. Select the two JSON files:
   - `SvaraAI_Task_Manager_API.postman_collection.json`
   - `SvaraAI_Task_Manager_Environment.postman_environment.json`
4. Click "Import"

### 2. Set Up the Environment

1. In Postman, click on the environment dropdown (top right)
2. Select "SvaraAI Task Manager Environment"
3. Click the eye icon to view variables
4. You can update the baseUrl if needed (default is http://localhost:5000)

### 3. Testing the API

#### Step 1: Register a User
1. Go to the "Auth" folder in the collection
2. Select "Register User"
3. Click "Send"
4. You should receive a success response

#### Step 2: Login to Get Token
1. Select "Login User" under the "Auth" folder
2. Click "Send"
3. Copy the token from the response

#### Step 3: Set the Token in Environment
1. Click on the eye icon next to the environment dropdown
2. Click "Edit" next to "SvaraAI Task Manager Environment"
3. Paste the token in the "CURRENT VALUE" field for the "token" variable
4. Click "Update"

#### Step 4: Test Project Endpoints
1. Go to the "Projects" folder
2. Test "Create Project" first to get a project ID
3. After creating a project, copy the project ID from the response
4. Update the "projectId" variable in the environment with this ID
5. Test other project endpoints

#### Step 5: Test Task Endpoints
1. Go to the "Tasks" folder
2. Test "Create Task" first to get a task ID
3. After creating a task, copy the task ID from the response
4. Update the "taskId" variable in the environment with this ID
5. Test other task endpoints

## API Endpoints Overview

### Auth
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Projects
- POST `/api/projects` - Create a new project
- GET `/api/projects` - Get all projects
- GET `/api/projects/:id` - Get a specific project
- PUT `/api/projects/:id` - Update a project
- DELETE `/api/projects/:id` - Delete a project

### Tasks
- POST `/api/tasks` - Create a new task
- GET `/api/tasks/project/:projectId` - Get tasks for a project
- GET `/api/tasks/:id` - Get a specific task
- PUT `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task
- PUT `/api/tasks/:id/assign` - Assign a task to a user
- GET `/api/tasks/assignee/:userId` - Get tasks assigned to a user

### Users
- GET `/api/users` - Get all users

## Notes

1. Make sure the backend server is running on `http://localhost:5000`
2. Make sure MongoDB is running and connected
3. Always update environment variables with actual values from API responses
4. The token expires after some time, so you may need to login again