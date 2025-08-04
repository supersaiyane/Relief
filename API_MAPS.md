# API Maps

A reference of all available API endpoints, HTTP methods, and request/response schemas.

| Resource       | Method | Endpoint                      | Request Body                                                                                                                                      | Description                          |
| -------------- | ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Employees**  | GET    | `/employees`                  | —                                                                                                                                                 | List all employees                   |
|                | POST   | `/employees`                  | `{ name, email, employee_code, status_id, manager_id, role_id }`                                                                                  | Create a new employee                |
|                | PUT    | `/employees/:id`              | `{ name, email, employee_code, status_id, manager_id, role_id }`                                                                                  | Update employee by ID                |
|                | DELETE | `/employees/:id`              | —                                                                                                                                                 | Delete employee by ID                |
| **Positions**  | GET    | `/positions`                  | —                                                                                                                                                 | List all positions                   |
|                | POST   | `/positions`                  | `{ req_id, title, client, department, location, salary_range, jd, stakeholder_id, status_id }`                                                     | Create a new position                |
|                | PUT    | `/positions/:req_id`          | `{ title, client, department, location, salary_range, jd, stakeholder_id, status_id, date_closed }`                                               | Update position by requisition ID    |
|                | DELETE | `/positions/:req_id`          | —                                                                                                                                                 | Delete position by requisition ID    |
| **Candidates** | GET    | `/candidates`                 | —                                                                                                                                                 | List all candidates                  |
|                | POST   | `/candidates`                 | `{ candidate_id, position_id, name, email, phone, experience_years, current_company, current_ctc, notice_period, resume_path, submitted_by_id, status_id }` | Create a new candidate               |
|                | PUT    | `/candidates/:id`             | `{ position_id, name, email, phone, experience_years, current_company, current_ctc, notice_period, resume_path, submitted_by_id, status_id }`     | Update candidate by ID               |
|                | DELETE | `/candidates/:id`             | —                                                                                                                                                 | Delete candidate by ID               |
| **Skills**     | GET    | `/skills`                     | —                                                                                                                                                 | List all skills                      |
|                | POST   | `/skills`                     | `{ name }`                                                                                                                                        | Create a new skill                   |
|                | PUT    | `/skills/:id`                 | `{ name }`                                                                                                                                        | Update skill by ID                   |
|                | DELETE | `/skills/:id`                 | —                                                                                                                                                 | Delete skill by ID                   |
| **Uploads**    | POST   | `/upload`                     | `multipart/form-data: file, candidate_id`                                                                                                         | Upload a file, returns file path     |
|                | GET    | `/uploads/:filename`          | —                                                                                                                                                 | Download or view an uploaded file    |

> All JSON responses use standard HTTP status codes.  
> Protected routes (when enabled) require `Authorization: Bearer <token>` header.
