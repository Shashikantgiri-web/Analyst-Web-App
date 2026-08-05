-- Phase 1: lookup tables + employees + employee_accounts + RLS
-- Source of truth: 11_Database_Design.md
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ============ LOOKUP TABLES ============

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  department_code varchar(20) unique not null,
  department_name varchar(100) not null,
  description text,
  manager_employee_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists education_levels (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null unique,
  description text
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null unique
);

insert into roles (name) values ('CEO'), ('Manager'), ('Employee'), ('Tester')
  on conflict (name) do nothing;

create table if not exists employee_statuses (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null unique
);

insert into employee_statuses (name) values
  ('Active'), ('Inactive'), ('On Leave'), ('Resigned'), ('Retired')
  on conflict (name) do nothing;

-- ============ CORE TABLES ============

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  employee_code varchar(20) unique not null,
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  department_id uuid not null references departments(id),
  education_level_id uuid not null references education_levels(id),
  gender varchar(20),
  current_age integer check (current_age >= 0),
  hire_date date,
  years_at_company integer,
  employee_status_id uuid references employee_statuses(id),
  profile_photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table departments
  add constraint fk_departments_manager
  foreign key (manager_employee_id) references employees(id) deferrable initially deferred;

-- Links a Supabase Auth user (auth.users.id) to an employee + role.
-- This is the "access" table referenced in App_detail.md.
create table if not exists employee_accounts (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  employee_id uuid unique references employees(id) on delete cascade,
  username varchar(100) unique not null,
  email varchar(255) unique not null,
  role_id uuid not null references roles(id),
  is_active boolean not null default true,
  last_login timestamptz,
  password_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_employees_department on employees(department_id);
create index if not exists idx_employees_code on employees(employee_code);
create index if not exists idx_accounts_email on employee_accounts(email);
create index if not exists idx_accounts_role on employee_accounts(role_id);

-- ============ ROW LEVEL SECURITY ============
-- Strategy from 11_Database_Design.md section 18:
-- CEO -> full read, Manager -> department only, Employee -> own data only,
-- Tester -> simulation mode (treated as full read, gated in app logic).

alter table employees enable row level security;
alter table employee_accounts enable row level security;
alter table departments enable row level security;

-- Helper view: the caller's own account row, resolved from auth.uid().
create or replace view my_account as
  select ea.*, r.name as role_name
  from employee_accounts ea
  join roles r on r.id = ea.role_id
  where ea.auth_user_id = auth.uid();

create policy "ceo_tester_read_all_employees" on employees
  for select using (
    exists (
      select 1 from my_account
      where my_account.role_name in ('CEO', 'Tester')
    )
  );

create policy "manager_reads_own_department" on employees
  for select using (
    exists (
      select 1 from my_account
      join employees mgr on mgr.id = my_account.employee_id
      where my_account.role_name = 'Manager'
      and mgr.department_id = employees.department_id
    )
  );

create policy "employee_reads_self" on employees
  for select using (
    exists (
      select 1 from my_account
      where my_account.role_name = 'Employee'
      and my_account.employee_id = employees.id
    )
  );

create policy "account_reads_self" on employee_accounts
  for select using (auth_user_id = auth.uid());

create policy "departments_readable_by_authenticated" on departments
  for select using (auth.uid() is not null);
