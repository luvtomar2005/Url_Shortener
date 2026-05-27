# Production-Oriented URL Shortener Backend

A production-oriented backend system built using Node.js, Express.js, and MongoDB focused on learning real backend engineering concepts beyond basic CRUD operations.

This project is not designed as a tutorial-level URL shortener clone. The primary goal is to understand:

* Backend architecture
* Middleware lifecycle
* Request tracing
* Structured logging
* Centralized error handling
* Validation pipelines
* Security layers
* Scalability thinking
* Observability
* Runtime debugging
* Production failure handling

The frontend layer will be integrated later.

---

# Overview

This backend service allows users to:

* Create shortened URLs
* Use custom aliases
* Redirect shortened URLs
* Track analytics events
* Handle errors consistently
* Validate incoming requests
* Protect APIs using production-oriented middleware
* Log request lifecycle data using structured logs

The project architecture follows a layered backend structure:

```txt
Routes → Middleware → Controllers → Services → Database
```

Instead of putting everything inside controllers, responsibilities are separated properly to improve:

* maintainability
* scalability
* debugging
* testing
* architectural clarity

---

# Current Features

## Core Features

* URL shortening
* Custom aliases
* Redirect handling
* Analytics tracking foundation

## Backend Engineering Features

* Request tracing using request IDs
* Structured logging using Pino
* Centralized error handling
* Async error wrappers
* Validation middleware using Joi
* Security middleware
* Rate limiting
* Payload size limiting
* HPP protection
* Environment variable management
* Layered backend architecture

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Validation & Security

* Joi
* Helmet
* express-rate-limit
* HPP

## Logging & Utilities

* Pino
* pino-pretty
* NanoID
* dotenv

---

# Backend Architecture

The backend follows a layered architecture pattern.

```txt
Client Request
      ↓
Security Middleware
      ↓
Request Logger
      ↓
Validation Middleware
      ↓
Controller Layer
      ↓
Service Layer
      ↓
Database Layer
      ↓
Response
```

---

# Why This Architecture?

Most beginner projects place all logic inside route handlers.

That approach becomes difficult to:

* debug
* scale
* test
* maintain
* extend

This project separates responsibilities intentionally.

## Routes

Responsible only for:

* endpoint definitions
* middleware chaining
* controller mapping

## Controllers

Responsible for:

* request/response handling
* extracting request data
* sending responses

## Services

Responsible for:

* business logic
* reusable backend operations
* database interaction orchestration

## Middleware

Responsible for:

* validation
* security
* logging
* request tracing
* centralized error handling

---

# Request Lifecycle Flow

Example:

```http
POST /api/shorten
```

Request execution flow:

```txt
Incoming Request
      ↓
Helmet Security Headers
      ↓
Body Parser
      ↓
Rate Limiter
      ↓
Request ID Middleware
      ↓
Request Logger Middleware
      ↓
Validation Middleware
      ↓
Controller
      ↓
Service Layer
      ↓
MongoDB
      ↓
Response Returned
      ↓
Response Logged
```

---

# Project Structure

```txt
Backend/
│
├── src/
│   ├── config/
│   │   ├── logger.js
│   │   └── mongo.js
│   │
│   ├── constants/
│   │   └── reservedAliases.js
│   │
│   ├── controllers/
│   │   └── url_controllers.js
│   │
│   ├── middlewares/
│   │   ├── error_middleware.js
│   │   ├── requestId.js
│   │   ├── requestLogger.js
│   │   ├── validate.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   ├── url_model.js
│   │   └── analytics_model.js
│   │
│   ├── routes/
│   │   ├── urlRoutes.js
│   │   ├── url_redirectRoutes.js
│   │   └── analytics_routes.js
│   │
│   ├── service/
│   │   ├── url_service.js
│   │   ├── redirect_service.js
│   │   └── analytics_service.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   └── ApiError.js
│   │
│   ├── validations/
│   │   └── urlValidation.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# API Endpoints

## Create Short URL

```http
POST /api/shorten
```

### Request Body

```json
{
  "originalUrl": "https://www.google.com"
}
```

### Optional Custom Alias

```json
{
  "originalUrl": "https://www.google.com",
  "customAlias": "google"
}
```

### Response

```json
{
  "success": true,
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123"
}
```

---

## Redirect Short URL

```http
GET /:shortCode
```

Example:

```http
GET /abc123
```

Redirects user to:

```txt
https://www.google.com
```

---

## Health Check

```http
GET /health
```

### Response

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

# Middleware Pipeline

The middleware chain is intentionally structured.

## Security First

```js
app.use(helmet())
```

Adds security headers.

---

## Request Parsing

```js
app.use(express.json())
```

Parses JSON request bodies.

---

## Rate Limiting

```js
app.use(apiLimiter)
```

Protects APIs from abuse and brute-force traffic.

---

## Request ID Middleware

Assigns a unique request ID to every request.

Useful for:

* tracing requests
* debugging production issues
* correlating logs

---

## Request Logger Middleware

Logs:

* method
* route
* status code
* response time
* IP address

using structured logs.

---

## Validation Middleware

Validates incoming request bodies using Joi.

Invalid requests never reach controllers.

---

## Centralized Error Middleware

Handles:

* operational errors
* unexpected runtime errors
* response formatting
* production-safe error responses

---

# Error Handling Architecture

The project uses centralized error handling.

Instead of:

```js
try {

} catch(err) {

}
```

inside every controller,

errors are forwarded to a single global middleware.

---

# AppError

Custom error class used for operational errors.

Examples:

* invalid input
* duplicate alias
* route not found
* validation failures

---

# Operational vs Programmer Errors

## Operational Errors

Expected runtime failures.

Examples:

* invalid request body
* URL not found
* alias already exists

Safe to expose to client.

---

## Programmer Errors

Unexpected backend bugs.

Examples:

* undefined variables
* null access
* broken logic

These are hidden from clients in production.

---

# Logging System

Structured logging is implemented using Pino.

Example log:

```txt
INFO:
method: "POST"
url: "/api/shorten"
statusCode: 201
duration: "199ms"
ip: "::1"
```

---

# Why Structured Logging?

Structured logs help with:

* production debugging
* observability
* request tracing
* performance monitoring
* distributed systems debugging

This is significantly better than:

```js
console.log("something happened")
```

---

# Security Features

## Helmet

Adds security-related HTTP headers.

---

## Rate Limiting

Prevents:

* brute-force attacks
* spam requests
* abuse

---

## HPP Protection

Protects against HTTP Parameter Pollution attacks.

---

## Payload Size Limiting

Protects server from excessively large payloads.

---

# Environment Variables

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
LOG_LEVEL=info
```

---

# Local Setup

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```txt
.env
```

Add:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
```

---

## Start Development Server

```bash
npm run dev
```

---

# Production Engineering Concepts Learned

This project focuses heavily on backend engineering concepts such as:

* middleware lifecycle
* request tracing
* centralized logging
* layered architecture
* error classification
* runtime debugging
* infrastructure failures
* operational stability
* dependency compatibility
* API protection
* validation pipelines
* observability

---

# Debugging Lessons Learned

Some real issues encountered during development:

* Middleware execution order issues
* MongoDB Atlas DNS resolution failures
* Runtime incompatibility with express-mongo-sanitize
* Validation contract mismatches
* Operational vs programmer error classification
* Request lifecycle debugging

These failures provided deeper backend understanding than simple feature implementation.

---

# Scalability Considerations

Current architecture is intentionally designed to evolve.

Future scalability improvements may include:

* Redis caching
* Distributed rate limiting
* Analytics aggregation optimization
* MongoDB indexing optimization
* Docker containerization
* CI/CD pipelines
* API versioning
* Horizontal scaling
* Queue-based analytics processing
* Background workers
* CDN integration
* URL expiration support

---

# Future Features

## Frontend Integration

Planned frontend stack:

* React.js
* Tailwind CSS
* Axios
* Authentication UI
* Analytics Dashboard

---

## Advanced Backend Features

Planned additions:

* User authentication
* JWT-based authorization
* User-specific URLs
* Analytics dashboard APIs
* Redis caching
* Click analytics aggregation
* Expiring URLs
* QR code generation
* Admin dashboard
* Custom domains
* Docker deployment
* CI/CD pipelines

---

# Deployment

Deployment configuration will be added later.

Planned deployment targets:

* Render
* Railway
* AWS
* Docker
* Nginx reverse proxy

---

# Screenshots

Screenshots and architecture diagrams will be added later.

---

# Frontend Placeholder

Frontend application is currently under development and will be integrated with this backend later.

---

# Key Takeaway

This project is less about building a simple URL shortener and more about understanding how production backend systems are designed, structured, secured, monitored, and debugged.

The focus is on learning backend engineering deeply rather than just implementing CRUD functionality.
