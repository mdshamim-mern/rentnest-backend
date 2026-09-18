<div align="center">

# 🏠 RentNest — Rental Property Marketplace (Backend API)

A role-based REST API for a full-stack rental platform, built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma** — with JWT auth and real Stripe payments.

[![Live API](https://img.shields.io/badge/Live-API-22c55e?style=for-the-badge)](https://rentnest-backend-iota.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-App-3b82f6?style=for-the-badge)](https://rentnest-frontend-delta.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**[Live API](https://rentnest-backend-iota.vercel.app)** · **[Frontend Repo](https://github.com/mdshamim-mern/rentnest-frontend)** · **[Postman Docs](https://documenter.getpostman.com/view/56161283/2sBY4Jy3eQ)**

</div>

---

### Repository Description (for GitHub "About")
Robust, role-based backend for the RentNest property rental platform. Built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL. Features JWT authentication, role-based access control, and Stripe payments.

### Suggested Topics (Tags)
`nodejs` `expressjs` `typescript` `prisma` `postgresql` `jwt` `stripe` `rest-api` `rentnest-backend` `role-based-access`

---

## 📖 Overview

RentNest's backend is a modular REST API that powers a property rental marketplace for three roles — **Tenant**, **Landlord**, and **Admin**. It handles auth, property listings, rental & tour requests, reviews, Stripe payments, and admin moderation. The companion UI lives in [`rentnest-frontend`](https://github.com/mdshamim-mern/rentnest-frontend) (Next.js).

| | |
|---|---|
| 🔌 **Live API** | https://rentnest-backend-iota.vercel.app |
| 🌐 **Frontend App** | https://rentnest-frontend-delta.vercel.app |
| 📬 **Postman Collection** | https://documenter.getpostman.com/view/56161283/2sBY4Jy3eQ |

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Core Features by Role](#-core-features-by-role)
- [Data Model](#-data-model)
- [Rental Request Lifecycle](#-rental-request-lifecycle)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [Author](#-author)

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Runtime / Framework | Node.js, Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (`@prisma/client`, `@prisma/adapter-pg`) |
| Auth | JSON Web Tokens (JWT), role-based route guards |
| Password hashing | bcrypt / bcryptjs |
| Validation | Zod |
| File uploads | Multer (local disk, served via `/uploads`) |
| Payments | Stripe Checkout |
| Deployment | Vercel |

## 👥 Core Features by Role

### 👑 Admin
- View and ban/unban any user
- Manage property categories
- View all properties and all rental requests platform-wide
- Review and delete contact-form messages

### 🏢 Landlord
- Full CRUD on their own property listings (with image upload)
- View and approve/reject rental & tour requests on their properties

### 🧑‍💼 Tenant
- Browse and filter properties (location, price, category, beds/baths, amenities…)
- Submit rental and tour requests
- Pay via Stripe once a request is approved
- Leave a rating + review after renting

## 🗄 Data Model

Built with Prisma; the core entities and relations:

```mermaid
erDiagram
    USER ||--o| PROFILE : has
    USER ||--o{ PROPERTY : "lists (as landlord)"
    USER ||--o{ RENTAL_REQUEST : "requests (as tenant)"
    USER ||--o{ TOUR_REQUEST : "requests (as tenant)"
    USER ||--o{ REVIEW : writes
    USER ||--o{ SAVED_SEARCH : saves
    CATEGORY ||--o{ PROPERTY : categorizes
    PROPERTY ||--o{ RENTAL_REQUEST : receives
    PROPERTY ||--o{ TOUR_REQUEST : receives
    PROPERTY ||--o{ REVIEW : receives
    RENTAL_REQUEST ||--o{ PAYMENT : "paid via"
```

`User.role` is one of `TENANT | LANDLORD | ADMIN`. `User.status` is `ACTIVE | BANNED`.

## 🔄 Rental Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> APPROVED: Landlord approves
    PENDING --> REJECTED: Landlord rejects
    APPROVED --> ACTIVE: Tenant pays via Stripe
    ACTIVE --> COMPLETED: Lease period ends
```

## 🔌 API Endpoints

All routes are prefixed with `/api`. 🔒 = requires `Authorization: Bearer <token>`.

**Auth** — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/signup` | Public | Register a new user |
| POST | `/login` | Public | Log in, returns JWT + user |
| GET | `/me` | 🔒 Any role | Get the logged-in user |

**Properties** — `/api/properties`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List properties (supports filters) |
| GET | `/:id` | Public | Get one property's full details |
| POST | `/` | 🔒 Landlord | Create a property (multipart + images) |
| PATCH | `/:id` | 🔒 Landlord, Admin | Update a property |
| DELETE | `/:id` | 🔒 Landlord, Admin | Delete a property |

**Categories** — `/api/categories`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List categories |
| POST | `/` | 🔒 Admin | Create a category |

**Rentals** — `/api/rentals`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | 🔒 Tenant | Create a rental request |
| GET | `/` | 🔒 Tenant | My rental requests |
| GET | `/all` | 🔒 Admin | All rental requests |
| GET | `/:id` | 🔒 Tenant | One rental request |
| PATCH | `/:id/status` | 🔒 Admin, Landlord | Approve / reject a request |

**Tours** — `/api/tours`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | 🔒 Tenant | Request a property tour |
| GET | `/my-tours` | 🔒 Tenant | My tour requests |
| GET | `/landlord` | 🔒 Landlord | Tour requests on my properties |

**Reviews** — `/api/reviews`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | 🔒 Tenant | Leave a rating + review |
| GET | `/:propertyId` | Public | Reviews for one property |
| DELETE | `/:id` | 🔒 Admin | Remove a review |

**Payments** — `/api/payments`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create` | 🔒 Tenant | Create a Stripe Checkout session |
| POST | `/save` | 🔒 Tenant | Save the payment, mark rental `ACTIVE` |
| GET | `/` | 🔒 Tenant | My payment history |
| GET | `/:id` | 🔒 Tenant | One payment |

**Landlord** — `/api/landlord`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/requests` | 🔒 Landlord | Rental requests on my properties |
| GET | `/tour-requests` | 🔒 Landlord | Tour requests on my properties |
| PATCH | `/requests/:id` | 🔒 Landlord | Approve / reject a rental request |
| PATCH | `/tour-requests/:id` | 🔒 Landlord | Approve / reject a tour request |
| PUT | `/properties/:id` | 🔒 Landlord | Update my property |
| DELETE | `/properties/:id` | 🔒 Landlord | Delete my property |

**Admin** — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | 🔒 Admin | List all users |
| PATCH | `/users/:id` | 🔒 Admin | Ban / unban a user |
| GET | `/properties` | 🔒 Admin | List all properties |
| GET | `/rentals` | 🔒 Admin | List all rental requests |

**Users** — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin-info` | Public | Platform admin's public contact info |
| GET | `/:userId` | Public | Get a user's profile |
| PUT | `/:userId` | Public | Update a user's profile |

**Contact** — `/api/contact`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit a contact-form message |
| GET | `/` | 🔒 Admin | List all messages |
| PATCH | `/:id/read` | 🔒 Admin | Mark a message as read |
| DELETE | `/:id` | 🔒 Admin | Delete a message |

**Saved Searches** — `/api/saved-searches`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | 🔒 Tenant, Landlord, Admin | Save a search's filters |
| GET | `/` | 🔒 Tenant, Landlord, Admin | List my saved searches |
| DELETE | `/:id` | 🔒 Tenant, Landlord, Admin | Delete a saved search |

**Uploads** (mounted separately, outside `/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/upload` | Public | Upload a single image, returns its URL |

## 📁 Project Structure

```text
src/
├── app.ts                 # Express app, middleware, static /uploads
├── server.ts               # Entry point — starts the HTTP server
├── config/                 # Reads and exports environment variables
├── lib/prisma.ts           # Shared Prisma client instance
├── middlewares/
│   ├── auth.ts              # JWT verification + role guard
│   ├── validateRequest.ts   # Zod validation middleware
│   ├── upload.ts            # Multer config
│   └── globalErrorHandler.ts
├── modules/                 # One folder per domain, e.g. property/
│   └── <name>/
│       ├── <name>.route.ts       # Express routes
│       ├── <name>.controller.ts  # Request/response handling
│       ├── <name>.service.ts     # Prisma queries & business logic
│       └── <name>.validation.ts  # Zod schemas (where used)
├── routes/index.ts          # Mounts every module's router under /api
└── utils/
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Seeds a default Admin + property categories
```

## 🚀 Getting Started

**Prerequisites:** Node.js 18+ (project targets `24.x`), npm, and a PostgreSQL database (local or hosted, e.g. Neon/Supabase).

```bash
# 1. Clone the repo
git clone https://github.com/mdshamim-mern/rentnest-backend.git
cd rentnest-backend

# 2. Install dependencies
npm install

# 3. Add your .env file (see below)

# 4. Run migrations and generate the Prisma client
npx prisma migrate dev
npx prisma generate

# 5. (Optional) seed a default admin + categories
npx prisma db seed

# 6. Start the dev server
npm run dev
```

The server starts on **http://localhost:5000** (or your `PORT`). Build for production with `npm run build`, then run with `npm start`.

> The seed script creates an admin at `admin@rentnest.com` / `admin123` and a starter list of categories (Apartment, Villa, Studio, etc.). This is for **local development only** — change or remove this account before using the seed script anywhere public.

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/rentnest"

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 🔐 Authentication & Authorization

- **Signup/Login** (`auth.service.ts`): passwords are hashed with `bcrypt` before being saved; login compares the hash and, on success, signs a JWT containing `{ id, email, role }`.
- **Route protection** (`middlewares/auth.ts`): a single `auth(...roles)` middleware factory reads the `Authorization: Bearer <token>` header, verifies it, and — if roles are passed in, e.g. `auth('ADMIN')` — checks the token's role is in that list before calling `next()`. No roles passed means "any logged-in user."
- **Validation** (`middlewares/validateRequest.ts`): Zod schemas validate the request body before it reaches a controller, returning a clean 400 error on bad input.

## 📦 Deployment

Deployed on **Vercel**: https://rentnest-backend-iota.vercel.app. Set all the environment variables above in the Vercel project settings, and point `DATABASE_URL` at a reachable PostgreSQL instance (a local-only database won't work from a deployed function).

> **Note on uploads:** `POST /api/upload` and property image uploads currently save files to a local `uploads/` folder via Multer. On a serverless platform like Vercel, the filesystem isn't guaranteed to persist between invocations — for a production setup, uploading to a cloud storage service (e.g. Cloudinary, AWS S3, or Vercel Blob) and storing the returned URL is the more reliable approach.

## 👤 Author

**Md Shamim**
[LinkedIn](https://www.linkedin.com/in/md-shamim471/) · [Facebook](https://www.facebook.com/share/1HJb2Cwxvt/) · [Telegram](https://t.me/md_shamim71)

---
<div align="center">© 2026 RentNest. Built by Md Shamim.</div>