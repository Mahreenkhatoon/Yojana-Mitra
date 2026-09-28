# 🏛️ Smart Government Schemes – Eligibility & Benefit Tracker

A full-stack MERN web application that helps Indian citizens discover government schemes they may be eligible for, with personalised eligibility analysis and official application links.

---

## 🖥️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router 6, Axios, CSS3   |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB / MongoDB Atlas                 |
| Auth      | JWT (JSON Web Tokens), bcryptjs         |
| Security  | Helmet, CORS, express-rate-limit        |

---

## 📁 Project Structure

```
smart gov website/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Route handler logic
│   ├── middleware/      → JWT auth + Eligibility Engine
│   ├── models/          → Mongoose models (User, Scheme, Category, SavedScheme)
│   ├── routes/          → API route definitions
│   ├── scripts/         → Seed data script
│   ├── .env             → Environment variables (create from .env.example)
│   ├── .env.example     → Environment variable template
│   ├── package.json
│   └── server.js        → Express app entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  → Reusable components (Navbar, Footer, SchemeCard…)
│       ├── context/     → React Context (AuthContext)
│       ├── pages/       → Page components
│       ├── services/    → Axios API service layer
│       ├── App.js       → Routes and app shell
│       ├── index.js
│       └── index.css    → Global styles and design tokens
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or later – https://nodejs.org
- **MongoDB** (either local install or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster)
- **npm** (comes with Node.js)

---

## 🚀 Setup Instructions

### Step 1 – Clone / Open the project

```bash
cd "e:\college-project\smart gov website"
```

### Step 2 – Set up the Backend

```bash
cd backend
npm install
```

Copy the environment file:

```bash
copy .env.example .env
```

Open `.env` and set your MongoDB URI:

```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/smart_gov_schemes

# OR MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_gov_schemes
```

> **Tip:** The other default values (JWT_SECRET, ADMIN_EMAIL, etc.) work for local development. Change JWT_SECRET before deploying.

### Step 3 – Seed the Database

This creates 12 sample schemes, 10 categories, and one admin account:

```bash
npm run seed
```

You will see:
```
✅  Inserted 10 categories.
✅  Inserted 12 schemes.
✅  Admin account created: admin@smartgov.in
────────────────────────────────────────────
  Admin email    : admin@smartgov.in
  Admin password : Admin@1234
────────────────────────────────────────────
```

### Step 4 – Start the Backend

```bash
npm run dev
```

The API will run at **http://localhost:5000**

### Step 5 – Set up the Frontend

Open a **new terminal window**:

```bash
cd "e:\college-project\smart gov website\frontend"
npm install
npm start
```

The React app will open at **http://localhost:3000**

---

## 🔑 Default Credentials

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@smartgov.in    | Admin@1234 |

Register a regular user account from http://localhost:3000/register

---

## 📖 Feature Walkthrough

| Feature                | URL                  |
|------------------------|----------------------|
| Home page              | /                    |
| Check eligibility      | /eligibility         |
| View results           | /results             |
| Explore schemes        | /schemes             |
| Single scheme detail   | /schemes/:id         |
| User dashboard         | /dashboard           |
| Admin dashboard        | /admin               |
| Login                  | /login               |
| Register               | /register            |

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint                   | Auth | Description             |
|--------|----------------------------|------|-------------------------|
| POST   | /api/auth/register         | ❌   | Register new user       |
| POST   | /api/auth/login            | ❌   | Login                   |
| GET    | /api/auth/me               | ✅   | Get current user        |
| PUT    | /api/auth/profile          | ✅   | Update profile          |
| PUT    | /api/auth/change-password  | ✅   | Change password         |

### Schemes
| Method | Endpoint                   | Auth | Description             |
|--------|----------------------------|------|-------------------------|
| GET    | /api/schemes               | ❌   | Get all schemes (filter/search/sort/paginate) |
| GET    | /api/schemes/featured      | ❌   | Get featured schemes    |
| GET    | /api/schemes/saved         | ✅   | Get saved schemes       |
| GET    | /api/schemes/:id           | ❌   | Get single scheme       |
| POST   | /api/schemes/:id/save      | ✅   | Bookmark a scheme       |
| DELETE | /api/schemes/:id/save      | ✅   | Remove bookmark         |

### Eligibility
| Method | Endpoint                   | Auth | Description             |
|--------|----------------------------|------|-------------------------|
| POST   | /api/eligibility/check     | ❌   | Check eligibility (guest or logged-in) |

**Request body:**
```json
{
  "profile": {
    "age": 25,
    "gender": "female",
    "state": "Maharashtra",
    "income": 150000,
    "occupation": "student",
    "category": "obc",
    "location": "urban",
    "disability": false,
    "bankAccount": true,
    "landOwnership": false
  }
}
```

### Categories
| Method | Endpoint                   | Auth  | Description            |
|--------|----------------------------|-------|------------------------|
| GET    | /api/categories            | ❌    | Get all categories     |
| POST   | /api/categories            | Admin | Create category        |
| PUT    | /api/categories/:id        | Admin | Update category        |
| DELETE | /api/categories/:id        | Admin | Delete category        |

### Admin
| Method | Endpoint                      | Auth  | Description            |
|--------|-------------------------------|-------|------------------------|
| GET    | /api/admin/stats              | Admin | Dashboard stats        |
| GET    | /api/admin/users              | Admin | List users             |
| PATCH  | /api/admin/users/:id/toggle   | Admin | Activate/deactivate    |
| GET    | /api/admin/schemes            | Admin | List all schemes       |
| POST   | /api/admin/schemes            | Admin | Create scheme          |
| PUT    | /api/admin/schemes/:id        | Admin | Update scheme          |
| DELETE | /api/admin/schemes/:id        | Admin | Delete scheme          |
| PATCH  | /api/admin/schemes/:id/toggle | Admin | Toggle active status   |

---

## 🧠 Eligibility Engine

The engine (`backend/middleware/eligibilityEngine.js`) evaluates each scheme's rule set against the user's profile. Supported rule operators:

| Operator  | Meaning                              |
|-----------|--------------------------------------|
| `lte`     | field ≤ value                       |
| `gte`     | field ≥ value                       |
| `lt`      | field < value                       |
| `gt`      | field > value                       |
| `eq`      | field == value (case-insensitive)   |
| `ne`      | field != value                      |
| `in`      | field is in array                   |
| `nin`     | field is NOT in array               |
| `between` | value ≤ field ≤ valueMax           |
| `boolean` | Boolean(field) === Boolean(value)   |

Each rule returns `{ passed: true|false|null, message: "✅/❌ Human readable" }`.

Results are sorted: **Eligible → Partially Eligible → Not Eligible**.

---

## ⚠️ Disclaimer

This is an **educational / college project**. Scheme data is based on publicly available information and is for demonstration purposes only. This platform is **not affiliated** with any Indian government body. Always verify eligibility criteria on official government portals before applying.

---

## 📜 Included Sample Schemes

1. PM-KISAN – Farmer income support (₹6,000/year)
2. PMAY-G – Rural housing assistance
3. Ayushman Bharat PM-JAY – Health insurance (₹5 lakh/family)
4. PM MUDRA Yojana – Micro-enterprise loans
5. National Scholarship Portal – Education scholarships
6. MGNREGA – Rural employment guarantee
7. PMJJBY – Life insurance (₹2 lakh at ₹436/year)
8. PMSBY – Accidental insurance (₹2 lakh at ₹20/year)
9. PM Kaushal Vikas Yojana – Skill development
10. Beti Bachao Beti Padhao – Girl child welfare
11. IGNOAPS – Old age pension
12. PM SVANidhi – Street vendor loans
13. Stand-Up India – SC/ST & women entrepreneur loans
#   Y o j a n a - M i t r a  
 