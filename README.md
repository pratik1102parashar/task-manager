# 📜 Task Management API 

A simple, secure, and containerized backend REST API built with **TypeScript**, **Express**, **TypeORM**, and **MySQL**, designed for managing personal tasks with user authentication and clean architecture principles.

---

## 📆 Tech Stack

* **Language**: TypeScript
* **Framework**: Express.js
* **ORM**: TypeORM
* **Database**: MySQL
* **Auth**: JWT (with password hashing)
* **Containerization**: Docker + Docker Compose

---

## 🚀 Features

* 🔐 User Registration & Login (JWT-based auth)
* 🔐 Password hashing with validation
* ✅ Task CRUD (title, description, status, due date)
* 👭 Ownership-based access control (users manage only their own tasks)
* 🗑️ Soft Delete (tasks are not permanently removed)
* ✅ Liveness Check: `/health`
* ⚖️ Configurable via `.env`
* 🐳 Dockerized (App + MySQL)

---

## 🛠️ Project Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
PORT=3000

DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=Pratik@25(can be change as  yours)
DB_NAME=task_manager_db

JWT_SECRET=pppratik
```

### 3. Run with Docker

```bash
docker compose up --build
```

App: [http://localhost:3000](http://localhost:3000)
Health Check: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧪 API Overview

### 🔐 Auth Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register user     |
| POST   | `/api/auth/login`    | Login and get JWT |

### ✅ Task Routes (Auth Required)

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/api/tasks`     | Create task         |
| GET    | `/api/tasks`     | List your tasks     |
| GET    | `/api/tasks/:id` | Get a specific task |
| PUT    | `/api/tasks/:id` | Update a task       |
| DELETE | `/api/tasks/:id` | Soft-delete a task  |

---

## 🧱 Architecture Decisions

* **Modular structure**: Separation of concerns across controllers, services, and routes.
* **TypeORM**: Used for database modeling and easy integration with MySQL.
* **Soft delete**: Handled via TypeORM’s `@DeleteDateColumn`.
* **Environment-based config**: Cloud-ready with `.env` support.
* **Docker**: Ensures consistent local development and production parity.

---

## 📄 API Documentation

OpenAPI (OAS3) spec will be available in `docs/` (or integrate Swagger later).

---

## 🐳 Useful Docker Commands

```bash
# Stop and remove containers, networks, volumes
docker compose down -v

# Rebuild and start fresh
docker compose up --build
```

---

## ⚠️ Not Implemented

* 💪 Basic Integration/API Test (e.g. with supertest)

---

## 📬 Contact

Built by **Pratik Parashar**
