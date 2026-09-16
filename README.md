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
npm start
```

Start the Vite frontend in another terminal:

```sh
cd frontend
npm run dev
```
