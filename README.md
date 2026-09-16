# SakayMoto

SakayMoto has separate frontend and backend Node.js applications.

## Requirements

- Node.js 22.18.x or 24.12+
- npm
- MySQL

## Setup after cloning or pulling

Install dependencies in both applications:

```sh
cd frontend
npm ci

cd ../backend
npm ci
```

Create the backend environment file:

```sh
cd backend
copy .env.example .env
```

Edit `backend/.env` with the local MySQL connection details and a JWT secret. The `.env` file is intentionally ignored by Git and must be created separately on each computer.

## Run the applications

Start the backend in one terminal:

```sh
cd backend
npm run dev
```

Start the Vite frontend in another terminal:

```sh
cd frontend
npm run dev
```

The frontend uses `http://localhost:3000/api` by default. To use another backend URL, create `frontend/.env.local` with:

```env
VITE_API_URL=http://localhost:3000/api
```

## What Git does not include

`node_modules`, build output, log files, and environment files are ignored. Git also does not preserve empty directories. These items must be recreated locally with the setup steps above.
