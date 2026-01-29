# Course Selling API

A REST API for selling and managing online courses. Supports user authentication, course creation, lessons, and purchases with role-based access (Student / Instructor).

## Tech Stack

- **Runtime:** [Bun](https://bun.sh)
- **Framework:** Express
- **Database:** PostgreSQL with [Prisma](https://www.prisma.io)
- **Auth:** JWT, bcrypt

## Prerequisites

- [Bun](https://bun.sh) installed
- PostgreSQL (local or hosted)

## Setup

1. **Clone and install**

   ```bash
   bun install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   | Variable           | Description                    |
   | ------------------ | ------------------------------ |
   | `DATABASE_URL`     | PostgreSQL connection string   |
   | `JWT_SECRET`       | Secret for signing JWTs        |
   | `PORT`             | Server port (default: 8000)    |
   | `BCRYPT_PASSWORD`  | Peppering for password hashing |
   | `BCRYPT_SALT_ROUNDS` | bcrypt salt rounds (e.g. 10) |

3. **Database**

   ```bash
   bunx prisma generate
   bunx prisma db push   # or prisma migrate dev
   ```

4. **Run**

   ```bash
   bun run dev    # watch mode
   bun run start  # production
   ```

## API Overview

| Base path    | Purpose                    |
| ------------ | -------------------------- |
| `/auth`      | Signup, login (JWT)         |
| `/me`        | Current user (protected)   |
| `/courses`   | List, create, get courses  |
| `/lessons`   | Lessons per course         |
| `/purchases` | Purchase and list purchases|

Protected routes expect a valid `Authorization: Bearer <token>` header.

## Resources

- **Requirements:** More in-depth project requirements are available at [Course Selling API – Coding Assignment](https://brindle-goal-102.notion.site/Course-Selling-API-Coding-Assignment-2f146b36b2e980df9fe4c5856f08d4bc).
- **Tests:** Integration test suite for this API: [100xdevs-bootcamp-1/course-selling-assignment-tests](https://github.com/100xdevs-bootcamp-1/course-selling-assignment-tests/tree/main). All tests pass.

## License

Private.
