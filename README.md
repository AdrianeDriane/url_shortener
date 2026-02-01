# URL Shortener | Symph Take Home Coding Assignment by Adriane Dilao

A full-stack URL shortener application with analytics dashboard, built as part of the Symph Take Home Coding Assignment.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions) Please see if can't run on your device :D
- [Troubleshooting](#troubleshooting-common-setup-issues)
- [Documentation](#documentation)
- [P.S.](#ps)
- [What I Would Add](#what-i-would-add)
- [What I've Learned](#what-ive-learned)
- [Conclusion](#conclusion)

---

## Features

### Core Features (MVP)

- **URL Shortening** — Input any valid URL and receive a shortened link
- **Random Slug Generation** — Auto-generated 8-character alphanumeric slugs
- **URL Redirection** — Short links redirect to original destination URLs
- **Client-side URL Validation** — Validates URL format before submission
- **Copy to Clipboard** — One-click copy functionality for generated short links

### Optional Features (Implemented)

- **Custom Slugs** — Users can specify their own custom slug (8 characters max)
- **Expiration Dates** — Set optional expiration date/time for shortened URLs
- **UTM Parameters** — Add campaign tracking parameters (source, medium, campaign, term, content)
- **Expired Link Handling** — Handles expired links with a user-friendly expired page

### Additional Features (Beyond Requirements)

- **Analytics Dashboard** — Comprehensive insights for each shortened URL:
  - Total click count
  - Traffic sources breakdown (referrer tracking)
  - Device type detection (desktop/mobile)
  - Recent activity log with timestamps
  - Visual pie chart for traffic distribution
- **Expired Access Tracking** — Tracks how many visitors attempted to access an expired link
- **QR Code Generation** — Generate downloadable QR codes for any shortened URL
- **Link Status Indicator** — Real-time active/expired status display
- **Demo Data Seeder** — Production-ready seeder for first-time setup experience
- **In-Memory Caching** — LRU approach cache layer for frequently accessed URLs (performance optimization)
- **Responsive Design** — Mobile-first UI that works across all device sizes
- **Animated UI** — Smooth transitions and scroll-reveal animations using Framer Motion

---

## Prerequisites

Before starting, ensure you have the following tools installed on your system:

1. **Docker** (v20.10 or higher)
   - [Install Docker for macOS](https://docs.docker.com/desktop/install/mac/)
   - [Install Docker for Windows](https://docs.docker.com/desktop/install/windows/)
   - [Install Docker for Linux](https://docs.docker.com/desktop/install/linux/)

2. **Docker Compose** (v1.29 or higher)
   - Docker Desktop for macOS and Windows includes Docker Compose
   - For Linux: `sudo apt-get install docker-compose-plugin`

3. **Node.js** (v20 or higher)
   - [Download Node.js](https://nodejs.org/)
   - Recommended: Use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions

4. **Git**
   - [Install Git](https://git-scm.com/downloads)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd url_shortener
```

### 2. Install dependencies

```bash
# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install

# Return to project root
cd ..
```

### 3. Start the development environment

```bash
docker compose up --build
```

This command will:

- Build all Docker images
- Start PostgreSQL, backend, and frontend services
- Run database migrations automatically
- Forward the necessary ports to your host machine

### 4. Seed demo data

To populate the database with demo URLs and click analytics:

```bash
docker compose exec backend npm run seed:run
```

> **Note:** The seeder is idempotent—it only runs if the database is empty.

### 5. Access the application

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:8000](http://localhost:8000) |
| pgAdmin     | [http://localhost:5050](http://localhost:5050) |

#### pgAdmin Login

To access the database via pgAdmin:

- **URL:** [http://localhost:5050](http://localhost:5050)
- **Email:** `admin@example.com`
- **Password:** `pass`

#### Accessing Database Tables

To view and edit data in the database tables:

1. In pgAdmin, expand **Servers** on the left sidebar
2. Right-click on **Symph DB** and select **Properties**
3. Go to the **Connection** tab
4. Ensure **Hostname/address** is set to `db` (not localhost)
5. Click **Save**
6. Right-click on **Symph DB** again and select **Connect Server**
   - When prompted for a password, enter `symph`
7. Navigate to **Databases** > **symph** > **Schemas** > **public** > **Tables**
8. Right-click on any table and select **View/Edit Data** to view its contents

### 6. Stop the environment

```bash
docker compose down
```

---

## Troubleshooting Common Setup Issues

- **Port conflicts**: If you see errors about ports already being in use, check if you have other services running on ports 3000, 8000, 5432, etc.

- **Docker permission issues**: On Linux, you might need to run Docker commands with `sudo` or add your user to the docker group.

- **Node modules issues**: If you encounter errors related to node modules, try deleting the `node_modules` folders and running `npm install` again.

- **Database connection issues**: Ensure the PostgreSQL container is healthy before the backend starts. You can check with `docker compose ps`.

---

## Documentation

Detailed documentation for each part of the codebase can be found in their respective directories:

- **Backend API Documentation** — See [`server/README.md`](./server/README.md)
- **Frontend Documentation** — See [`client/README.md`](./client/README.md)

---

## P.S.

The `.env` file has been committed and pushed to this repository. I'm fully aware this is a security anti-pattern in production environments. However, for the purposes of this coding challenge, I've included it to ensure ease of setup and a seamless review experience—no additional configuration required. In a real-world scenario, `.env` would be added to `.gitignore` and environment variables would be managed through secure secrets management.

---

## What I Would Add

If I had more time to transform this into a fully production-ready application, I would add:

| Feature                                    | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| **Authentication**                         | Enable user accounts for personalized route customizations and analytics privacy       |
| **Geolocation Tracking**                   | Track which cities/regions the clicks are coming from for deeper geographic insights   |
| **Tanstack Query**                         | Implement client-side caching for analytics data to reduce API calls and improve UX    |
| **Rate Limiting & Brute Force Protection** | Prevent abuse and protect against malicious actors attempting to overwhelm the service |
| **WebSockets**                             | Enable real-time analytics updates without requiring page refreshes                    |

---

## What I've Learned

Even though this was a coding test, I found myself learning throughout the process!

- **LRU Caching in Node.js** — I learned how to implement an LRU (Least Recently Used) cache layer in an Express.js server to optimize frequently accessed URL lookups. Understanding cache eviction policies and TTL management was particularly insightful.

- **How Modern URL Shorteners Scale** — I researched how large-scale URL shortening services (like Bitly, TinyURL, and others) approach their architecture—from distributed databases and CDN edge caching to analytics pipelines and slug collision strategies.

---

## Conclusion

I genuinely enjoyed working on this coding challenge! It was a great opportunity to build something end-to-end while exploring caching strategies, analytics tracking, and clean architecture patterns. Thank you so much for the opportunity—I had a lot of fun and learned a ton along the way. 🚀
