# Applicant Tracking System (ATS)

An enterprise-grade Applicant Tracking System (ATS) featuring role-scoped candidate and recruiter portals, secure candidate resume uploads, a detailed status transition audit trail, and real-time recruiter analytics.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Module Breakdown](#module-breakdown)
- [Role Model and Access Control](#role-model-and-access-control)
- [API Reference](#api-reference)
- [Database Design](#database-design)
- [Security Implementation](#security-implementation)
- [File and Resume Storage](#file-and-resume-storage)
- [Audit Trail](#audit-trail)
- [Exception Handling](#exception-handling)
- [Running Locally](#running-locally)
- [Docker](#docker)

---

## Overview

The platform coordinates job search, application submissions, and recruitment review workflows across three distinct roles: Admin, Recruiter, and Candidate. Candidates browse open jobs, manage their profiles, upload resumes, and track application progress. Recruiters post job listings, view real-time applicant counts, review candidate resumes, and guide applications through a structured candidate pipeline.

The application lifecycle transitions through status states:
`APPLIED → REVIEWING → INTERVIEWING → OFFERED → REJECTED` or `WITHDRAWN`.
Every transition is recorded in an immutable status history audit log. To prevent data corruption, recruiters are restricted from manually withdrawing applications (a candidate-only privilege), and candidate withdrawals are performed as soft status transitions (`WITHDRAWN`) rather than hard database deletes to preserve historical context. If a candidate re-applies to a previously withdrawn position, the system automatically reactivates the application, logs the re-submission event, and updates the resume snapshot.

Authentication uses standard JWT access tokens attached to request headers, supported by custom React guards and Axios interceptors for automatic session expiration management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 / JavaScript (React 18) |
| Backend Framework | Spring Boot 3.4.1 |
| AI Integration | Spring AI (OpenAI & Groq Client Abstraction) |
| Frontend Library | React 18 with Vite |
| Security | Spring Security, JWT (jjwt 0.12.6) |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL 8 |
| Styling | Vanilla CSS (cohesive light/dark theme variables) |
| Build Tool | Maven (Backend) / npm (Frontend) |
| Utilities | Lombok, ModelMapper / MapStruct |
| File Uploads | Multi-part Servlet File Storage (with file type & signature validation) |
| API Documentation | SpringDoc OpenAPI 3 (Swagger UI) |

---

## Architecture

The project is split into a Java Spring Boot backend utilizing standard layered architecture patterns and a Vite-powered React single page application.

```
Application-Tracking-System/
├── backend/
│   └── src/main/java/com/ats/backend/
│       ├── config/         # Security, CORS, Async, and Spring AI configuration
│       ├── controller/     # REST Controllers (Jobs, Applications, Screening, Configs)
│       ├── dto/            # Data Transfer Objects with Bean validation annotations
│       ├── entity/         # JPA Entities mapping relational MySQL tables
│       ├── event/          # Application event publishers and listeners (Async pipeline triggers)
│       ├── exception/      # Global Exception handler mapping custom runtime errors
│       ├── mapper/         # Converters mapping entities to DTOs
│       ├── repository/     # JPA Data repositories with custom JPQL specifications
│       ├── security/       # JWT Token Provider, JwtAuthenticationFilter
│       └── service/        # Interface-backed transaction-enforced services (including AI engines)
├── frontend/
│   └── src/
│       ├── components/     # Reusable layout, modal and card elements (JobCard, SearchBar, ReportModal)
│       ├── context/        # React context wrappers for authentication and themes
│       ├── pages/          # Candidate, Recruiter, and Admin portal dashboards
│       ├── services/       # Interceptor-supported Axios client instance
│       └── index.css       # Premium dynamic design styles and colors
└── docker-compose.yml      # DB service configuration
```

**Request flow:**

```
Client (React Router Guards) → Axios Interceptor (JWT Header)
  → JwtAuthenticationFilter → SecurityContext
  → Controller (@PreAuthorize Role Guard)
  → Service (Transaction Isolation & Candidate/Recruiter Scoping)
  → Repository (Spring Data JPA → MySQL)
  → Save and Flush (Data Integrity Conflict Protection)
  → StatusHistoryRepository (Immutable audit record log)
```

---

## Module Breakdown

### Auth
Handles credentials-based login and registration. Authenticating via `/api/auth/login` returns a JWT token containing roles and scopes. The frontend stores this token and uses a React Context to provide user metadata globally across views.

### Security
`JwtAuthenticationFilter` intercepts incoming requests to parse the JWT and populate the security context. Stateless sessions are enforced. Protected routes on the React frontend redirect unauthenticated visitors or users with mismatching roles to `/unauthorized` or `/login`.

### Job Module
Job postings are stored with statuses (`OPEN`, `CLOSED`). Recruiter queries compute aggregated applicant counts per job utilizing grouped bulk SQL queries (`countByJobIds`) rather than repeating individual per-row queries, resolving N+1 performance bottlenecks. Candidates are filtered at the controller layer and can only search and apply for jobs in the `OPEN` state.

### Application Pipeline
Candidates apply to open positions. If they apply to a job they've already submitted to, a database-level unique constraint catches the action and returns a clean `409 Conflict` response instead of throwing a 500 error. The application handles soft-withdrawals, moving statuses to `WITHDRAWN`, keeping history logs, and allowing candidates to reactivate their application at any time. Recruiters review candidates but cannot manually trigger `WITHDRAWN` transitions.

### File and Resume Storage
Candidates upload resumes which are checked against both file extensions and binary MIME-types (anti-spoofing protection) and saved to a configurable local storage folder. Old files are pruned automatically upon re-upload. Files are served through authenticated streaming controllers which restrict access to the owner candidate, assigned recruiters, or administrators.

### Enterprise AI Resume Screening & Analytics
A production-grade, multi-tenant resume screening module. Key capabilities include:
- **Provider Abstraction**: Allows companies to dynamically select and configure their LLM provider (OpenAI or Groq) using their own API keys, fully isolated by tenant boundaries.
- **Asynchronous Task Queue**: Uses background processing for candidate screening to prevent main-thread request blocking, exposing state-driven loading UI, real-time polling, and failed-job retries.
- **Explainable Multi-Criteria Scoring**: Evaluates candidate resumes on four criteria (Experience, Education, Projects, and Certifications) on a 0-100 scale, with detailed strengths, weaknesses, matched skills, and missing skills.
- **Human-in-the-Loop Recruiter Overrides**: Recruiters can override the AI recommendation, which triggers an audit trail record capturing the override author, timestamp, and mandatory override reason.
- **Version History**: Tracks historical edits of the AI screening report, allowing users to toggle between past analysis versions.
- **Analytics & Cost Auditing**: Centralizes screening volume statistics, match recommendation distributions, average scores, and token usage-based cost estimations (USD) per model/request.

---

## Role Model and Access Control

Four roles are seeded into the database at startup.

| Role | Description |
|---|---|
| `ROLE_ADMIN` | Unrestricted access across the platform. Can edit any jobs, configurations, or application records. |
| `ROLE_COMPANY_ADMIN` | Executive tenant manager. Has access to all recruiter workspace dashboards, job postings, candidate reports, and can configure the company's AI providers, keys, and view cost analytics. |
| `ROLE_RECRUITER` | Create job postings, update statuses of applications, view candidate reports, override AI ratings, and download applicant resumes. |
| `ROLE_CANDIDATE` | Search open positions, upload resumes, submit applications, and withdraw. |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a candidate, recruiter, or admin |
| POST | `/login` | Public | Authenticate — returns JWT token |
| GET | `/me` | Authenticated | Retrieve profile details |

### Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Recruiter, Admin | Post a new job |
| GET | `/` | Authenticated | Query jobs (Paginated, filtered) |
| GET | `/{id}` | Authenticated | Get job details and applicant count |
| PUT | `/{id}` | Recruiter, Admin | Update job details |
| DELETE | `/{id}` | Recruiter, Admin | Delete job |

### Applications — `/api/applications`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/apply/{jobId}` | Candidate | Apply to a job (Unique check + Resume validation) |
| GET | `/me` | Candidate, Admin | List candidate's applications |
| GET | `/job/{jobId}` | Recruiter, Admin | List applications for a job posting |
| PATCH | `/{id}/status` | Recruiter, Admin | Update status (Guarded against `WITHDRAWN`) |
| POST | `/{id}/withdraw` | Candidate, Admin | Soft-withdraw application |
| GET | `/{id}/timeline` | Authenticated | Get chronological status change history |

### Files — `/api/files`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/resume/upload` | Candidate | Upload resume document |
| GET | `/resume/download/{filename}`| Authenticated | Stream resume file securely |

### AI Screening & Analytics — `/api/screening`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/{applicationId}` | Recruiter, Admin | Trigger manual AI screening for an application |
| POST | `/batch/job/{jobId}` | Recruiter, Admin | Trigger batch AI screening for all candidates of a job |
| GET | `/analytics` | Recruiter, Admin | Fetch company AI usage, distributions and cost analytics |
| POST | `/{applicationId}/override` | Recruiter, Admin | Submit manual recruiter recommendation override with audit details |
| GET | `/{applicationId}/history` | Recruiter, Admin | Get full report revision/audit history |

### Company AI Configs — `/api/company-admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/ai-config` | Company Admin | Get the company's active AI provider configuration |
| POST | `/ai-config` | Company Admin | Create or update company AI provider settings and credentials |

---

## Database Design

Structured MySQL database containing key business modules:

```
┌──────────────┐          ┌──────────────┐          ┌────────────────────┐
│    roles     │          │    users     │          │ company_ai_configs │
├──────────────┤1        *├──────────────┤          ├────────────────────┤
│ id           │─────────>│ id           │          │ id                 │
│ role_name    │          │ email        │         1│ company_id (FK)    │
└──────────────┘          │ password     │<─────────│ ai_provider        │
                          │ full_name    │          │ api_key            │
                          │ resume_url   │          │ model_name         │
                          │ company_id   │          └────────────────────┘
                          └──────────────┘
                                 │1
                                 │
                                 │*
┌──────────────┐          ┌──────────────┐          ┌─────────────────────────────┐
│    jobs      │          │ applications │          │ application_status_history  │
├──────────────┤1        *├──────────────┤1        *├─────────────────────────────┤
│ id           │─────────>│ id           │─────────>│ id                          │
│ title        │          │ candidate_id │          │ application_id              │
│ company      │          │ job_id       │          │ previous_status             │
│ status       │          │ status       │          │ new_status                  │
│ recruiter_id │          │ resume_url   │          │ changed_by_id               │
└──────────────┘          └──────────────┘          │ note                        │
                                 │1                 └─────────────────────────────┘
                                 │
                                 │1
                          ┌────────────────────────┐
                          │  ai_screening_results  │
                          ├────────────────────────┤
                          │ id                     │
                          │ application_id (FK)    │
                          │ overall_score          │
                          │ recommendation         │
                          │ model_name             │
                          │ cost_estimation        │
                          └────────────────────────┘
```

### Tables

*   **roles**: `id`, `role_name`
*   **companies**: `id`, `name`, `domain`, `hiring_preferences`, `created_at`, `updated_at`
*   **users**: `id`, `full_name`, `email`, `password`, `enabled`, `resume_url`, `created_at`, `updated_at`, `role_id`, `company_id`
*   **jobs**: `id`, `title`, `company_name`, `location`, `description`, `employmentType`, `experienceRequired`, `salaryRange`, `status`, `recruiter_id`, `created_at`, `updated_at`
*   **applications**: `id`, `candidate_id`, `job_id`, `status`, `resume_url`, `created_at`, `updated_at`
*   **application_status_history**: `id`, `application_id`, `previous_status`, `new_status`, `changed_by_id`, `note`, `created_at`
*   **company_ai_configs**: `id`, `company_id`, `ai_provider`, `api_key`, `model_name`, `resume_analysis_prompt`, `temperature`, `max_tokens`, `enabled`, `created_at`, `updated_at`
*   **ai_screening_results**: `id`, `application_id`, `overall_score`, `experience_score`, `education_score`, `projects_score`, `certifications_score`, `recommendation`, `raw_json_response`, `prompt_version`, `model_name`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `cost_estimation`, `screened_at`
*   **ai_screening_strengths**: `screening_result_id`, `strength`
*   **ai_screening_weaknesses**: `screening_result_id`, `weakness`
*   **ai_screening_matched_skills**: `screening_result_id`, `matched_skill`
*   **ai_screening_missing_skills**: `screening_result_id`, `missing_skill`

---

## Security Implementation

*   **Stateless JWT Security**: Spring Security is configured with stateless sessions. Requests are validated on-the-fly using interceptors.
*   **Resource Access Boundary**: The system validates that recruiters can only update status or list applicants for jobs they originally posted. Candidates can only withdraw and read their own applications.
*   **Authenticated Document Serving**: Resumes are kept outside of public directories. To download or view, requests must go through the authenticated `FileController` which checks authorization before copying binary streams to responses.
*   **Sorting Guard**: The system validates sorting criteria parameters against a strict whitelist of fields (`id`, `createdAt`, `updatedAt`, `status`) to block SQL injection attempts.

---

## File and Resume Storage

*   **Double Validation Safeguard**: The system reads the byte headers of files (magic numbers) and checks extensions before writing to disk, blocking uploads of executable scripts masquerading as documents.
*   **Cleanup Trigger**: To save disk space, upload of a new resume searches for the previously stored resume path and deletes it from local storage.
*   **Relative Paths & Environment Separation**: The storage path resolves relative to the server host location but can be overwritten dynamically in `application.properties` via `ats.upload.dir`.

---

## Audit Trail

*   Every time an application transitions status (creation, review, interview scheduling, offer, reject, withdrawal, or reactivation), a row is added to the `application_status_history` table.
*   The log record stores `previous_status`, `new_status`, the reference to the user performing the change, and an explanatory note.
*   Candidates and Recruiters can view a chronological visual timeline of these changes directly in their dashboards.

---

## Exception Handling

The `GlobalExceptionHandler` maps application failures to unified JSON `ApiResponse` objects:

| Exception Class | HTTP Status | Detail Message |
|---|---|---|
| `ResourceNotFoundException` | 404 Not Found | Item was not found |
| `JobNotFoundException` | 404 Not Found | Job posting does not exist |
| `InvalidRequestException` | 400 Bad Request | Invalid parameter input / unauthorized state change |
| `ConflictException` | 409 Conflict | Duplicate entries (e.g. re-applying) |
| `PropertyReferenceException` | 400 Bad Request | Sort property is invalid |
| General `Exception` | 500 Server Error | Unknown runtime error |

---

## Running Locally

### Prerequisites
*   Java 21 JDK
*   Maven 3.x
*   Node.js 18+ & npm
*   Docker (for running MySQL)

### 1. Run the MySQL Database
Start the pre-configured MySQL instance using Docker Compose:
```bash
docker compose up -d
```

### 2. Start the Backend API
Navigate to the `backend` directory, download packages, and run the Spring Boot application:
```bash
cd backend
./mvnw spring-boot:run
```
*The API server will listen on `http://localhost:8080`.*

### 3. Start the Frontend App
Navigate to the `frontend` directory, install packages, and launch the dev environment:
```bash
cd frontend
npm install
npm run dev
```
*The development server will open on `http://localhost:5173`.*

---

## Docker

If you wish to containerize the application, you can build images using the Dockerfiles included in the directories.

### Build and run the database and backend:
```bash
# Build package using Maven
cd backend
./mvnw clean package -DskipTests

# Build local docker image
docker build -t ats-backend .

# Run container linked to host network
docker run -d -p 8080:8080 --name ats-api \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/ats_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=rootpassword \
  ats-backend
```
