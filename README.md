# Employee Performance Analytics — Phase 1 (V0.1)

Foundation layer: project scaffold, design system, Supabase auth wiring,
role-lookup schema, login flow, and guarded stub pages for every route.

## What's in this phase

- Next.js 16 App Router, JavaScript, Tailwind v4 -- per 03_Technology.md
- Enterprise Dark design tokens wired into app/globals.css / constants/theme.js
- Supabase browser + server clients (lib/supabase/), with a clearly
  isolated service-role client for future admin-only paths
- proxy.js (Next 16's renamed middleware) refreshing the auth session and
  gating /ceo, /manage, /employee, /test
- database/schema/001_lookup_and_auth.sql -- departments, roles,
  employee_statuses, education_levels, employees, employee_accounts, plus
  Row Level Security policies (CEO/Tester full read, Manager
  department-scoped, Employee self-scoped)
- Login page (app/login) implementing the exact flow from App_detail.md:
  userId + email + password -> Supabase Auth -> cross-check against
  employee_accounts -> role branch -> Manager gets a department picker,
  Tester gets a role picker, everyone else redirects straight to their route
- Guarded stub pages: /ceo, /manage/[slug], /employee/[slug],
  /test/[slug], /about

## Setup

1. Run the SQL in database/schema/001_lookup_and_auth.sql against your
   Supabase project (SQL editor or `supabase db push`).
2. Seed at least one row in roles, departments, employees, and
   employee_accounts for each role you want to test (an auth.users row
   must exist first -- create it via Supabase Auth, then link
   employee_accounts.auth_user_id to it).
3. .env.local is already populated with the Supabase project you gave me.
   Rotate the DB password and the Supabase secret key if this project
   isn't brand new -- those were shared in plaintext.
4. npm install
5. npm run dev

## Not yet built (later phases)

- Real dashboard content and charts (Phase 3-4)
- Department verification for /manage/[slug] beyond the role check
  (Phase 2)
- Python ETL run against real Excel exports
- Rate limiting, CSRF hardening pass, sitemap/robots.txt (Phase 5)
