# Local Service Finder

Local Service Finder is a MERN stack platform that connects customers with local service providers. The initial setup includes a structured React frontend, a basic Express backend, and room for admin moderation and role-based workflows.

## Features

- User authentication planned
- Service listing
- Search functionality
- Role-based system for Customer, Provider, and Admin

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MongoDB

## Folder Structure

- `frontend/` contains the React app, organized into reusable components, pages, layouts, services, context, and hooks.
- `backend/` contains the Express server, route files, and future MongoDB models, controllers, and config.

## Setup Instructions

### Clone repo

```bash
git clone <repo-link>
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### Backend setup

```bash
cd backend
npm install
node server.js
```

## Environment Variables

Create a `.env` file in `backend/` and add:

- `MONGO_URI=your_mongodb_connection_string`
- `PORT=5000`

## Project Status

🚧 In Development (Initial Setup)
