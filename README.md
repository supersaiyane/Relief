# Recruitment Dashboard

A full‑stack React + Node.js application for managing employees, positions, candidates and skills—with support for CRUD operations, CSV bulk‑upload, and file attachments.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Folder Structure](#folder-structure)  
5. [Environment Variables](#environment-variables)  
6. [Local Setup (Without Docker)](#local-setup-without-docker)  
7. [Docker Setup](#docker-setup)  
8. [Available Scripts](#available-scripts)  
9. [API Reference](#api-reference)  
10. [Contributing](#contributing)  
11. [License](#license)  

---

## Features

- Tabbed UI: **Admin**, **Interviewer**, **Recruiter**, **Bulk Upload**  
- Full CRUD on **Employees**, **Positions**, **Candidates**, **Skills**  
- Client‑side **filtering** & **sorting** in tables  
- **Modals** for Add/Edit operations  
- **CSV bulk upload** with preview  
- **File attachments** storage in `/uploads`  

---

## Tech Stack

- **Front‑end**: React.js, CSS  
- **Back‑end**: Node.js, Express  
- **Database**: SQLite3  
- **File Storage**: Local FS (`/uploads`)  
- **Containerization**: Docker & Docker Compose  

---

## Prerequisites

- **Node.js** v18+ & **npm** (for local dev)  
- **Docker** & **Docker Compose** (for containerized setup)  

---

## Folder Structure

```
.
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── data.db              # SQLite database
│   ├── initDb.js
│   ├── routes/
│   │   ├── employees.js
│   │   ├── positions.js
│   │   ├── candidates.js
│   │   └── skills.js
│   ├── uploads/             # File attachments
│   ├── seedData.js
│   ├── index.js
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── msalConfig.js    # (planned)
│   └── Dockerfile
├── docker-compose.yml
├── docs/
│   ├── ARCHITECTURAL_DECISIONS.md
│   └── API_MAPS.md
└── README.md
```

---

## Environment Variables

Copy the examples and fill in values:

- **frontend/.env.example**  
  ```env
  PORT=3001
  ```

- **backend/.env.example**  
  ```env
  PORT=3000
  # JWT_SECRET=your_jwt_secret   (for future auth)
  ```

---

## Local Setup (Without Docker)

### 1. Backend

```bash
cd backend
npm install
node initDb.js       # Create tables & seed lookups
node seedData.js     # (Optional) Seed dummy data
npm run dev          # Start on http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start            # Start on http://localhost:3001
```

---

## Docker Setup

From the **project root**:

```bash
docker-compose up --build
```

- **API** → http://localhost:3000  
- **UI**  → http://localhost:3001  

The SQLite `data.db` and `uploads/` folder are mounted as Docker volumes so data persists across restarts.

---

## Available Scripts

### Frontend (in `frontend/`)

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm start`    | Run in development mode        |
| `npm run build`| Build production‑ready bundle  |

### Backend (in `backend/`)

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `npm run dev`  | Run with nodemon on port 3000      |
| `npm start`    | Run production server (node index) |

---

## API Reference

See [docs/API_MAPS.md](./docs/API_MAPS.md) for a complete list of endpoints and request/response schemas.

---

## Contributing

1. Fork the repo  
2. Create a feature branch:  
   ```bash
   git checkout -b feat/your-feature
   ```  
3. Commit your changes:  
   ```bash
   git commit -m "feat: add your feature"
   ```  
4. Push to your branch and open a Pull Request  

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  
