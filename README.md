<div align="center">

<img src="./public/brand/logo-icon.png" width="90" alt="Performance Analytics logo" />

# Employee Performance Analytics

**A role-based HR performance analytics platform** — from Excel-cleaned raw
data, through a Power BI analysis layer, into a production Next.js
application serving three organisational roles from one shared PostgreSQL
database.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6B35)](https://recharts.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## Overview

Most performance-tracking tools show everyone the same dashboard. This
project does the opposite on purpose: a **CEO**, a **Manager**, and an
**Employee** logging into the same app see three completely different
views, each scoped server-side to exactly what that role is authorised to
see — company-wide, department-wide, or individual.

The project spans two workstreams end-to-end:

- **Data Analysis** — raw HR data cleaned in Excel, transformed and loaded
  into PostgreSQL via a Python ETL pipeline, first modelled as three
  role-specific Power BI dashboards.
- **Web Development** — a production Next.js application that reads from
  the same PostgreSQL database and serves live, interactive versions of
  those dashboards, with real authentication, security hardening, and a
  full custom design system.

Full write-ups of both workstreams are in [`/docs`](./docs):
[`Project_Documentation_Report.docx`](./docs/Project_Documentation_Report.docx)
(Web Developer) and
[`Data_Analysis_Project_Report.docx`](./docs/Data_Analysis_Project_Report.docx)
(Data Analyst).

---

## Who sees what

| Role | Route | Scope |
|---|---|---|
| **CEO** | `/ceo` | Full company-wide data, every department |
| **Manager** | `/manage/[department]` | Own department only — enforced server-side, not just hidden in the UI |
| **Employee** | `/employee/[id]` | Own record only — same server-side ownership check |
| **Tester** | `/test/[role]` | Simulates any of the three views above, for QA |

A Manager can't view another department by editing the URL, and an
Employee can't view another employee's data the same way — both are
verified against the signed-in session on every request, not just hidden
by the navigation.

---

## Features

- 🔐 Custom authentication — bcrypt password verification + signed JWT
  session cookie, with account lockout after repeated failed attempts
- 📊 Live dashboards for all three roles, computed via PostgreSQL SQL
  functions (not client-side aggregation) for speed at scale
- 🎯 Server-verified role and ownership guards on every route
- 📈 Real charts (Recharts) with a consistent, semantic colour system —
  Performance = orange, Salary = blue, Satisfaction = green, etc.
- 🔍 Searchable, sortable, paginated data tables with CSV export
- 🧪 Built-in QA simulation mode (Tester role) to preview any dashboard
  without needing separate test accounts for every department/employee
- 🎨 Custom sidebar navigation, design token system, and app branding
- 🛡️ Security headers, custom error/404 pages, robots.txt + sitemap.xml

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Database | PostgreSQL (Supabase) |
| Auth | bcrypt + signed JWT session (custom, not Supabase Auth) |
| Data pipeline | Python, pandas, SQLAlchemy |
| Analysis | Excel (cleaning), Power BI (DAX measures, initial dashboard design) |
| Hosting | Vercel |

---

## Architecture

```
        Excel (data cleaning)
                │
                ▼
      Python ETL (pandas + SQLAlchemy)
                │
                ▼
      PostgreSQL (Supabase, hosted)
           │              │
           ▼              ▼
    Power BI          Next.js App
   (analysis /   (production, role-scoped
   reference)         dashboards)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   CEO Dashboard   Manager Dashboard   Employee Dashboard
```

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/Analyst-Web-App.git
cd Analyst-Web-App
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=            # generate with: openssl rand -hex 32
APP_NAME="Employee Performance Analytics"
APP_URL=http://localhost:3000
```

### 3. Run the database migrations

Every schema change is a numbered, idempotent SQL file in
[`database/schema/`](./database/schema/). Run them **in order** in the
Supabase SQL editor before starting the app — the application code
assumes these already exist:

```
database/schema/
├── 001_lookup_and_auth.sql
├── 002_login_lockout.sql
├── 003_fix_employee_identity_fields.sql
├── 004_dedupe_metrics_fix_fanout.sql
├── 005_ceo_department_filter.sql
├── 006_add_demographic_charts.sql
└── 007_employee_comparison_chart.sql
```

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll land on `/login`.

---

## Project status

Built in five phases (Foundation → Role Routing → CEO Dashboard →
Manager/Employee/Tester → QA & Hardening), followed by a Version 2 pass
covering a full UI redesign and three data-integrity fixes found by
querying the live dataset at scale. Full details, including an honest
coverage comparison against the original specification and a list of
known gaps, are in [`/docs`](./docs).

**Known gaps** (see the docs for the full list): CEO/Manager global
filters beyond Department, remaining chart types from the original spec
(scatter plots, box plots, tree maps), password reset flow, and
per-employee unique password provisioning.

---

## Roles behind this project

| Workstream | Responsibilities |
|---|---|
| **Data Analyst** | Excel data cleaning, Python ETL pipeline, PostgreSQL schema design, Power BI dashboard modelling |
| **Web Developer** | Authentication, role-based routing, SQL aggregation layer, all four dashboard UIs, security hardening, design system |

Both workstreams on this project were carried out by **Shashikant Giri**.

---

## License

This project is for portfolio and educational purposes.

