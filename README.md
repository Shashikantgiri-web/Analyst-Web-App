Phase 1 — Foundation (V0.1): Next.js project scaffold, Tailwind + design system from 02_Design.md, Supabase client setup, access table schema + auth check (no dashboards yet — just login → role detection → redirect stub pages).

Phase 2 — Role Routing (V0.2): /ceo, /manage/[slug], /employee/[slug], /test/[slug], /about routes with real data-fetch guards per role, middleware/session handling.

Phase 3 — CEO Dashboard (V0.3): KPI cards + first batch of charts (Recharts/ApexCharts) wired to real Postgres tables.

Phase 4 — Manager + Employee Dashboards (V0.4): department/employee slicing logic, remaining chart set.

Phase 5 — QA, security hardening, SEO, deploy (V1.0): rate limiting, RLS policies in Supabase, meta tags, testing pass, deployment.
