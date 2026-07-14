# 🎓 Hazara University SUAMS
### Smart University Appointment Management System (SUAMS)

SUAMS is a production-ready, enterprise-grade digital portal built specifically for **Hazara University Mansehra** to streamline the appointment booking and scheduling workflow across all administrative desks and academic faculties. It provides advanced features like multi-step appointment wizard, role-based dashboards, AI-powered routing suggestions, automated priority detection, and real-time security logging.

---

## 🚀 Core Features

- **🎓 Hazara University Branding**: Strict professional alignment with official campus assets, color palettes (Deep Green `#1B4D3E`, Gold `#C5A028`), navbars, footer links, and printable slip headers.
- **🛡️ 15 Role Access-Control (RBAC)**: Personalized views for:
  - *Students*, *Teachers*, *Parents*, *Visitors*, *Alumni* (Client Booking desks).
  - *Vice Chancellor*, *Registrar*, *Deans*, *Chairmen*, *HODs*, *Directors*, *Controller of Examinations*, *Treasurer*, *Student Affairs Officer* (Officials).
  - *Secretariat Assistants* (Approval queues management desks).
  - *Super Admin* (Complete registry and database manager).
- **🤖 AI Intelligent Chatbot**: A global floating bot parsing natural language to match departments, suggest optimal slot dates, compute urgency levels, and preview summaries.
- **📑 Digital printable QR Slip**: Success ticket containing slot time windows, official targets, interactive map coordinates, and security verification codes.
- **🏛️ University Registry Tabs**: Setup panels for faculties, departments (HOD allocations), and specific degree BS programs (AI, CS, SE, IT, Pharmacy, Law, etc.).
- **⚙️ SMTP Settings & DB SQL Dumps**: Export settings panel to configure gateway variables and download database snapshots with one click.
- **📊 Interactive Traffic Load Charts**: Weekly load statistics, active users distributions, and peak hours distribution vectors.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Variables, Tailwind CSS
- **Database & ORM**: SQL Server, Prisma ORM (with automatic JSON file-based database fallback for local offline development)
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 📂 Project Structure

```text
suams-app/
├── app/
│   ├── (auth)/              # Authentication Routes (Login, Register, Forgot Password)
│   ├── (dashboard)/         # Role-Based Dashboard Hubs (Admin, Student, Official, Assistant)
│   ├── api/                 # Backend REST Endpoints (Appointments, Officials, Auth)
│   ├── appointments/        # Multi-Step Booking Portal
│   ├── globals.css          # Design System Token Definitions
│   └── layout.tsx           # Global Providers & Floating AI Assistant injection
├── components/
│   ├── dashboard/           # Sidebar, DashboardHeader and widgets
│   ├── chatbot/             # AI Floating Chatbot Component
│   └── Providers.tsx        # NextAuth & UI Wrappers
├── lib/
│   ├── auth.ts              # NextAuth JWT Adapter logic
│   ├── db.ts                # Prisma client singleton (with file fallback)
│   └── permissions.ts       # RBAC Authorization tables
├── prisma/
│   └── schema.prisma        # SQL Server Relational Database Schema
└── public/
    └── assets/              # Hazara University brand logos
```

---

## 📦 Installation & Setup

### 1. Clone the repository and install dependencies
```bash
cd suams-app
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:
```env
NEXTAUTH_SECRET=your_nextauth_jwt_hash_key
NEXTAUTH_URL=http://localhost:3000

# Database configurations
DATABASE_URL="sqlserver://localhost:1433;database=suams;user=sa;password=SecretPassword;encrypt=true;trustServerCertificate=true;"
```
*(If no SQL Server instance is detected, the app automatically fails over to the local mock database `db.json` to allow compile-safe offline testing).*

### 3. Generate Prisma Clients & Schema Migrations
```bash
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** inside your browser.

---

## 🛡️ Cybersecurity & Audit Compliance
- **Cyclic reference resolution** mapped with `onDelete: NoAction` constraints.
- **Edge runtime compilation safety** achieved by separating middleware config configurations.
- **Audit Logs Ledger**: Tracks all administrator activations and credentials overrides inside security tables.

---

## 📄 License & Authors
Developed by Hazara University Department of Computer Science & Information Technology.
For inquiries, contact: `support@hu.edu.pk`.
