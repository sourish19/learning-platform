# Personal Learning Platform

A mini backend built with **Bun**, **Elysia**, and **PostgreSQL** that allows users to submit course problems and track their course progress.

## Tech Stack

- Bun
- Elysia
- TypeScript
- PostgreSQL
- Docker Compose
- pg

## Folder Structure

```text
learning-platform/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── submitController.ts
│   │   └── progressController.ts
│   ├── db/
│   │   └── schema.sql
│   └── index.ts
├── .env
├── docker-compose.yml
├── package.json
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd learning-platform
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run the schema

```bash
docker exec -i learning-pg psql -U admin -d learning_platform < src/db/schema.sql
```

### 5. Configure environment variables

Create a `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=learning_platform
PORT=3000
```

### 6. Start the server

```bash
bun run dev
```

Server runs on:

```text
http://localhost:3000
```

## API Endpoints

### Submit Problem

**POST** `/submit`

Request Body:

```json
{
  "user_id": 1,
  "problem_id": 3
}
```

Response:

```json
{
  "status": 200,
  "message": "Problem submitted successfully"
}
```

---

### Get User Progress

**GET** `/progress?user_id=1`

Response:

```json
[
  {
    "course": "JavaScript",
    "completion_percentage": "66.67"
  }
]
```

## Concepts Demonstrated

- PostgreSQL Transactions
- SQL Joins
- Relational Database Design
- Progress Tracking