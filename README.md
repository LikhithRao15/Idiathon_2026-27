# 🌿 ಹಸಿರು ಸಂವಾದ — Reimagine Waste Management Ideathon 2026–27

A complete, production-grade, full-stack platform built for the **Hasiru Samvadha Ideathon (2026–27)** featuring a **Bilingual Next.js 14 Web Application**, a robust **Node.js/Express.js REST API**, **MongoDB Atlas** persistence, **Fast2SMS** multi-recipient broadcasting, and strict Role-Based Access Control (**Participant**, **Panelist**, **Admin**).

---

## 🚀 Key Highlights & Architecture

- **🌱 Bilingual Landing Page**: Full English and Kannada (ಕನ್ನಡ) language switching, smooth natural scrolling, countdown timer, challenge tracks, timeline, rubric, and event poster modal.
- **⚡ Embedded Pitch Workspace (`#pitch`)**: Authenticated team leaders can create teams, manage members, draft, and submit Round 1 proposals directly on the landing page or via the dedicated portal.
- **📱 Multi-Recipient SMS & Email**: Direct Fast2SMS Bulk V2 quick SMS API with mock fallback. SMS alerts are automatically broadcast to team leaders and teammates upon registration, team creation, and advancement.
- **🎯 3 Official Themes**:
  1. *Waste Management* (Segregation, IoT bins, community incentives)
  2. *Handling Waste* (Hazardous/E-waste, worker safety, collection logistics)
  3. *Waste Disposal* (Composting, landfill reduction, circular recycling)
- **📅 Exact Milestone Timeline**:
  - **Round 1 (Idea Pitching Proposal)**: Oct 2, 2026 – Nov 1, 2026
  - **Round 2 (Idea Elaboration & 90-Day Plan)**: Nov 2, 2026 – Dec 1, 2026
  - **Grand Finale Stage Pitch**: Dec 15, 2026
- **📞 Unified Footer with Helplines**:
  - 📞 **Helpdesk 1 · General & Registration**: `+91 98800 12345`
  - 📞 **Helpdesk 2 · Technical & Pitch Support**: `+91 98800 23456`
  - 📞 **Helpdesk 3 · Mentorship & Rounds Desk**: `+91 98800 34567`
  - ✉️ **Official Support Email**: `hasirusamvada@reimagine.org`

---

## ⚡ Quick Start: Running Full-Stack

### 1. Clone the Repository
```bash
git clone https://github.com/LikhithRao15/Idiathon_2026-27.git
cd Idiathon_2026-27
```

### 2. Install Dependencies for Both Backend & Frontend
```bash
npm run install:all
```
*(Or install individually: `cd backend && npm install` and `cd frontend && npm install`)*

---

### 3. Setup Environment Variables

#### Backend Configuration (`backend/.env`):
Create `backend/.env` from `backend/.env.example`:
```env
PORT=5001
NODE_ENV=development
API_PREFIX=/api
CLIENT_URL=http://localhost:3000

# MongoDB URI (MongoDB Atlas or Local MongoDB)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ideathon_2026

# JWT Secret
JWT_SECRET=super_secret_jwt_key_for_ideathon_management_system_2026
JWT_EXPIRES_IN=7d

# Team Constraints
MAX_TEAM_SIZE=4
MIN_TEAM_SIZE=2

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=test@ideathon.org
SMTP_PASS=password123
EMAIL_FROM_NAME="Hasiru Samvadha Ideathon"
EMAIL_FROM_ADDRESS="no-reply@ideathon.org"

# Fast2SMS Provider Configuration
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_fast2sms_api_key_here
SMS_SENDER_ID=FSTSMS
```

#### Frontend Configuration (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

### 4. Seed Database with Official Data
Populate MongoDB Atlas with official themes, timeline rounds, admin, panelists, and sample teams:
```bash
cd backend
npm run seed
```

---

### 5. Start Full-Stack Application

#### Run Both Backend and Frontend Concurrently:
From the root project directory:
```bash
npm run dev
```

- 🌐 **Frontend Web App**: `http://localhost:3000`
- ⚙️ **Backend REST API**: `http://localhost:5001/api`
- 🩺 **Health Check**: `http://localhost:5001/api/health`

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Access & Capabilities |
|---|---|---|---|
| **Admin** | `admin@ideathon.org` | `Password@123` | Full administrative console (`/admin`), round reviews, finalist passes |
| **Panelist 1** | `panelist1@ideathon.org` | `Password@123` | Jury evaluation dashboard (`/panelist`) |
| **Panelist 2** | `panelist2@ideathon.org` | `Password@123` | Jury evaluation dashboard (`/panelist`) |
| **Participant 1** | `rohan@example.com` | `Password@123` | Leader of **EcoTransformers** (Round 1 Submitted) |
| **Participant 2** | `priya@example.com` | `Password@123` | Leader of **HealthAI Diagnostics** (Round 1 Selected, Round 2 Dossier) |
| **Participant 3** | `kavya@example.com` | `Password@123` | Leader of **AgriVision IoT** (Grand Finalist with Stage Pass) |

---

## 📁 Project Structure

```
Idiathon_2026-27/
│
├── frontend/                     # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/            # Admin Command Console (/admin)
│   │   │   ├── panelist/         # Panelist Evaluation Portal (/panelist)
│   │   │   ├── participant/      # Participant Workspace (/participant)
│   │   │   ├── login/            # Authentication (/login)
│   │   │   ├── register/         # Team Leader Registration (/register)
│   │   │   ├── globals.css       # Bespoke design tokens & responsive CSS
│   │   │   ├── layout.js         # Global Layout (Navbar + Footer)
│   │   │   └── page.js           # Bilingual Landing Page + Floating Nav
│   │   ├── components/
│   │   │   ├── Navbar.js         # Unified frosted glass header
│   │   │   ├── Footer.js         # Unified footer with 3 sample helplines
│   │   │   └── IdeaPitchSection.js # Embedded Pitch & Team Workspace (#pitch)
│   │   ├── context/
│   │   │   └── AuthContext.js    # JWT session & toast notification state
│   │   └── lib/
│   │       └── api.js            # Standardized API client wrapper
│   ├── public/                   # Static assets & event reference poster
│   └── package.json
│
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # Database connection & env loader
│   │   ├── controllers/          # Business logic (auth, team, r1, r2, admin, etc.)
│   │   ├── middleware/           # Auth (JWT), role checking (RBAC), validator
│   │   ├── models/               # Mongoose Schemas (User, Team, Theme, Submissions)
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Fast2SMS, Email, and multi-recipient notification
│   │   ├── utils/                # Token generation, team IDs, responses
│   │   ├── validators/           # Express-validator schemas & word counts
│   │   ├── app.js                # Express app setup & CORS
│   │   └── seed.js               # Database population script
│   ├── server.js                 # HTTP Server entrypoint
│   └── package.json
│
├── package.json                  # Root npm scripts (dev, start, install:all)
├── .gitignore                    # Git exclusions
└── README.md
```

---

## 🔄 Competition Workflow & Lifecycle

```mermaid
graph TD
    A[Team Leader Registers on Landing Page] --> B[Create Team & Select Theme]
    B --> C[Round 1: Idea Pitching Proposal (150-200 words)]
    C -->|Submit| D[Assigned Panelists Evaluate Round 1]
    D --> E{Admin Round 1 Review}
    E -->|REJECT| F[Status: NOT_SELECTED<br>Round 2 Locked]
    E -->|SELECT| G[Status: SELECTED<br>Round 2 Dossier Automatically Unlocked]
    G --> H[Round 2: Deep-Dive Concept, Circularity, 90-Day Plan]
    H -->|Submit| I[Assigned Panelists Evaluate Round 2]
    I --> J{Admin Round 2 Review}
    J -->|REJECT| K[Status: NOT_SELECTED]
    J -->|SELECT| L[Status: FINALIST<br>SMS/Email Broadcast]
    L --> M[Admin Issues Grand Finale Pass & Slot]
    M --> N[Grand Finale Stage Evaluation on Dec 15, 2026]
```

---

## 🔒 Business & Security Rules

1. **Strict Round 2 Gate**: Only teams whose status is `SELECTED` in Round 1 can access or submit Round 2.
2. **Designated Leader Rule**: Only the designated team leader registers and manages the pitch. Teammate emails and phone numbers receive notification alerts.
3. **Panelist Assignment Isolation**: Jury members only have access to submissions explicitly assigned to them by the administrator.
4. **Resilient Fast2SMS**: Fast2SMS Bulk V2 quick SMS API with automatic fallback ensuring SMS deliveries never block critical workflow transitions.
5. **Word Count Validation**: Round 1 and Round 2 inputs enforce strict word boundaries (e.g. 1000 words concept, 150 words value proposition, 200 words 90-day plan).

---

## 📡 API Endpoints Summary

| Module | Endpoint | Method | Description | Access |
|---|---|---|---|---|
| **Auth** | `/api/auth/register` | `POST` | Register team leader | Public |
| **Auth** | `/api/auth/login` | `POST` | Login & receive JWT | Public |
| **Auth** | `/api/auth/me` | `GET` | Get current user profile | Authenticated |
| **Themes** | `/api/themes` | `GET` | List the 3 active themes | Public |
| **Teams** | `/api/teams` | `POST` | Create team & add members | Participant |
| **Teams** | `/api/teams/my-team` | `GET` | Fetch active team & progress | Participant |
| **Round 1** | `/api/round1/submit` | `POST` | Submit Round 1 pitch | Participant Leader |
| **Round 1** | `/api/round1/submission` | `GET` | View Round 1 pitch | Authenticated |
| **Round 2** | `/api/round2/submit` | `POST` | Submit Round 2 dossier | Selected Leader |
| **Round 2** | `/api/round2/submission` | `GET` | View Round 2 dossier | Authenticated |
| **Evaluation** | `/api/evaluations/round1` | `POST` | Score Round 1 submission | Assigned Panelist |
| **Evaluation** | `/api/evaluations/round2` | `POST` | Score Round 2 submission | Assigned Panelist |
| **Admin** | `/api/admin/dashboard` | `GET` | Stage metrics & funnel statistics | Admin |
| **Admin** | `/api/admin/teams/:id/round1/select` | `PUT` | Select team for Round 2 | Admin |
| **Admin** | `/api/admin/teams/:id/round2/select` | `PUT` | Promote team to Finalist | Admin |
| **Admin** | `/api/admin/finalists` | `POST` | Issue Finalist Pass & Slot | Admin |
| **Admin** | `/api/admin/assign-panelist` | `POST` | Assign panelist to team | Admin |
| **Notifications**| `/api/notifications` | `GET` | List notifications & alerts | Authenticated |

---

## 📜 License
Licensed under the ISC License. Developed for Hasiru Samvadha Ideathon 2026–27.
