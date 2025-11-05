# Project Base

This repository provides a Docker-based setup for local, development, and production environments using `docker-compose` and Docker Swarm. The project is managed via a Makefile for easy environment management.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (with Compose and Swarm support)
- [Make](https://www.gnu.org/software/make/)
- Bash shell

## Directory Structure

- `env_files/`: Contains environment variable files (`.env.local`, `.env.dev`, `.env.prod`)
- `deployment/`: Contains Docker Compose YAML files for each environment

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd project-base
   ```

2. **Prepare environment files:**
   - Copy and edit the example environment files in `env_files/` as needed:
     - `.env.local` for local development
     - `.env.dev` for development (Swarm)
     - `.env.prod` for production (Swarm)
   - Ensure each file sets `COMPOSE_PROJECT_NAME`.

3. **Initialize Docker Swarm (for dev/prod):**
   ```sh
   docker swarm init
   ```

## Usage

All commands are run from the project root using `make`.

### Local Environment

- **Start local containers:**
  ```sh
  make local
  ```
- **Stop and remove local containers:**
  ```sh
  make clean-local
  ```

### Development Environment (Docker Swarm)

- **Deploy development stack:**
  ```sh
  make dev
  ```
- **Remove development stack:**
  ```sh
  make clean-dev
  ```

### Production Environment (Docker Swarm)

- **Deploy production stack:**
  ```sh
  make prod
  ```
- **Remove production stack:**
  ```sh
  make clean-prod
  ```

### General Clean

- **Clean local environment and get instructions for dev/prod:**
  ```sh
  make clean
  ```

### Help

- **Show available commands:**
  ```sh
  make help
  ```

## Troubleshooting

- Ensure your `.env.*` files exist and contain the `COMPOSE_PROJECT_NAME` variable.
- For Swarm commands, make sure Docker Swarm is initialized (`docker swarm init`).
- If a stack is not removed automatically, you can remove it manually:
  ```sh
  docker stack rm <your-stack-name>
  ```