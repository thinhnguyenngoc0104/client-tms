# TaskFlow - Jira-like Project Management SPA

A modern, responsive Single Page Application (SPA) built with React that provides Jira-like project management functionality with Auth0 authentication.

## Features

- **Authentication**: Secure Auth0 integration with JWT token handling
- **Project Management**: Create, view, and manage projects
- **Kanban Board**: Drag-and-drop task management with TODO/DOING/DONE columns
- **Task Management**: Create, edit, and track tasks with priorities and assignments
- **User Management**: User profiles and role-based access
- **Responsive Design**: Professional Atlassian-inspired UI

## Tech Stack

- **Frontend**: React 19, React Router, React DnD
- **Authentication**: Auth0 React SDK
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: CSS with CSS Variables

## Data Models

### User
- `id`: Unique identifier
- `name`: User's full name
- `email`: User's email address
- `role`: User role (admin, user, etc.)

### Project
- `id`: Unique identifier
- `name`: Project name
- `description`: Project description
- `owner_id`: Reference to User who owns the project
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Task
- `id`: Unique identifier
- `title`: Task title
- `description`: Task description
- `status`: Task status (todo, doing, done)
- `priority`: Task priority (low, medium, high)
- `assignee_id`: Reference to assigned User
- `project_id`: Reference to parent Project
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Prerequisites

- Node.js 18+ and npm
- Auth0 account and application setup
- Backend API with the following endpoints:
  - `GET /api/auth/profile` - Get user profile from JWT token
  - `GET /api/auth/verify` - Verify token validity
  - Standard CRUD endpoints for projects, tasks, and users

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client-tms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Auth0 and API configuration:
   ```env
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   REACT_APP_AUTH0_AUDIENCE=your-api-identifier
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```

4. **Auth0 Configuration**
   - Create an Auth0 application (Single Page Application)
   - Configure allowed callback URLs: `http://localhost:5173`
   - Configure allowed logout URLs: `http://localhost:5173`
   - Configure allowed web origins: `http://localhost:5173`
   - Enable the Auth0 Management API if needed

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```
