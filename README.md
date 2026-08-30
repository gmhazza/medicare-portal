# MediCare Portal — Documentation

A full-stack telemedicine and healthcare scheduling platform. It supports three roles (patient/user, doctor, admin), an AI health assistant powered by Google Gemini, service-based appointment booking with automatic doctor assignment, billing, and clinical reporting.

---

## 1. Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB via Mongoose
- JWT auth stored in an HTTP-only cookie
- bcrypt for password hashing
- Google Generative AI SDK (`@google/generative-ai`) — Gemini model for the chatbot
- Deployed as a serverless function via `vercel.json`

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- React Hook Form + Zod for form validation
- Axios for API calls
- GSAP (+ `@gsap/react`, ScrollTrigger) for animations
- Lenis for smooth scrolling
- Three.js / React Three Fiber (dependency present; not actively used in current pages)

---

## 2. Project Structure

```
backend/
  index.js                  # Express app entry point
  authentication/index.js   # JWT middleware
  database/
    mongodb/index.js        # Mongoose schemas & connection
    queries/index.js        # All DB query functions
  api/
    data/index.js            # Main REST API router (/api/database)
    chatbot/index.js          # AI chatbot router (/api/chatbot)
  google/index.js           # Gemini client setup
  vercel.json / package.json / .env.example

frontend/
  src/
    App.jsx                 # Route definitions
    main.jsx
    components/              # Navbar, Footer, Layout, Chatbot widget, transitions, etc.
    context/                 # AuthContext, NotificationContext
    pages/                    # Route-level pages (Home, Auth, dashboards, etc.)
    services/api.js          # Axios wrapper / API client (with localStorage fallbacks)
```

---

## 3. Data Model (MongoDB Collections)

| Model | Key Fields |
|---|---|
| **admins** | name, email, password (hashed), avatar |
| **users** (patients) | name, email, password, gender |
| **doctors** | name, email, password, pillar (specialty), gender, available |
| **available-services** | service_name, pillar, available, charges |
| **messages** | user (ref), sender (`user`/`bot`), content |
| **appointments** | patient (ref), doctor (ref), service (ref), status, appointment_date, payment (ref), notes, proof, vitals `{heartRate, bloodPressure, sleepCycles, bloodGlucose}` |
| **payments** | charges, paid, transcation, paid_at |
| **contact-forms** | name, email, subject, message, seen |

**Pillars (specialties):** `cardiology`, `dermatology`, `orthopedics`, `diagnostics`, `telehealth`, `general`

**Appointment statuses:** `pending`, `cancelled`, `completed`, `no-show`

---

## 4. Authentication

- On login/register, the backend signs a JWT (`{ _id, role }`, 7-day expiry) and sets it as an **HTTP-only cookie** named `token`.
- `authenticate` middleware (backend/authentication) verifies the cookie and attaches `req.user`.
- Three parallel account types share the same pattern but separate collections/routes: `user`, `doctor`, `admin`.
- Role checks are done manually inside each route handler (`req.user.role !== 'admin'`, etc.) rather than via role-based middleware.
- Frontend `AuthContext` mirrors session state in `localStorage` (`medicare_user`, `medicare_role`) for persistence across reloads, and re-validates via `GET /api/database/me` on mount.

---

## 5. Backend API Reference

Base URL: `/api/database` (see `backend/api/data/index.js`), unless noted.

### Public / Auth
| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/me` | Get current authenticated user profile |
| POST | `/register/user` | Register patient |
| POST | `/register/doctor` | Register doctor (admin only) |
| POST | `/register/admin` | Register admin (admin only) |
| POST | `/login/user` | Patient login |
| POST | `/login/doctor` | Doctor login |
| POST | `/login/admin` | Admin login |
| GET | `/logout` | Clear auth cookie |
| POST | `/create/contact/form` | Submit contact/feedback form |
| GET | `/service/all` | List all services (public) |
| GET | `/get/doctor/:id` | Public doctor profile (no password) |

### User (patient) routes — require `role === 'user'`
| Method | Path | Description |
|---|---|---|
| GET | `/chat/all` | Get chat message history |
| GET | `/appointment/all/user` | List own appointments |
| POST | `/create/appointment` | Book appointment (auto-assigns doctor) |
| POST | `/appointment/mark/cancel` | Cancel own appointment |
| POST | `/appointment/pay` | Pay a bill (validates ownership) |
| POST | `/appointment/payment` | Get payment details for an appointment |

### Doctor routes — require `role === 'doctor'`
| Method | Path | Description |
|---|---|---|
| GET | `/appointment/all/doctor` | List pending appointments assigned to doctor |
| POST | `/appointment/mark/complete` | Complete appointment (requires `proof`, optional `vitals`) |
| POST | `/doctor/availability` | Toggle own availability |

### Admin routes — require `role === 'admin'`
| Method | Path | Description |
|---|---|---|
| GET | `/get/all/contact/form` | List contact inquiries (summary) |
| GET | `/get/contact/form?form_id=` | Get full inquiry |
| POST | `/contact/form/marked/seen` | Mark inquiry as seen |
| POST | `/contact/form/delete` | Delete inquiry |
| POST | `/create/service` | Create a service |
| POST | `/service/update` | Toggle service availability |
| GET | `/get/user/all` | List all patients |
| GET | `/get/doctor/all` | List all doctors |
| GET | `/get/appointment/all` | List all appointments (fully populated) |
| POST | `/delete/user` | Delete patient (+ their messages) |
| POST | `/delete/doctor` | Delete doctor |
| POST | `/delete/admin` | Delete admin |

### Chatbot — Base URL: `/api/chatbot`
| Method | Path | Description |
|---|---|---|
| POST | `/ask` | Send message to Gemini AI assistant (user only; uses last 5 messages as context) |

---

## 6. Core Business Logic

### Appointment Booking (`createAppointment`)
1. Patient selects a **service**; backend resolves its **pillar**.
2. Finds all doctors in that pillar.
3. Runs `checkDoctorDailyAvailability` for each (limit configurable via `DOCTOR_DAILY_APPOINTMENT_LIMIT`, default 5) to filter out doctors already booked to capacity that day.
4. Auto-assigns the **first available doctor**.
5. Creates a `payment` record (unpaid) and links it to the new `appointment`.
6. Fails with an error if no doctor in the pillar is available that day.

### Appointment Completion
- Only the assigned doctor can complete their appointment.
- Requires clinical `proof` (notes); optional `vitals` object.
- Sets status to `completed`.

### Cancellation
- Only the booking patient can cancel their own appointment.
- Cancelling doctor availability (`updateAppointment`) auto-restores doctor availability when status becomes non-pending/non-completed.

### Payment
- Patient submits a transaction ID; only the owning patient can pay.
- Payment record updated: `paid: true`, `transcation`, `paid_at`.

### AI Chatbot
- Uses Gemini model `gemini-3.6-flash` with a fixed system instruction ("assistant at MediCare Medical services Website").
- Maintains short-term context: last 5 messages from the user's chat history, concatenated into the prompt.
- Persists both user and bot messages to the `messages` collection.
- Frontend gates chatbot access behind login; unauthenticated users get a canned mock response.

---

## 7. Frontend Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Welcome | Portal selector (Patient / Staff / Marketing site); auto-redirects if logged in |
| `/home` | Home | Marketing landing page |
| `/about` | About | Company info |
| `/contact` | Contact | Contact form + map |
| `/auth` | Auth | Patient login/register |
| `/admin` | StaffAuth | Doctor/Admin login (role selector) |
| `/book` | BookAppointment | Booking flow (auth required) |
| `/chat` | Chat | Full-page AI chat (auth required) |
| `/feedback` | Feedback | Patient feedback form (auth required) |
| `/dashboard/patient` | PatientDashboard | Appointments, vitals, payments, reports |
| `/dashboard/doctor` | DoctorDashboard | Appointment queue, completion, vitals entry |
| `/dashboard/admin` | AdminDashboard | Services, staff management, appointments, inquiries |
| `*` | → redirects to `/` | Catch-all |

Shared layout: `Navbar`, `Footer`, `FloatingChatbot` widget (visible site-wide), page transition + notification "island" animations.

---

## 8. Environment Variables

Backend `.env` (see `backend/.env.example`):

```
FRONTEND_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
GOOGLE_API=your_google_api_key
DOCTOR_DAILY_APPOINTMENT_LIMIT=3
PORT=5000
STATUS=dev              # "production" enables secure cookies / sameSite=none
```

Frontend:
```
VITE_API_URL=http://localhost:5000/api   # optional, defaults to this
```

---

## 9. Running Locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm start               # node index.js — runs on PORT (default 5000)
```

**Frontend**
```bash
cd frontend
npm install
npm run dev              # Vite dev server, default port 5173
```

CORS is restricted to `localhost` (any port) and `process.env.FRONTEND_URL`, with credentials enabled for the cookie-based auth flow.

---

## 10. Known Behaviors / Gotchas

- **Frontend caching**: `frontend/src/services/api.js` maintains parallel `localStorage` caches (`medicare_services`, `medicare_doctors`, `medicare_appointments`, `medicare_messages`) as fallbacks when API calls fail — useful for offline/demo resilience but can drift from the DB if not refreshed.
- **Role authorization** is enforced per-route in the handler body, not via reusable middleware — new routes must remember to add the check.
- **Payment field typo**: the schema/field is `transcation` (not `transaction`) — intentional throughout backend and frontend for consistency.
- **Vercel deployment**: `backend/vercel.json` routes all paths to `index.js` as a single serverless function.
- **DNS**: backend explicitly sets DNS servers to `1.1.1.1` / `8.8.8.8` (likely to work around resolution issues with MongoDB Atlas on some hosts).