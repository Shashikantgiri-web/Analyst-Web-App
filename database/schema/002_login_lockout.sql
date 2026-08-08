-- Phase 5: basic brute-force protection on employee_accounts.
-- Locks an account for 15 minutes after 5 consecutive failed attempts.
-- A successful login resets the counter.

alter table employee_accounts
  add column if not exists failed_login_attempts integer not null default 0,
  add column if not exists locked_until timestamp without time zone;
