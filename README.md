# TaskFortress — Full-Stack Role-Based Task Management System

> **A rudimentary approach was initially taken during the early stages of the project to quickly satisfy the core project requirements and validate the overall workflow. As the project evolved, significant focus was placed on improving the UI/UX components on the mobile side and restructuring the backend architecture to mimic a production-grade system with better modularity, scalability, maintainability, and separation of concerns.**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Setup Instructions](#2-setup-instructions)
3. [Project Structure](#3-project-structure)
4. [Mobile Architecture](#4-mobile-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Features Implemented](#6-features-implemented)
7. [Technical Challenges & Improvements](#7-technical-challenges--improvements)
8. [Production-Oriented Design Decisions](#8-production-oriented-design-decisions)
9. [Conclusion](#9-conclusion)

---

## 1. Project Overview

### Purpose

TaskFortress is a full-stack mobile task management application built for teams that require strict **Role-Based Access Control (RBAC)**. It solves the problem of uncontrolled task delegation within organisations — a common pain point where standard task apps give every member equal power to create, modify, and delete work items, leading to disorganised workflows.

### Problem It Solves

In most team task apps, every user can create and assign tasks freely, causing noise and accountability gaps. TaskFortress enforces a two-tier model:

- **System Administrator**: Has full CRUD authority. Responsible for creating tasks, setting priority and category, assigning them to specific team members, and deleting or editing tasks as requirements change.
- **Standard User**: Has a read-and-progress-only view. They see only the tasks assigned to them and can mark tasks as complete. They cannot create, edit, or see tasks belonging to other users.

This separation ensures accountability, reduces clutter, and mirrors how real-world project management tools enforce access boundaries.

### High-Level System Goals

- Enforce RBAC at every layer — route, service, and UI.
- Provide a premium, high-fidelity mobile experience using custom typography and dark-mode design.
- Build a backend that is modular, testable, and production-aligned even at a learning-project scale.
- Ensure the data flow between mobile and backend is clean, predictable, and JWT-secured.

### Technology Choices

**React Native (Expo)** was chosen for the mobile layer because it enables a single codebase to target both Android and iOS, dramatically reducing development time. Expo's managed workflow further accelerates iteration with features like live reload and font management.

**Node.js + Express + TypeScript** was chosen for the backend because of its performance in I/O-heavy tasks, the richness of the npm ecosystem, and TypeScript's ability to enforce strong contracts across the API surface — essential for a growing codebase.

**MongoDB (Mongoose)** was selected as the database for its flexibility in schema design and its natural JSON-document model, which aligns well with the JavaScript ecosystem end-to-end.

### Architectural Evolution

The project began as a simple prototype: a monolithic Express server with flat route handlers, and a React Native app with hardcoded mock data in `AsyncStorage`. This allowed rapid validation of the core idea.

As requirements matured, the system was progressively refactored:

- The backend adopted a **Layered Architecture** (Routes → Controllers → Services → Repositories → Models) to separate HTTP concerns from business logic and data access.
- The mobile app moved from `AsyncStorage` mocks to a **real API integration** via Axios with JWT interceptors.
- State management was formalised using **Zustand** with optimistic UI patterns.
- The UI was rebuilt with a professional **design system** — custom fonts (Space Grotesk, DM Sans, DM Mono), a dark-mode colour palette, and reusable component primitives.

---

## 2. Setup Instructions

### Prerequisites (Both)

- Node.js v18 or higher
- npm v9 or higher
- Git

---

### 2.1 Backend Setup

#### Prerequisites

- MongoDB running locally, or a MongoDB Atlas connection string.

#### Environment Variables

Create a `.env` file in the project root (alongside `/src`):

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskfortress
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=*
```

#### Installation

```bash
# From the project root
npm install
```

#### Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`. Watch mode is enabled via `ts-node-dev` — changes to source files trigger an automatic restart.

#### Run Production Server

```bash
npm run build
npm start
```

#### Seed Admin Account

An admin account is required before any task operations can be performed. Run the seed script once after the database is connected:

```bash
npx ts-node src/seed-admin.ts
```

**Default Admin Credentials:**
- Email: `admin@taskfortress.com`
- Password: `Admin@123`

---

### 2.2 Mobile Setup

#### Prerequisites

- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your physical device **or** Android Studio / Xcode for emulators.
- Ensure your machine and device are on the **same Wi-Fi network** for Expo Go.

#### Update the API URL

Open `mobile/src/services/api.ts` and set the `API_URL` to your machine's local IP address:

```typescript
// For Android emulator use: http://10.0.2.2:3000/api/v1
// For physical device use: http://<YOUR_MACHINE_IP>:3000/api/v1
// For iOS simulator use: http://localhost:3000/api/v1
const API_URL = 'http://192.168.x.x:3000/api/v1';
```

#### Installation

```bash
cd mobile
npm install
```

#### Run Metro Bundler

```bash
npx expo start
```

#### Run on Device

- **Physical device**: Scan the QR code in the Expo Go app.
- **Android emulator**: Press `a` in the Metro terminal.
- **iOS simulator**: Press `i` in the Metro terminal (macOS only).

#### Build Commands

```bash
# Development build for Android
npx expo run:android

# Development build for iOS
npx expo run:ios

# Production APK (EAS Build required)
npx eas build --platform android --profile production
```

---

## 3. Project Structure

```
React-native-app/
├── src/                          # Backend source
│   ├── app.ts                    # Express app factory
│   ├── server.ts                 # Server entry point
│   ├── seed-admin.ts             # Admin seeding utility
│   ├── config/
│   │   └── env.config.ts         # Centralised env validation
│   ├── common/
│   │   ├── constants/            # Shared enums (Role, TaskStatus, Priority)
│   │   ├── errors/               # Custom AppError class
│   │   ├── middleware/           # Auth, role, validate, error handler
│   │   └── utils/                # Response helpers, pagination
│   └── modules/
│       ├── auth/                 # Login, register, JWT issuance
│       ├── tasks/                # Full CRUD task management
│       └── users/                # User listing for admin assignment
│
└── mobile/
    ├── App.tsx                   # Root component, font loader
    ├── index.ts                  # Expo entry point
    └── src/
        ├── navigation/
        │   └── RootNavigator.tsx # Auth/Admin/User routing
        ├── store/
        │   ├── authStore.ts      # JWT session management (Zustand)
        │   └── taskStore.ts      # Task CRUD state (Zustand)
        ├── screens/
        │   ├── LandingScreen.tsx
        │   ├── LoginScreen.tsx
        │   ├── SignUpScreen.tsx
        │   ├── AdminDashboardScreen.tsx
        │   ├── TaskListScreen.tsx
        │   ├── CreateTaskScreen.tsx
        │   ├── EditTaskScreen.tsx
        │   ├── TaskDetailScreen.tsx
        │   └── ProfileScreen.tsx
        ├── components/
        │   ├── TaskCard.tsx
        │   ├── BottomTabBar.tsx
        │   ├── ScreenWrapper.tsx
        │   ├── Button.tsx
        │   ├── Input.tsx
        │   └── Badge.tsx
        ├── services/
        │   ├── api.ts            # Axios instance + interceptors
        │   └── userService.ts    # User API calls
        ├── theme/
        │   └── theme.ts          # Design tokens (colours, typography, spacing)
        └── types/
            └── index.ts          # Shared TypeScript interfaces
```

### Folder Responsibility Breakdown

| Folder | Responsibility | Why It Exists |
|--------|---------------|---------------|
| `src/common/` | Cross-cutting concerns shared across all modules | Prevents duplication; centralises error handling, middleware, and constants |
| `src/modules/` | Feature-grouped business domains | Each module owns its model, DTO, repository, service, controller, and routes — enabling independent scaling |
| `mobile/src/store/` | Global reactive state (Zustand) | Decouples UI from data-fetching; makes state predictable and testable |
| `mobile/src/services/` | Network layer abstraction | Centralises all API calls; interceptors handle auth and error consistently |
| `mobile/src/theme/` | Design token system | Ensures visual consistency; a single edit propagates across the entire app |
| `mobile/src/types/` | TypeScript interfaces | Prevents type drift between mobile and backend; acts as a shared contract |

---

## 4. Mobile Architecture

### Architecture Pattern

The mobile app follows a **Modular Component Architecture** with clear separation between:

1. **Presentation Layer** — screens and components that render UI only.
2. **State Layer** — Zustand stores that own data and expose actions.
3. **Network Layer** — services that abstract API calls.
4. **Navigation Layer** — RootNavigator that controls screen access based on authentication state and user role.

This is a practical approximation of Clean Architecture principles adapted for React Native, where the "use case" layer is represented by Zustand actions and service functions.

### State Management — Zustand

Zustand was selected over Redux for three reasons:

1. **No boilerplate** — There are no reducers, action creators, or dispatchers. The store is a plain JavaScript object with async actions.
2. **Optimistic UI** — The `deleteTask` action removes the item from local state immediately before the API call resolves, making the UI feel instant. If the API fails, the previous state is restored.
3. **Persistence** — `AsyncStorage` persists the JWT token and user object across app restarts without complex middleware.

**Data Flow:**

```
User Action → Screen (onPress) → Zustand Action → api.ts → Backend API
                                       ↓
                              Optimistic UI Update
                                       ↓
                              Server Response / Rollback
```

### Navigation Architecture

`RootNavigator.tsx` is the single source of truth for which screens are accessible. It operates on three states:

1. **Loading** — While `checkAuth()` reads from `AsyncStorage`, a full-screen spinner is shown.
2. **Unauthenticated** — The Auth Stack is shown: `Landing → Login → SignUp`.
3. **Authenticated** — Role is checked:
   - `ADMIN` → `AdminTabs` (Dashboard, CreateTask, Profile)
   - `USER` → `UserTabs` (TaskList, Profile)

Stack screens (`TaskDetail`, `EditTask`) sit outside the tabs and are accessible from within both tab stacks as modals, providing a natural "push and pop" navigation pattern without duplicating screen registrations.

### API Layer

`mobile/src/services/api.ts` creates a configured **Axios instance** with:

- **Base URL**: Configurable per environment.
- **Request interceptor**: Reads the JWT from `AsyncStorage` and attaches it as a `Bearer` token on every outbound request.
- **Response interceptor**: Catches `401 Unauthorized` responses globally and calls `authStore.logout()` automatically, clearing the session and redirecting the user to the login screen without any per-screen handling.

`userService.ts` is a thin wrapper over `api.ts` that encapsulates the `GET /users` call, keeping screen components free from raw axios usage.

### UI/UX Design System

The redesign was driven by the principle that a productivity application should feel as premium as the problem it solves. The design system is codified in `theme.ts`:

| Token | Value | Purpose |
|-------|-------|---------|
| `background` | `#0D0D0D` | OLED-black base for battery efficiency |
| `primary` | `#A0D8FF` | Soft blue accent for interactive elements |
| `lightAccent` | `#C799FF` | Purple for secondary highlights |
| `successAccent` | `#81C784` | Green for completed states |
| `heading font` | `Space Grotesk Bold` | Technical, editorial character for headings |
| `body font` | `DM Sans Regular` | High readability for body copy |
| `mono font` | `DM Mono Regular` | Machine-like precision for dates and IDs |

**TaskCard Variants** cycle through three visual themes (`accent`, `dark`, `purple`) using `getCardVariant(index)`, creating a rhythmic, editorial list layout that feels intentional rather than repetitive.

### Performance Considerations

- `FlatList` is used instead of `ScrollView` for all task lists. `FlatList` virtualises off-screen items, which is critical for lists that may grow to hundreds of tasks.
- Optimistic UI in `taskStore.ts` eliminates perceived latency by updating state before the server responds.
- `useEffect` in list screens only runs `fetchTasks()` on mount — subsequent renders do not re-trigger network calls unless explicitly requested.

---

## 5. Backend Architecture

### Architectural Philosophy

The backend was **intentionally designed to mimic a production-grade architecture**. Even though the project began as a rapid prototype, the decision was made early to refactor the backend into a structure that a real engineering team would recognise and be able to maintain, extend, and test with confidence.

The guiding principle is **separation of concerns at every layer**: each layer has one job, and it does not bleed into adjacent layers.

### Layered Architecture

```
HTTP Request
     │
     ▼
┌─────────────┐
│   Routes    │  Defines URL patterns and assigns middleware chains
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  Authentication, role checks, request validation (Zod)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  Thin HTTP handlers — extract params, call service, format response
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  All business logic and policy enforcement
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ Repositories │  All database queries — no business logic
└──────┬───────┘
       │
       ▼
┌─────────────┐
│   Models    │  Mongoose schema definitions and index declarations
└─────────────┘
       │
       ▼
HTTP Response
```

### Request Lifecycle

1. **Client** sends a `POST /api/v1/tasks` with a JWT header and task body.
2. **`authMiddleware`** validates the JWT and attaches `req.user` (userId + role).
3. **`roleMiddleware(Role.ADMIN)`** checks `req.user.role` — rejects non-admins with `403`.
4. **`validate(createTaskSchema)`** runs the Zod schema against `req.body` — rejects malformed payloads with structured `400` errors.
5. **`taskController.createTask`** extracts `req.user` and `req.body`, delegates entirely to the service.
6. **`taskService.createTask`** enforces the admin-only policy a second time (defence in depth), validates the `assignedTo` user exists, then calls the repository.
7. **`taskRepository.create`** performs the `Task.create()` Mongoose call and returns the populated document.
8. **Response**: `sendSuccess(res, 201, 'Task created successfully', task)` — a consistent JSON envelope.

### Controllers — Thin HTTP Handlers

Controllers contain **zero business logic**. Their sole responsibilities are:

- Parsing route params and query strings.
- Calling the appropriate service method.
- Passing the service result to `sendSuccess`.

This keeps controllers to under 10 lines per method, making them easy to read and impossible to hide bugs in.

### Services — The Authority Layer

The Service layer is the **single source of truth for business rules**. Even though `roleMiddleware` guards routes, the service repeats the role check internally. This is intentional — defence in depth ensures that a misconfigured route can never bypass a business rule.

Key policies enforced in services:
- Only admins can create, edit, or delete tasks.
- Users can only update the status of tasks assigned to them (not tasks belonging to others).
- `assignedTo` must reference a real user in the database before a task is created or reassigned.

Services are stateless and dependency-injectable, making them straightforward to unit test with mocked repositories.

### Middleware Stack

| Middleware | File | Responsibility |
|-----------|------|---------------|
| `authMiddleware` | `auth.middleware.ts` | Verifies JWT, attaches `req.user`, rejects with 401 |
| `roleMiddleware` | `role.middleware.ts` | Checks `req.user.role` against required role, rejects with 403 |
| `validate` | `validate.middleware.ts` | Runs Zod schema on `req.body`, returns structured 400 on failure |
| `errorHandler` | `error.middleware.ts` | Catches all thrown errors; maps `AppError` to HTTP codes |
| `notFoundHandler` | `error.middleware.ts` | Returns 404 for unregistered routes |
| `asyncHandler` | `utils/` | Wraps async route handlers to forward errors to `errorHandler` |

### Database Design

**Task Schema Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `title` | String (3–200 chars) | Task name |
| `description` | String (1–2000 chars) | Detailed instructions |
| `status` | Enum: PENDING, COMPLETED | Tracks progress |
| `priority` | Enum: LOW, MEDIUM, HIGH | Admin-set urgency level |
| `category` | Enum: DESIGN, DEVELOPMENT, TESTING, MARKETING, OPERATIONS, OTHER | Domain classification |
| `dueDate` | Date (nullable) | Target completion date |
| `tags` | String[] (max 10) | Free-form labels |
| `assignedTo` | ObjectId → User | The user responsible for the task |
| `createdBy` | ObjectId → User | Audit trail — who created the task |
| `timestamps` | Auto (createdAt, updatedAt) | Managed by Mongoose |

**Indexes:**
- `{ assignedTo: 1, status: 1 }` — Composite index for the primary USER query pattern.
- `{ createdBy: 1 }` — Index for admin queries filtered by creator.

### Authentication & Security

- **JWT-based**: On login, the server signs a token with `userId`, `role`, and `email` embedded as claims. The token is stateless — no server-side session storage is required.
- **Bcrypt**: Passwords are hashed with a cost factor of 10 before storage. Plain-text passwords are never persisted.
- **Zod validation**: All request bodies are validated by a strict Zod schema before reaching the controller. Malformed data is rejected at the boundary.
- **Helmet**: Adds HTTP security headers (XSS protection, no-sniff, etc.) to every response.
- **Environment variables**: All secrets (`JWT_SECRET`, `MONGODB_URI`) are loaded from `.env` via a validated `env.config.ts` — never hardcoded.

### Error Handling

All errors are instances of `AppError`, a custom class that carries an HTTP status code and a human-readable message. The global `errorHandler` middleware catches every thrown `AppError` and maps it to a consistent JSON response:

```json
{
  "success": false,
  "message": "Only administrators can create tasks",
  "statusCode": 403
}
```

This structured error contract means the mobile client can reliably read `error.response.data.message` for user-facing alerts.

---

## 6. Features Implemented

### 6.1 Role-Based Authentication System

**What it does**: Differentiates System Administrators from Standard Users at login. Each role renders a completely different UI.

**How it works**:
- Backend: `POST /api/v1/auth/login` validates credentials, signs a JWT with the user's `role` embedded.
- Mobile: `authStore.login()` stores the token and user object in `AsyncStorage`. `RootNavigator` reads the role and conditionally renders either `AdminTabs` or `UserTabs`.

**Architectural decision**: Role is encoded in the JWT itself (not a separate DB call) to keep authentication stateless and fast.

---

### 6.2 Task Creation (Admin-Only)

**What it does**: Admin fills a rich form to create a new task with title, description, priority (LOW/MEDIUM/HIGH), category (with emoji icons), due date, tags, and user assignment.

**How it works**:
- Mobile: `CreateTaskScreen` fetches the user list via `userService.getUsers()` on mount. On submit, `taskStore.createTask()` sends `POST /api/v1/tasks`.
- Backend: Validated by `createTaskSchema` (Zod), authorised by `roleMiddleware(ADMIN)`, business-validated in `TaskService.createTask()`.
- Optimistic UI: The new task is immediately prepended to the local task list.

---

### 6.3 Task Editing (Admin-Only)

**What it does**: Admin can modify any field of an existing task — including reassigning it to a different user.

**How it works**:
- Mobile: `TaskDetailScreen` shows a ✏️ edit button for admins. Tapping navigates to `EditTaskScreen` with the task pre-populated via `route.params`.
- Backend: `PUT /api/v1/tasks/:id` validates via `updateTaskSchema`, guards with `roleMiddleware(ADMIN)`, and uses `$set` in Mongoose to only update provided fields.

---

### 6.4 Task Deletion (Admin-Only)

**What it does**: Admin can permanently delete a task with a confirmation dialog.

**How it works**:
- Mobile: `TaskDetailScreen` shows a 🗑️ delete button for admins. Tap triggers `Alert.alert` with destructive confirmation. On confirm, `taskStore.deleteTask(id)` is called.
- Backend: `DELETE /api/v1/tasks/:id` — admin-only route. Optimistic removal on the client rolls back if the server returns an error.

---

### 6.5 Task Status Update (User)

**What it does**: Users can mark their assigned tasks as "Done."

**How it works**:
- Mobile: `TaskDetailScreen` shows a green "Mark as Done" button only if the task is not already completed. Calls `taskStore.updateTaskStatus(id, COMPLETED)`.
- Backend: `PATCH /api/v1/tasks/:id` — available to all authenticated users. Service layer verifies the user is the assignee before updating.
- Optimistic UI: Status updates immediately in the list; rolls back if the server rejects.

---

### 6.6 Admin Dashboard (System Overview)

**What it does**: Gives the admin a bird's-eye view of all company-wide tasks with high-level statistics (Users Active, Tasks Overdue, Completed).

**How it works**: `AdminDashboardScreen` calls `fetchTasks()` on mount. All tasks (regardless of assignee) are returned by the backend for admin users. Stats are displayed in a header panel above the FlatList.

---

### 6.7 User Task Feed (Personalised View)

**What it does**: Standard users see only tasks assigned to them — nothing else. Their feed is scoped by the backend at the data layer.

**How it works**: `TaskListScreen` calls `fetchTasks()`. The backend service checks `req.user.role` — for USER, it adds `{ assignedTo: req.user.userId }` to the MongoDB query filter, ensuring the data boundary is enforced at the database level, not just the UI.

---

### 6.8 Task Detail View

**What it does**: Full-screen detail view with two tabs — "Overview" (description, subtasks, action button) and "Details" (metadata: category, priority, due date, tags, creation date).

**How it works**: Screen receives a `task` object via `route.params`. Admin sees Edit/Delete buttons; User sees "Mark as Done" or a "Completed" banner based on task status.

---

### 6.9 Profile Management

**What it does**: Displays the authenticated user's name, email, and role badge. Provides a secure logout with confirmation dialog.

**How it works**: `ProfileScreen` reads from `useAuthStore()`. Logout calls `authStore.logout()`, which clears the JWT and user from `AsyncStorage` and resets state — triggering `RootNavigator` to re-render the auth stack.

---

## 7. Technical Challenges & Improvements



### Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Zustand over Redux | Simpler, less boilerplate — but less tooling for time-travel debugging |
| MongoDB over SQL | Flexible schema for rapid iteration — but requires careful index design for query performance |
| Expo Managed Workflow | Faster iteration — but limits native module integration (e.g., push notifications require EAS) |
| JWT (stateless) | No server-side session store needed — but token revocation requires short expiry or a blocklist |

---

## 8. Production-Oriented Design Decisions

### Why the Architecture Resembles Production Systems

The deliberate choice to adopt a production-grade architecture — even for a learning project — was made because architectural habits are formed early. Building with a rudimentary "everything in one file" approach teaches speed; building with layered architecture teaches **how to think**.

