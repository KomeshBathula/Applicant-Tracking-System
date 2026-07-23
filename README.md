# Applicant Tracking System (ATS)

An enterprise-grade Applicant Tracking System built with Java 21, Spring Boot 3, and React 18. The platform provides multi-tenant recruitment management, role-based access control, Instagram-style unique handle validation, multi-provider AI resume screening, and automated candidate pipeline tracking.

---

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Role Hierarchy and Permissions](#role-hierarchy-and-permissions)
- [Multi-Provider AI Screening Engine](#multi-provider-ai-screening-engine)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Security & Access Control](#security--access-control)
- [Installation and Setup](#installation-and-setup)

---

## Features

### Authentication & User Identity
- **Role-Scoped Login Interfaces**: Dedicated entry points for Candidates and Recruiters (`/login`), Company Admins (`/company-admin/login`), and System Admins (`/super-admin/login`).
- **Unique Username Handles**: Instagram-style unique handle format (`@username`) validated in real time during registration with enforced database uniqueness constraints.
- **Password Complexity Enforcement**: Password requirements (`>= 8` characters, 1 uppercase letter, 1 number, 1 special character) applied across candidate sign-up, admin creation, recruiter provisioning, and password updates.
- **First-Time Password Reset Workflow**: Newly provisioned Company Admins and Recruiters receive default credentials and are prompted to set a new password on their initial login.

### Enterprise Admin & Team Management
- **System Admin Control Center**: Global user directory with server-side Spring Data JPA pagination, search, role filters, and status management (`Disable`/`Enable`). Includes self-protection rules to prevent administrators from locking their own accounts.
- **Company Provisioning**: System Admins can create Company Admin accounts and link or generate company entities.
- **Recruiter Management**: Company Admins can provision, monitor, and toggle status for recruiters within their organization.

### Candidate Application Pipeline
- **Job Board & Postings**: Searchable job listings filtered by employment type, experience level, and location.
- **Application Tracking**: Structured lifecycle state transitions (`APPLIED` → `REVIEWING` → `INTERVIEWING` → `OFFERED` → `REJECTED` / `WITHDRAWN`).
- **Application Reactivation**: Automatic application reactivation and state history logging for candidates re-applying to previously withdrawn positions.
- **Resume Upload & Validation**: Double-validation file inspection (MIME magic bytes and file extension) with automated disk pruning upon re-upload.

---

## System Architecture

The application is structured into a Java Spring Boot backend and a React single-page application frontend.

```
Application-Tracking-System/
├── backend/
│   └── src/main/java/com/ats/backend/
│       ├── config/         # Security, CORS, Async, and Spring AI configuration
│       ├── controller/     # REST Endpoints (Admin, CompanyAdmin, Auth, Jobs, Applications, Screening)
│       ├── dto/            # Data Transfer Objects with Bean Validation constraints
│       ├── entity/         # JPA Entities mapping relational MySQL tables
│       ├── exception/      # Global Exception Handler
│       ├── mapper/         # Entity-to-DTO conversion logic
│       ├── repository/     # Spring Data JPA Repositories with custom JPQL queries
│       ├── security/       # JWT Token Provider and JwtAuthenticationFilter
│       └── service/        # Business logic and AI Provider implementations
└── frontend/
    └── src/
        ├── components/     # Layout, modal, and navigation components
        ├── context/        # React context providers for authentication state
        ├── pages/          # Candidate, Recruiter, Company Admin, and Admin dashboards
        ├── services/       # Axios client with interceptors for JWT and error handling
        └── index.css       # Design tokens and global styles
```

---

## Role Hierarchy and Permissions

The platform enforces a four-tier permission hierarchy:

| Role | Access Scope & Responsibilities |
|---|---|
| `ROLE_ADMIN` | **System Administrator**: Full platform governance, Company Admin provisioning, scalable paginated user management, self-protected status controls, and system policy configuration. |
| `ROLE_COMPANY_ADMIN` | **Enterprise Admin**: Recruiter provisioning and management, company job posting oversight, and AI screening configuration for the organization. |
| `ROLE_RECRUITER` | **Hiring Manager**: Job posting management, applicant resume review, interview scheduling, pipeline status updates, and AI evaluation report access. |
| `ROLE_CANDIDATE` | **Job Applicant**: Candidate profile management, job searching, application submission, resume management, and application withdrawal. |

---

## Multi-Provider AI Screening Engine

The AI screening system evaluates candidate resumes against job descriptions through an abstraction layer supporting five Large Language Model providers:

- **OpenAI**: Models `gpt-4o`, `gpt-3.5-turbo`
- **Groq**: Models `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`
- **Anthropic Claude**: Models `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`
- **Google Gemini**: Models `gemini-1.5-pro`, `gemini-1.5-flash`
- **DeepSeek**: Models `deepseek-chat`, `deepseek-coder`

### Key Capabilities
- **Configurable Parameters**: Company Admins configure AI provider selection, API credentials, temperature, response token limits, and scoring system prompts per tenant.
- **Multi-Dimensional Scoring**: Evaluates candidate resumes across Experience, Education, Projects, and Certifications (0–100 scale), generating strengths, weaknesses, matched skills, and missing skills.
- **Recruiter Overrides & Audit Log**: Allows recruiters to submit manual score overrides, recording the reviewer ID, timestamp, and justification note.

---

## Tech Stack

| Domain | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 3.4.1, Spring Data JPA, Spring Security, Spring AI |
| **Frontend** | React 18, Vite, Vanilla CSS (CSS custom properties, dark theme tokens) |
| **Database** | MySQL 8 |
| **Security** | JWT (jjwt 0.12.6), BCrypt Password Encoder |
| **Build Tools** | Maven (Backend), npm & Vite (Frontend) |
| **Documentation** | SpringDoc OpenAPI 3 (Swagger UI) |

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a candidate account |
| POST | `/login` | Public | Authenticate user and issue JWT token |
| GET | `/check-username` | Public | Verify username availability |
| GET | `/me` | Authenticated | Fetch current user profile |
| POST | `/change-password` | Authenticated | Change user password |

### System Administration — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/company-admins` | System Admin | Provision a new Company Admin and company record |
| GET | `/users` | System Admin | Paginated user directory search and role filtering |
| PATCH | `/users/{userId}/status` | System Admin | Enable or disable a user account |

### Company Administration — `/api/company-admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/recruiters` | Company Admin | Provision a recruiter account |
| GET | `/recruiters` | Company Admin | Paginated recruiter directory for the company |
| PATCH | `/recruiters/{userId}/status` | Company Admin | Enable or disable a recruiter account |
| GET | `/ai-config` | Company Admin | Fetch active company AI screening configuration |
| POST | `/ai-config` | Company Admin | Update AI provider, credentials, and parameters |

### Job Management — `/api/jobs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Recruiter, Admin | Create a new job listing |
| GET | `/` | Authenticated | List and search job postings |
| GET | `/{id}` | Authenticated | Retrieve job posting details |
| PUT | `/{id}` | Recruiter, Admin | Update job listing details |
| DELETE | `/{id}` | Recruiter, Admin | Delete a job listing |

### Candidate Applications — `/api/applications`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/apply/{jobId}` | Candidate | Submit application with resume validation |
| GET | `/me` | Candidate, Admin | Retrieve applications for current candidate |
| GET | `/job/{jobId}` | Recruiter, Admin | Retrieve applications submitted to a job |
| PATCH | `/{id}/status` | Recruiter, Admin | Update candidate application status |
| POST | `/{id}/withdraw` | Candidate, Admin | Soft-withdraw an application |
| GET | `/{id}/timeline` | Authenticated | Retrieve application status transition log |

---

## Database Schema

```
┌──────────────┐          ┌──────────────┐          ┌────────────────────┐
│    roles     │          │    users     │          │ company_ai_configs │
├──────────────┤1        *├──────────────┤          ├────────────────────┤
│ id           │─────────>│ id           │          │ id                 │
│ role_name    │          │ username (UQ)│         1│ company_id (FK)    │
└──────────────┘          │ email (UQ)   │<─────────│ ai_provider        │
                          │ password     │          │ api_key            │
                          │ full_name    │          │ model_name         │
                          │ company_id   │          └────────────────────┘
                          └──────────────┘
                                 │1
                                 │*
┌──────────────┐          ┌──────────────┐          ┌─────────────────────────────┐
│    jobs      │          │ applications │          │ application_status_history  │
├──────────────┤1        *├──────────────┤1        *├─────────────────────────────┤
│ id           │─────────>│ id           │─────────>│ id                          │
│ title        │          │ candidate_id │          │ application_id              │
│ company      │          │ job_id       │          │ previous_status             │
│ status       │          │ status       │          │ new_status                  │
│ recruiter_id │          │ resume_url   │          │ changed_by_id               │
└──────────────┘          └──────────────┘          └─────────────────────────────┘
```

---

## Security & Access Control

- **Stateless Authentication**: Requests are validated via `JwtAuthenticationFilter` with stateless Spring Security session management.
- **Parameter Validation & Whitelisting**: Sort fields are validated against an allowed set (`createdAt`, `fullName`, `username`, `email`, `id`) to prevent property injection attacks.
- **Resource Ownership Constraints**: Recruiters can only modify jobs and review applicants associated with their organization. Candidates can only access their own profile and application records.
- **Data Integrity Protection**: Unique constraints handle duplicate applications and registration collisions cleanly without unhandled server errors.

---

## Installation and Setup

### Prerequisites
- Java 21 JDK
- Maven 3.8+
- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Database Setup
Launch the MySQL database container:
```bash
docker compose up -d
```

### 2. Backend Service
Build and run the Spring Boot API:
```bash
cd backend
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### 3. Frontend Application
Install dependencies and run the development server:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.
