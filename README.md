# blog-back

## Project Overview

The backend is responsible for managing the blog data, including posts, series, and Markdown content. It uses TypeScript, NestJS, TypeORM, and PostgreSQL.

---

## Technologies

- **TypeScript**
- **NestJS**
- **TypeORM**
- **PostgreSQL**

---

## Features

1. **API for Posts**

   - Fetch all posts (with pagination and sorting).
   - Fetch single post details.

2. **API for Series**

   - Fetch all series with metadata.
   - Fetch details of a single series, including associated posts.

3. **Markdown Support**
   - Store and retrieve Markdown-based content for posts.

---

## Database Design

### Tables

1. **Post**

   - `id`: Primary key
   - `title`: String
   - `content`: Text (Markdown)
   - `imageUrl`: String
   - `createdAt`: DateTime
   - `updatedAt`: DateTime
   - `seriesId`: Foreign key linking to `Series`

2. **Series**
   - `id`: Primary key
   - `title`: String
   - `description`: Text
   - `imageUrl`: String
   - `createdAt`: DateTime

---

## API Endpoints

### Posts API

- `GET /posts`: Fetch all posts with pagination and sorting.
- `GET /posts/:id`: Fetch a specific post by ID.

### Series API

- `GET /series`: Fetch all series.
- `GET /series/:id`: Fetch a series and its associated posts.

---

## Tasks

### Project Initialization

- [ ] Initialize NestJS project.
- [ ] Creating a PostgreSQL database
- [ ] Validating environment variables
- [ ] Connecting a NestJS application with PostgreSQL

### Database Schema

- [ ] Define `Post` and `Series` entities in TypeORM.
- [ ] Establish relationships between `Post` and `Series`.

### API Development

#### Posts API

- [ ] Create `GET /posts` endpoint.
- [ ] Add pagination and sorting for posts.
- [ ] Create `GET /posts/:id` endpoint.

#### Series API

- [ ] Create `GET /series` endpoint.
- [ ] Create `GET /series/:id` endpoint (include associated posts).

### Testing & Documentation

- [ ] Write unit tests for API routes.
- [ ] Add API documentation using Swagger (`@nestjs/swagger`).

### Deployment

- [ ] Create Dockerfile.
- [ ] Configure `.env`.
- [ ] Deploy to Railway

---

## License

This is a personal project and not intended for commercial use.
