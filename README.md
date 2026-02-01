# URL Shortener

A full-stack URL shortener application with analytics dashboard, built as part of the Symph Take Home Coding Assignment.

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

## P.S.

The `.env` file has been committed and pushed to this repository. I'm fully aware this is a security anti-pattern in production environments. However, for the purposes of this coding challenge, I've included it to ensure ease of setup and a seamless review experience—no additional configuration required. In a real-world scenario, `.env` would be added to `.gitignore` and environment variables would be managed through secure secrets management.
