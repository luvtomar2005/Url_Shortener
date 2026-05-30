# 🚀 Production-Grade URL Shortener Backend

A scalable and production-oriented URL shortener backend built using **Node.js, Express.js, MongoDB, Redis, Docker, and modern backend engineering practices**.

This project was built in **2026** by **Luv Tomar** with a strong focus on learning real backend architecture instead of building a basic CRUD application.

The goal of this project was not just to shorten URLs, but to deeply understand:

* scalable backend architecture
* request lifecycle management
* Redis caching strategies
* graceful degradation
* async side effects
* timeout protection
* observability
* validation pipelines
* layered backend design
* production-oriented backend engineering

---

# 📌 Project Highlights

This backend system includes:

✅ URL shortening system
✅ High-speed redirect architecture
✅ Redis caching layer
✅ Cache-aside pattern implementation
✅ Graceful Redis fallback
✅ Redis timeout protection
✅ Analytics tracking pipeline
✅ Fire-and-forget analytics architecture
✅ Validation middleware using Zod
✅ Rate limiting
✅ Structured logging using Pino
✅ Request tracing with request IDs
✅ Layered architecture
✅ Centralized error handling
✅ Dockerized Redis setup

---

# 🏗️ System Architecture

The backend follows a layered architecture pattern:

```txt id="xpf0ut"
Routes
  ↓
Middlewares
  ↓
Controllers
  ↓
Services
  ↓
Database / Redis
```

This separation improves:

* scalability
* maintainability
* debugging
* code organization
* production readiness

---

# ⚡ Redirect Request Lifecycle

The redirect system is the most important flow in this backend.

```txt id="vjlwm7"
Client Request
    ↓
Express Route
    ↓
Validation Middleware
    ↓
Redirect Controller
    ↓
Redirect Service
    ↓
Redis Cache Lookup
        ↓
    CACHE HIT → return cached URL
        OR
    CACHE MISS → query MongoDB
                    ↓
                populate Redis
    ↓
Trigger Analytics Async
    ↓
302 Redirect Response
```

---

# 🧠 Backend Engineering Concepts Implemented

# 1. Cache-Aside Architecture

Redis is used as a caching layer while MongoDB remains the source of truth.

Flow:

```txt id="pjlwm4"
Request
 ↓
Check Redis
 ↓
If cache miss
 ↓
Fetch from MongoDB
 ↓
Store in Redis
 ↓
Return response
```

Benefits:

* faster redirects
* reduced MongoDB load
* scalable read performance

---

# 2. Graceful Degradation

Redis is treated as a **soft dependency**.

If Redis fails:

* application does NOT crash
* MongoDB fallback automatically works

This ensures system reliability.

---

# 3. Redis Timeout Protection

Slow dependencies are dangerous in production systems.

Redis operations are protected using:

```js
Promise.race()
```

This prevents slow Redis responses from blocking request flow.

Benefits:

* fail-fast behavior
* lower latency
* resilient architecture

---

# 4. Fire-and-Forget Analytics

Analytics tracking is intentionally asynchronous.

Instead of:

```js
await trackAnalytics()
```

the backend uses:

```js
trackAnalytics().catch(...)
```

This ensures:

* analytics does not block redirects
* redirect latency remains low
* analytics failures stay isolated

---

# 5. Structured Logging

Pino logger is used for:

* request logging
* error logging
* observability
* debugging request lifecycle

---

# 6. Request ID Tracing

Every request gets a unique request ID.

Benefits:

* easier debugging
* request correlation
* production tracing

---

# 7. Validation Layer

Zod validation middleware is used to:

* reject malformed requests
* enforce API contracts
* keep controllers clean

---

# 8. Centralized Error Handling

A custom `AppError` class and global error middleware were implemented for:

* predictable API errors
* cleaner architecture
* operational error handling

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Caching

* Redis

## Validation

* Zod

## Logging

* Pino Logger

## DevOps

* Docker

---

# 📁 Folder Structure

```txt id="jlwm8h"
src/
│
├── config/
├── constants/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── service/
├── utils/
├── validations/
│
├── app.js
└── server.js
```

---

# 📂 Important Folders

| Folder      | Purpose                              |
| ----------- | ------------------------------------ |
| config      | MongoDB, Redis, logger configuration |
| controllers | Request-response handling            |
| service     | Business logic                       |
| middlewares | Validation, logging, error handling  |
| models      | MongoDB schemas                      |
| validations | Zod validation schemas               |
| routes      | API route definitions                |
| utils       | Helper utilities and custom errors   |

---

# 📌 Important Backend Files

## redirect_service.js

Core backend architecture file.

Responsibilities:

* Redis cache lookup
* MongoDB fallback
* expiration validation
* cache population
* redirect resolution

---

## cache_service.js

Handles:

* Redis abstraction
* timeout protection
* graceful failure handling
* get/set/delete operations

---

## analytics_service.js

Handles:

* analytics event storage
* analytics pipeline
* fire-and-forget side effects

---

## error_middleware.js

Handles:

* centralized API error responses
* operational error management

---

# 🔗 API Endpoints

# Create Short URL

```http id="jlwm2q"
POST /api/url/shorten
```

## Request Body

```json
{
  "originalUrl": "https://google.com"
}
```

## Response

```json
{
  "success": true,
  "data": {
    "shortCode": "abc123"
  }
}
```

---

# Redirect URL

```http id="2jlwm9"
GET /:shortCode
```

Redirects the user to the original URL.

---

# Get Analytics

```http id="5jlwm0"
GET /api/analytics/:shortCode
```

Returns analytics data for the short URL.

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection

REDIS_HOST=localhost
REDIS_PORT=6379

BASE_URL=http://localhost:3000
```

---

# 🐳 Running Redis Using Docker

## Start Redis Container

```bash
docker run --name redis-server -p 6379:6379 redis
```

---

## Stop Redis

```bash
docker stop redis-server
```

---

## Start Redis Again

```bash
docker start redis-server
```

---

# ▶️ Running Locally

# Install Dependencies

```bash
npm install
```

---

# Start Development Server

```bash
npm run dev
```

---

# 🧪 Backend Resilience Testing

This project was intentionally tested for:

✅ Redis failure
✅ Redis timeout handling
✅ MongoDB fallback behavior
✅ Fire-and-forget analytics isolation
✅ Expired URL handling
✅ Validation rejection flow

---

# 📊 Current Backend Capabilities

* Layered architecture
* Cache-aside pattern
* Graceful degradation
* Timeout protection
* Fire-and-forget analytics
* Request tracing
* Structured logging
* Validation middleware
* Rate limiting
* Operational error handling

---

# 📈 Future Improvements

Potential future upgrades:

* Queue-based analytics
* Background workers
* Health check endpoints
* CI/CD pipeline
* Integration testing
* Docker Compose setup
* Deployment pipeline
* Analytics aggregation
* Cache invalidation for update APIs

---

# 🎯 Main Learning Outcomes

This project helped in deeply understanding:

* backend request lifecycle
* Redis caching strategies
* scalable backend architecture
* graceful degradation
* async side effects
* timeout protection
* layered architecture
* backend observability
* production-oriented backend design

---

# 👨‍💻 Author

## Luv Tomar

Built in **2026** as a backend engineering learning project focused on scalability, resilience, observability, and production-oriented backend architecture.
