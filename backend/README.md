# Hotel Yashdeep — Backend API

Backend for **Hotel Yashdeep**, a restaurant & beer bar in Yermala, Maharashtra.
This is a reservation + CMS API — **not** a hotel room booking system.

Built with Node.js, Express 5, MongoDB Atlas (Mongoose), JWT auth, and Cloudinary
for image storage.

---

## 1. Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your real values
cp .env.example .env

# 3. Seed the database (run once)
npm run create-admin     # creates the first superadmin login
npm run create-tables    # seeds 20 sample tables

# 4. Start the dev server (auto-restarts on file changes)
npm run dev

# Or start in production mode
npm start
```

The API will be available at `http://localhost:5000` (or whatever `PORT` you set).
Check `GET /api/health` to confirm it's running.

---

## 2. Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin allowed by CORS, e.g. `http://localhost:5173` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

The default seeded admin login (from `npm run create-admin`) is:

```
email: admin@hotelyashdeep.com
password: Admin@123
```

**Change this password immediately after first login in production.**

---

## 3. Folder Structure

```
src/
  app.js                  Express app setup (middleware + route mounting)
  server.js               Entry point — connects DB, starts server
  config/
    database.js           Mongoose connection
    cloudinary.js          Cloudinary SDK config
  models/
    Admin.js
    Menu.js
    Reservation.js
    Table.js
    WebsiteContent.js
    Counter.js              Atomic sequence counter (powers booking IDs)
  controllers/
    auth.controller.js      Admin login (single source of truth)
    admin.controller.js     /me, /logout
    content.controller.js   Website CMS content
    menu.controller.js
    table.controller.js
    reservation.controller.js   Public + admin reservation logic
    dashboard.controller.js
    upload.controller.js    Cloudinary uploads (single/multiple/gallery/menu/hero/delete)
  services/
    availability.service.js  Table conflict-checking shared by reservation + table flows
  routes/
    auth.routes.js
    adminRoutes.js
    content.routes.js
    menu.routes.js
    table.routes.js
    reservation.routes.js   Public routes + nested /admin sub-router
    dashboard.routes.js
    upload.routes.js
  middleware/
    auth.middleware.js      JWT `protect` + `authorizeRoles`
    error.middleware.js     Centralized error handler (last middleware)
    notFound.middleware.js  404 handler
    rateLimiter.middleware.js
    upload.middleware.js    Multer + Cloudinary storage
    validate.middleware.js  express-validator result handler
  validators/
    auth.validator.js
    reservation.validator.js
    table.validator.js
    content.validator.js
  utils/
    ApiError.js
    ApiResponse.js
    asyncHandler.js
    generateBookingId.js    Atomic HY1001-style ID generator
  scripts/
    createAdmin.js
    createTables.js
```

---

## 4. API Endpoints

All responses follow this shape:

```json
{ "success": true, "statusCode": 200, "message": "...", "data": { } }
```

Errors:

```json
{ "success": false, "statusCode": 404, "message": "...", "errors": [] }
```

Protected routes require an admin JWT:
`Authorization: Bearer <token>`

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login → returns JWT |

### Admin
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/admin/me` | Protected | Get current logged-in admin |
| POST | `/api/admin/logout` | Protected | Logout (client discards token) |

### Website Content (CMS)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/content` | Public | Get website content (hero, about, contact, hours, etc.) |
| PUT | `/api/content` | Protected | Update website content |

### Menu
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/menu` | Public | List menu items (`?category=`, `?available=`) |
| GET | `/api/menu/:id` | Public | Get single menu item |
| POST | `/api/menu` | Protected | Create menu item |
| PUT | `/api/menu/:id` | Protected | Update menu item |
| DELETE | `/api/menu/:id` | Protected | Delete menu item |

### Tables
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/tables` | Protected | List tables (`?location=`, `?status=`) |
| GET | `/api/tables/available` | Protected | List tables free for a given `reservationDate`, `reservationTime`, `guests` |
| GET | `/api/tables/:id` | Protected | Get single table |
| POST | `/api/tables` | Protected | Create table |
| PUT | `/api/tables/:id` | Protected | Update table |
| DELETE | `/api/tables/:id` | Protected | Delete table |

### Reservations — Public (Customer self-service via Booking ID + Phone)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/reservations` | Public | Create reservation → stays **Pending**, no table assigned yet |
| POST | `/api/reservations/:bookingId/check` | Public | Check status — body: `{ "phone": "..." }` |
| PUT | `/api/reservations/:bookingId/reschedule` | Public | Reschedule — body: `{ "phone", "reservationDate", "reservationTime" }` |
| PUT | `/api/reservations/:bookingId/cancel` | Public | Cancel — body: `{ "phone": "..." }` |

### Reservations — Admin
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/reservations/admin` | Protected | List all (`?status=`, `?date=`, `?isWalkIn=`) |
| GET | `/api/reservations/admin/:id` | Protected | Get single reservation |
| POST | `/api/reservations/admin/walk-in` | Protected | Create walk-in (table assigned immediately) |
| PUT | `/api/reservations/admin/:id/confirm` | Protected | Confirm a Pending reservation + assign a table — body: `{ "tableId" }` |
| PUT | `/api/reservations/admin/:id/assign-table` | Protected | Reassign table — body: `{ "tableId" }` |
| PUT | `/api/reservations/admin/:id/complete` | Protected | Mark completed, frees the table |
| PUT | `/api/reservations/admin/:id/status` | Protected | Generic status update — body: `{ "status" }` |
| DELETE | `/api/reservations/admin/:id` | Protected | Delete reservation |

> Table assignment always checks: table capacity ≥ guests, and no other active
> reservation (Confirmed / Rescheduled / Walk-In) holds that table at the same
> date + time. Conflicts return `409 Conflict`.

### Dashboard
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Protected | Aggregated stats: totals by status, walk-ins today, today's reservations, upcoming reservations, table availability counts, latest 10 reservations |

### Uploads (Cloudinary)
| Method | Route | Access | Field name(s) | Description |
|---|---|---|---|---|
| POST | `/api/upload` | Protected | `image` | Single generic upload |
| POST | `/api/upload/multiple` | Protected | `images` (max 10) | Multiple generic upload |
| POST | `/api/upload/hero` | Protected | `image` | Uploads + sets `WebsiteContent.heroImage` |
| POST | `/api/upload/gallery` | Protected | `images` (max 20) | Uploads + appends to `WebsiteContent.galleryImages` |
| POST | `/api/upload/menu` | Protected | `images` (max 20) | Uploads + appends to `WebsiteContent.menuImages` |
| DELETE | `/api/upload` | Protected | — | Body: `{ "url" }` or `{ "publicId" }` — deletes from Cloudinary + CMS |

Uploads use `multipart/form-data`. Max file size: 5 MB per file.

---

## 5. Postman Testing Guide

1. **Login** — `POST /api/auth/login`
   ```json
   { "email": "admin@hotelyashdeep.com", "password": "Admin@123" }
   ```
   Copy the `data.token` from the response.

2. **Set the token** — In Postman, create an environment variable `token` and
   paste the JWT. On protected requests, go to the **Authorization** tab →
   type **Bearer Token** → `{{token}}`.

3. **Create a reservation (public)** — `POST /api/reservations`
   ```json
   {
     "customerName": "Rahul Sharma",
     "phone": "9876543210",
     "email": "rahul@example.com",
     "reservationDate": "2026-07-05",
     "reservationTime": "20:00",
     "guests": 4
   }
   ```
   Note the returned `bookingId` (e.g. `HY1001`).

4. **Customer checks their reservation** — `POST /api/reservations/HY1001/check`
   ```json
   { "phone": "9876543210" }
   ```

5. **Admin confirms it** — first check available tables:
   `GET /api/tables/available?reservationDate=2026-07-05&reservationTime=20:00&guests=4`
   Then: `PUT /api/reservations/admin/<reservationMongoId>/confirm`
   ```json
   { "tableId": "<table _id from the available list>" }
   ```

6. **Create a walk-in** — `POST /api/reservations/admin/walk-in`
   ```json
   { "customerName": "Walk-in Guest", "phone": "9988776655", "guests": 2, "tableId": "<table _id>" }
   ```

7. **Mark completed** — `PUT /api/reservations/admin/<id>/complete`

8. **Check dashboard** — `GET /api/dashboard`

9. **Upload a hero image** — `POST /api/upload/hero`, Body → form-data → key
   `image` (type: File) → choose a `.jpg`/`.png`/`.webp` file.

---

## 6. Deployment Guide

### Database
Use a MongoDB Atlas cluster. Whitelist your deployment server's IP (or `0.0.0.0/0`
for platforms with dynamic IPs, combined with a strong DB user password).

### Recommended hosts
Render, Railway, or any Node-compatible host (Heroku, Fly.io, a VPS with PM2, etc.)

### Steps (example: Render / Railway)
1. Push this repo to GitHub.
2. Create a new Web Service, connect the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all variables from `.env.example` in the host's environment settings,
   with real Atlas/Cloudinary/JWT values.
6. After first deploy, run the seed scripts once (via the host's shell/console,
   or temporarily as a one-off job):
   ```bash
   npm run create-admin
   npm run create-tables
   ```
7. Update `CLIENT_URL` to your deployed frontend's URL once it's live, so CORS
   allows it.

### Production checklist
- Set `NODE_ENV=production`
- Use a strong, unique `JWT_SECRET`
- Change the default admin password after first login
- Confirm Helmet, CORS, and rate limiting are active (they are, by default, in `app.js`)
- Enable HTTPS at your hosting/proxy layer (Render/Railway provide this automatically)

---

## Notes on Architecture Decisions

- **Booking IDs** (`HY1001`, `HY1002`, ...) are generated atomically via a
  dedicated `Counter` collection and `$inc`, so concurrent reservation
  requests can never collide on the same ID — a plain `countDocuments()`
  approach would have a race condition under load.
- **Table assignment is manual and admin-only.** Customer-created
  reservations always start as `Pending` with no table attached. Only an
  admin action (`/confirm`, `/assign-table`, or walk-in creation) attaches a
  table, and every attachment is checked against existing active reservations
  for that table/date/time to prevent double-booking.
- **Customer-facing lookups never use Mongo `_id`.** Public check/reschedule/
  cancel routes use `bookingId` + `phone` together as the lookup key.
