# Architectural Decisions

**DATE : 07192025 0910**

This document captures key architecture and technology choices made for the Recruiter Dashboard application.

## 1. Tech Stack

| Tier       | Technology     | Rationale                                          |
|------------|----------------|----------------------------------------------------|
| Front‑end  | React.js       | Component‑based UI, large ecosystem, CRA bootstrap |
| Styling    | Custom CSS     | Flexibility; avoid opinionated frameworks          |
| Back‑end   | Node.js + Express | Lightweight, JavaScript end‑to‑end              |
| Database   | SQLite3        | Embedded, zero‑setup for PoC and small datasets    |
| File Store | Local FS (`/uploads`) | Simple BLOB handling; mounted in Docker     |
| Container  | Docker + Compose | Consistent environments; easy local dev           |

## 2. Data Persistence

- **SQLite3** for relational data (employees, positions, candidates, skills).  
- **Local file system** under `/uploads` for binary (PDFs, images), metadata stored in an `attachments` table.

## 3. Containerization

- **Multi‑stage Dockerfiles** for both UI and API, based on Alpine images:
  1. Build stage (npm install & build)  
  2. Final stage (serve with NGINX for UI; `node index.js` for API)  
- **docker‑compose** binds:
  - `./backend/data.db` → `/app/data.db`  
  - `./backend/uploads` → `/app/uploads`   -> This still needs to come

## 4. API Design

- **REST endpoints** for CRUD on four core resources:  
  - `/employees`, `/positions`, `/candidates`, `/skills`  
- **Bulk CSV upload** tab posts rows to the same endpoints.  
- **File upload** endpoint `/upload` accepts multipart, stores BLOBs or file paths.

## 5. Authentication (Planned)

- **Azure AD (MSAL.js)** on the front end  
- **passport‑azure‑ad** BearerStrategy on the back end  
- Protected API paths under `/employees`, `/positions`, etc.

## 6. Future Considerations

- Migrate from SQLite → PostgreSQL for scale/ACID  
- Replace local FS with S3 (or equivalent) for BLOBs  
- Add CI/CD pipeline (GitHub Actions) for builds, tests, deployments  
- Enhanced error handling, logging, monitoring (APM)  
