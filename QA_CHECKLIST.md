# Phase 5 QA Checklist

## Before you deploy this phase

- [ ] Run `database/schema/002_login_lockout.sql` in Supabase SQL editor
      (adds `failed_login_attempts` and `locked_until` to employee_accounts)
- [ ] Confirm `manager_and_employee_overview.sql` and `ceo_dashboard_overview.sql`
      from Phase 3/4 were already run (if unsure, re-run them -- `create or
      replace function` is safe to run again)
- [ ] Unzip `phase5-changes.zip`'s `phase5-out/` folder directly into your
      project root (paths already match your repo)

## Manual test pass -- do all of these after deploying

**Logout**
- [ ] Log in as any role, click "Log out" -- confirm you land on `/login`
- [ ] After logging out, try navigating directly to `/ceo` (or whichever
      dashboard you were on) -- confirm it redirects to `/login`, not the
      dashboard

**Lockout**
- [ ] Try logging into one test account with the wrong password 5 times in
      a row -- 6th attempt (even with the correct password) should show
      "Too many failed attempts. Try again in N minute(s)."
- [ ] Confirm a *different* account can still log in normally while the
      first one is locked
- [ ] Wait out the lockout (or manually clear `locked_until` in Supabase)
      and confirm the correct password works again afterward

**Error handling**
- [ ] Visit a nonexistent path (e.g. `/this-does-not-exist`) -- should show
      the custom 404 page, not Next's default
- [ ] (Harder to trigger manually) if a page throws, confirm the custom
      error screen appears instead of a blank/default crash page

**SEO / crawling**
- [ ] Visit `/robots.txt` -- confirm it loads and disallows `/ceo`,
      `/manage`, `/employee`, `/test`
- [ ] Visit `/sitemap.xml` -- confirm it loads and lists `/about` + `/login`

**Security headers** (browser DevTools -> Network tab -> click any request
-> Response Headers)
- [ ] `x-frame-options: DENY` present
- [ ] `x-content-type-options: nosniff` present
- [ ] No `x-powered-by: Next.js` header

**Regression pass on everything from Phases 1-4**
- [ ] All 4 roles (CEO, Manager, Employee, Tester) can still log in
- [ ] Manager dashboard still routes straight to their own department
- [ ] Employee dashboard still shows only their own data
- [ ] Tester can still simulate all 3 views via the pickers
- [ ] Manager can't view another department by editing the URL
- [ ] Employee can't view another employee's ID by editing the URL

## Known gaps -- deliberately out of scope for this phase

- No password reset flow (an admin would need to manually update
  `password_hash` via SQL for now)
- No audit log of who viewed what
- No rate limiting on the login *route* itself (only on repeated wrong
  passwords for one account) -- someone could still hammer many different
  emails quickly; a proper fix needs IP-based rate limiting, which usually
  lives at Vercel's edge/WAF layer rather than in application code
- CEO dashboard still has no global filters (department/gender/education
  etc.) -- flagged since Phase 3
- Employee dashboard spec doc (`08_Employee_Dashboard.md`) is still a
  verbatim duplicate of the Manager doc in the source files -- worth
  fixing before any V2 planning references it
