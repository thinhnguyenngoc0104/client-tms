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
   Download .env from [.env](https://drive.google.com/file/d/1av6a_T_lsWDUPHb5e3jFNQO--qVQUTAm/view?usp=drive_link)

5. **Start the local development server**
   ```bash
   npm run dev
   ```
