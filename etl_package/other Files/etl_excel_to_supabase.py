"""
=============================================================
  ETL: Employee_performance_dataset.xlsx  →  Supabase
  Employee Performance Analytics Platform
=============================================================

HOW TO RUN (no path issues):
  1. Put this .py file anywhere you like.
  2. Put Employee_performance_dataset.xlsx in the SAME folder.
  3. Open a terminal / Command Prompt in that folder and run:
       python etl_excel_to_supabase.py
  The script finds the Excel file automatically beside itself.

INSTALL DEPENDENCIES ONCE:
  pip install pandas sqlalchemy psycopg2-binary openpyxl bcrypt
=============================================================
"""

import os
import sys
import uuid
import bcrypt
import pandas as pd
from datetime import date
from sqlalchemy import create_engine, text

# ─────────────────────────────────────────────────────────────
#  Auto-detect paths — works no matter where the script lives
# ─────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
EXCEL_FILE   = os.path.join(SCRIPT_DIR, "Employee performance dataset.xlsx")

if not os.path.exists(EXCEL_FILE):
    print(f"\n❌  Excel file not found at:\n    {EXCEL_FILE}")
    print("    Put Employee_performance_dataset.xlsx in the same folder as this script.\n")
    sys.exit(1)

DATABASE_URL = "postgresql+psycopg2://postgres.cwzrtlqcuvigboblsusw:web-app-0987@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# ─────────────────────────────────────────────────────────────
#  Access accounts to create (change passwords before sharing)
# ─────────────────────────────────────────────────────────────
ACCESS_ACCOUNTS = [
    {
        "username":        "ceo_admin",
        "email":           "ceo@company.com",
        "plain_password":  "CEO_Secure@2025!",
        "role":            "CEO",
        "employee_id":     None,          # not linked to an employee row
        "department_name": None,
    },
    {
        "username":        "tester_01",
        "email":           "tester@company.com",
        "plain_password":  "Tester_Secure@2025!",
        "role":            "Tester",
        "employee_id":     None,
        "department_name": None,
    },
    # Add managers like this:
    # {
    #     "username":        "mgr_it",
    #     "email":           "mgr.it@company.com",
    #     "plain_password":  "Manager_IT@2025!",
    #     "role":            "Manager",
    #     "employee_id":     1,            # Employee_ID from Excel
    #     "department_name": "IT",
    # },
]

# ═════════════════════════════════════════════════════════════
#  Helpers
# ═════════════════════════════════════════════════════════════

def make_engine():
    return create_engine(DATABASE_URL, echo=False)


def fetch_map(engine, table: str, name_col: str = "name") -> dict:
    """Return {lower(name): uuid_str} for any lookup table."""
    with engine.connect() as conn:
        rows = conn.execute(
            text(f"SELECT id, {name_col} FROM {table}")
        ).fetchall()
    return {str(r[1]).strip().lower(): str(r[0]) for r in rows}


def safe_str(val) -> str | None:
    if val is None:
        return None
    s = str(val).strip()
    return s if s and s.lower() != "nan" else None


def safe_int(val) -> int | None:
    try:
        f = float(val)
        return int(f) if not pd.isna(f) else None
    except (TypeError, ValueError):
        return None


def safe_float(val) -> float | None:
    try:
        f = float(val)
        return None if pd.isna(f) else f
    except (TypeError, ValueError):
        return None


def safe_date(val) -> date | None:
    if val is None:
        return None
    try:
        ts = pd.to_datetime(val)
        return None if pd.isna(ts) else ts.date()
    except Exception:
        return None


def safe_bool(val) -> bool | None:
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    return str(val).strip().lower() in ("true", "1", "yes")


# ═════════════════════════════════════════════════════════════
#  STEP 0 — Create / verify schema tables exist
# ═════════════════════════════════════════════════════════════

SCHEMA_SQL = """
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Lookup tables ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_code  VARCHAR(20)  UNIQUE NOT NULL,
    department_name  VARCHAR(100) NOT NULL,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education_levels (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS salary_levels (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS training_levels (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL   -- CEO | Manager | Employee | Tester
);

CREATE TABLE IF NOT EXISTS employee_statuses (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL   -- Active | Resigned | Retired
);

CREATE TABLE IF NOT EXISTS performance_ratings (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS satisfaction_ratings (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS remote_work_types (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- ── Core tables ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code        VARCHAR(20) UNIQUE NOT NULL,
    job_title            VARCHAR(100),
    gender               VARCHAR(20),
    current_age          INTEGER,
    retirement_age       INTEGER,
    hire_date            DATE,
    years_at_company     INTEGER,
    year_at_company_calc INTEGER,
    education_level_id   UUID REFERENCES education_levels(id),
    department_id        UUID REFERENCES departments(id),
    employee_status_id   UUID REFERENCES employee_statuses(id),
    created_at           TIMESTAMP DEFAULT NOW(),
    updated_at           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_metrics (
    id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id                   UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,

    -- Performance
    performance_score             NUMERIC,
    min_performance_pct           NUMERIC,
    max_performance_pct           NUMERIC,
    performance_percentage        NUMERIC,
    performance_rating_id         UUID REFERENCES performance_ratings(id),

    -- Salary
    monthly_salary                NUMERIC,
    salary_level_id               UUID REFERENCES salary_levels(id),

    -- Work hours
    normal_work_hours             NUMERIC,
    overtime_hours                NUMERIC,
    total_work_hours              NUMERIC,
    total_work_hours_calc         NUMERIC,
    work_hours_per_week           NUMERIC,
    work_hours_per_week_calc      NUMERIC,

    -- Training & projects
    training_hours                NUMERIC,
    training_hours_calc           NUMERIC,
    training_level_id             UUID REFERENCES training_levels(id),
    projects_handled              INTEGER,

    -- Remote & workload
    remote_work_frequency         INTEGER,
    workload                      VARCHAR(50),

    -- Promotion & retirement
    promotions                    INTEGER,
    retirement_on                 DATE,
    retirement_status             VARCHAR(50),
    year_at_retirement            INTEGER,

    -- Satisfaction
    emp_satisfaction_score        NUMERIC,
    pct_satisfaction_score        NUMERIC,
    satisfaction_rating_id        UUID REFERENCES satisfaction_ratings(id),

    -- Work-life
    work_life_balance             VARCHAR(50),
    sick_days                     INTEGER,
    sick_days_calc                INTEGER,

    -- Status flags
    resigned                      BOOLEAN DEFAULT FALSE,

    created_at                    TIMESTAMP DEFAULT NOW(),
    updated_at                    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_accounts (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id        UUID REFERENCES employees(id) ON DELETE SET NULL,
    username           VARCHAR(100) UNIQUE NOT NULL,
    email              VARCHAR(255) UNIQUE NOT NULL,
    password_hash      TEXT NOT NULL,
    role_id            UUID REFERENCES roles(id),
    department_id      UUID REFERENCES departments(id),
    is_active          BOOLEAN DEFAULT TRUE,
    last_login         TIMESTAMP,
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

-- System tables
CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    title       VARCHAR(255),
    message     TEXT,
    type        VARCHAR(50),
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    login_time  TIMESTAMP,
    logout_time TIMESTAMP,
    browser     VARCHAR(100),
    device      VARCHAR(100),
    ip_address  VARCHAR(45),
    status      VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ai_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
    question      TEXT,
    response      TEXT,
    model         VARCHAR(100),
    response_time NUMERIC,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_employees_code       ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_dept       ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_metrics_emp          ON employee_metrics(employee_id);
CREATE INDEX IF NOT EXISTS idx_accounts_email       ON employee_accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_role        ON employee_accounts(role_id);
"""


def ensure_schema(engine):
    print("\n[0] Ensuring schema exists …")
    with engine.begin() as conn:
        conn.execute(text(SCHEMA_SQL))
    print("   ✅ Schema ready.")


# ═════════════════════════════════════════════════════════════
#  STEP 1 — Seed all lookup tables
# ═════════════════════════════════════════════════════════════

def seed_lookups(engine, df: pd.DataFrame):
    print("\n[1] Seeding lookup tables …")

    def upsert(table: str, values: list):
        with engine.begin() as conn:
            for v in values:
                v = safe_str(v)
                if v:
                    conn.execute(text(
                        f"INSERT INTO {table} (name) VALUES (:v) "
                        f"ON CONFLICT (name) DO NOTHING"
                    ), {"v": v})

    # Roles (fixed set)
    upsert("roles", ["CEO", "Manager", "Employee", "Tester"])

    # Employee statuses derived from data + extras
    statuses = set(["Active", "Resigned", "Retired", "On Leave", "Inactive"])
    if "Retirement Status" in df.columns:
        statuses.update(df["Retirement Status"].dropna().unique().tolist())
    upsert("employee_statuses", list(statuses))

    # Departments
    if "Department" in df.columns:
        with engine.begin() as conn:
            for dept in df["Department"].dropna().unique():
                dept = str(dept).strip()
                if dept:
                    code = dept.upper()[:20]
                    conn.execute(text("""
                        INSERT INTO departments (department_code, department_name)
                        VALUES (:code, :name)
                        ON CONFLICT (department_code) DO NOTHING
                    """), {"code": code, "name": dept})

    # Simple lookup tables from Excel columns
    col_table_map = {
        "Education_Level": "education_levels",
        "Salary Level":    "salary_levels",
        "Training Level":  "training_levels",
        "Satisfaction Rating": "satisfaction_ratings",
        "Work Life Balance":   "performance_ratings",   # used as proxy for now
    }
    for col, table in col_table_map.items():
        if col in df.columns:
            upsert(table, df[col].dropna().unique().tolist())

    # Satisfaction ratings specifically
    if "Satisfaction Rating" in df.columns:
        upsert("satisfaction_ratings", df["Satisfaction Rating"].dropna().unique().tolist())

    # Performance ratings — seed fixed set
    upsert("performance_ratings",
           ["Excellent", "Good", "Average", "Needs Improvement", "Poor"])

    # Remote work types — seed fixed set
    upsert("remote_work_types", ["Office", "Hybrid", "Remote"])

    print("   ✅ Lookup tables seeded.")


# ═════════════════════════════════════════════════════════════
#  STEP 2 — Insert employees
# ═════════════════════════════════════════════════════════════

def insert_employees(engine, df: pd.DataFrame) -> dict:
    """Returns {employee_id_int: uuid_str}."""
    print("\n[2] Inserting employees …")

    dept_map   = fetch_map(engine, "departments", "department_name")
    edu_map    = fetch_map(engine, "education_levels")
    status_map = fetch_map(engine, "employee_statuses")

    def resolve_status(row) -> str | None:
        resigned = safe_bool(row.get("Resigned"))
        if resigned:
            return status_map.get("resigned")
        ret = safe_str(row.get("Retirement Status", ""))
        if ret:
            return status_map.get(ret.lower())
        return status_map.get("active")

    emp_map = {}   # int employee_id → uuid
    inserted = skipped = 0

    emp_params = []
    
    with engine.begin() as conn:
        for _, row in df.iterrows():
            raw_id = row.get("Employee_ID")
            emp_code = safe_str(str(raw_id)) if raw_id is not None else None
            if not emp_code:
                skipped += 1
                continue

            dept_name  = safe_str(row.get("Department", ""))
            edu_name   = safe_str(row.get("Education_Level", ""))
            dept_id    = dept_map.get(dept_name.lower() if dept_name else "")
            edu_id     = edu_map.get(edu_name.lower() if edu_name else "")
            status_id  = resolve_status(row)

            emp_params.append({
                "code":       emp_code,
                "job":        safe_str(row.get("Job_Title")),
                "gender":     safe_str(row.get("Gender")),
                "age":        safe_int(row.get("Current_Age")),
                "ret_age":    safe_int(row.get("Retirement_On")),
                "hire":       safe_date(row.get("Hire_Date")),
                "years":      safe_int(row.get("Years_At_Company")),
                "years_calc": safe_int(row.get("Year at Company")),
                "edu":        edu_id,
                "dept":       dept_id,
                "status":     status_id,
                "raw_id":     raw_id
            })

        if emp_params:
            # Chunking the execution
            chunk_size = 5000
            for i in range(0, len(emp_params), chunk_size):
                chunk = emp_params[i:i + chunk_size]
                conn.execute(text("""
                    INSERT INTO employees (
                        employee_code, job_title, gender,
                        current_age, retirement_age,
                        hire_date, years_at_company, year_at_company_calc,
                        education_level_id, department_id, employee_status_id
                    ) VALUES (
                        :code, :job, :gender,
                        :age, :ret_age,
                        :hire, :years, :years_calc,
                        :edu, :dept, :status
                    )
                    ON CONFLICT (employee_code) DO UPDATE SET
                        job_title            = EXCLUDED.job_title,
                        gender               = EXCLUDED.gender,
                        current_age          = EXCLUDED.current_age,
                        retirement_age       = EXCLUDED.retirement_age,
                        hire_date            = EXCLUDED.hire_date,
                        years_at_company     = EXCLUDED.years_at_company,
                        year_at_company_calc = EXCLUDED.year_at_company_calc,
                        education_level_id   = EXCLUDED.education_level_id,
                        department_id        = EXCLUDED.department_id,
                        employee_status_id   = EXCLUDED.employee_status_id,
                        updated_at           = NOW()
                """), chunk)
                inserted += len(chunk)
                
        # Re-fetch all to build emp_map
        rows = conn.execute(text("SELECT employee_code, id FROM employees")).fetchall()
        for r in rows:
            code_str = str(r[0])
            # if raw_id was integer, just store it as int key for emp_map
            try:
                emp_map[int(float(code_str))] = str(r[1])
            except ValueError:
                emp_map[code_str] = str(r[1])

    print(f"   ✅ {inserted} employees inserted/updated, {skipped} skipped.")
    return emp_map


# ═════════════════════════════════════════════════════════════
#  STEP 3 — Insert employee_metrics
# ═════════════════════════════════════════════════════════════

def insert_metrics(engine, df: pd.DataFrame, emp_map: dict):
    print("\n[3] Inserting employee metrics …")

    sat_map   = fetch_map(engine, "satisfaction_ratings")
    sal_map   = fetch_map(engine, "salary_levels")
    train_map = fetch_map(engine, "training_levels")

    inserted = skipped = 0

    metric_params = []

    with engine.begin() as conn:
        for _, row in df.iterrows():
            raw_id   = row.get("Employee_ID")
            emp_uuid = emp_map.get(int(raw_id)) if raw_id is not None else None
            if not emp_uuid:
                skipped += 1
                continue

            sal_name  = safe_str(row.get("Salary Level", "")) or ""
            train_name = safe_str(row.get("Training Level", "")) or ""
            sat_name  = safe_str(row.get("Satisfaction Rating", "")) or ""

            metric_params.append({
                "emp_id":    emp_uuid,
                "perf":      safe_float(row.get("Performance_Score")),
                "min_ps":    safe_float(row.get("Min_PS(%)")),
                "max_ps":    safe_float(row.get("Max_PS(%)")),
                "pct_ps":    safe_float(row.get("Percentage_ PS")),
                "salary":    safe_float(row.get("Monthly_Salary")),
                "sal_lvl":   sal_map.get(sal_name.lower()),
                "norm_wh":   safe_float(row.get("Normal_Work_Hours")),
                "ot_h":      safe_float(row.get("Overtime_Hours")),
                "total_wh":  safe_float(row.get("Total_Work_Hours")),
                "total_wh2": safe_float(row.get("Total Work Hours")),
                "wh_pw":     safe_float(row.get("Work_Hours_Per_Week")),
                "wh_pw2":    safe_float(row.get("Work Hours Per Week")),
                "train_h":   safe_float(row.get("Training_Hours")),
                "train_h2":  safe_float(row.get("Training Hour")),
                "train_lvl": train_map.get(train_name.lower()),
                "proj":      safe_int(row.get("Projects_Handled")),
                "rw_freq":   safe_int(row.get("Remote_Work_Frequency")),
                "workload":  safe_str(row.get("Workload")),
                "promo":     safe_int(row.get("Promotions")),
                "ret_on":    safe_date(row.get("Retirement On")),
                "ret_status":safe_str(row.get("Retirement Status")),
                "yr_ret":    safe_int(row.get("Year at Retirement")),
                "sat_score": safe_float(row.get("Employee_Satisfaction_Score")),
                "pct_sat":   safe_float(row.get("Percentage_Satisfaction_score")),
                "sat_rating":sat_map.get(sat_name.lower()),
                "wlb":       safe_str(row.get("Work Life Balance")),
                "sick":      safe_int(row.get("Sick_Days")),
                "sick2":     safe_int(row.get("Sick Days")),
                "resigned":  safe_bool(row.get("Resigned")),
            })
            
        if metric_params:
            chunk_size = 5000
            for i in range(0, len(metric_params), chunk_size):
                chunk = metric_params[i:i + chunk_size]
                conn.execute(text("""
                    INSERT INTO employee_metrics (
                        employee_id,
                        performance_score, min_performance_pct, max_performance_pct,
                        performance_percentage,
                        monthly_salary, salary_level_id,
                        normal_work_hours, overtime_hours,
                        total_work_hours, total_work_hours_calc,
                        work_hours_per_week, work_hours_per_week_calc,
                        training_hours, training_hours_calc, training_level_id,
                        projects_handled,
                        remote_work_frequency, workload,
                        promotions,
                        retirement_on, retirement_status, year_at_retirement,
                        emp_satisfaction_score, pct_satisfaction_score,
                        satisfaction_rating_id,
                        work_life_balance,
                        sick_days, sick_days_calc,
                        resigned
                    ) VALUES (
                        :emp_id,
                        :perf, :min_ps, :max_ps, :pct_ps,
                        :salary, :sal_lvl,
                        :norm_wh, :ot_h,
                        :total_wh, :total_wh2,
                        :wh_pw, :wh_pw2,
                        :train_h, :train_h2, :train_lvl,
                        :proj,
                        :rw_freq, :workload,
                        :promo,
                        :ret_on, :ret_status, :yr_ret,
                        :sat_score, :pct_sat, :sat_rating,
                        :wlb,
                        :sick, :sick2,
                        :resigned
                    )
                    ON CONFLICT (employee_id) DO UPDATE SET
                        performance_score         = EXCLUDED.performance_score,
                        min_performance_pct       = EXCLUDED.min_performance_pct,
                        max_performance_pct       = EXCLUDED.max_performance_pct,
                        performance_percentage    = EXCLUDED.performance_percentage,
                        monthly_salary            = EXCLUDED.monthly_salary,
                        salary_level_id           = EXCLUDED.salary_level_id,
                        normal_work_hours         = EXCLUDED.normal_work_hours,
                        overtime_hours            = EXCLUDED.overtime_hours,
                        total_work_hours          = EXCLUDED.total_work_hours,
                        total_work_hours_calc     = EXCLUDED.total_work_hours_calc,
                        work_hours_per_week       = EXCLUDED.work_hours_per_week,
                        work_hours_per_week_calc  = EXCLUDED.work_hours_per_week_calc,
                        training_hours            = EXCLUDED.training_hours,
                        training_hours_calc       = EXCLUDED.training_hours_calc,
                        training_level_id         = EXCLUDED.training_level_id,
                        projects_handled          = EXCLUDED.projects_handled,
                        remote_work_frequency     = EXCLUDED.remote_work_frequency,
                        workload                  = EXCLUDED.workload,
                        promotions                = EXCLUDED.promotions,
                        retirement_on             = EXCLUDED.retirement_on,
                        retirement_status         = EXCLUDED.retirement_status,
                        year_at_retirement        = EXCLUDED.year_at_retirement,
                        emp_satisfaction_score    = EXCLUDED.emp_satisfaction_score,
                        pct_satisfaction_score    = EXCLUDED.pct_satisfaction_score,
                        satisfaction_rating_id    = EXCLUDED.satisfaction_rating_id,
                        work_life_balance         = EXCLUDED.work_life_balance,
                        sick_days                 = EXCLUDED.sick_days,
                        sick_days_calc            = EXCLUDED.sick_days_calc,
                        resigned                  = EXCLUDED.resigned,
                        updated_at                = NOW()
                """), chunk)
                inserted += len(chunk)

    print(f"   ✅ {inserted} metric rows inserted/updated, {skipped} skipped.")


# ═════════════════════════════════════════════════════════════
#  STEP 4 — Insert employee_accounts
# ═════════════════════════════════════════════════════════════

def insert_accounts(engine, emp_map: dict):
    print("\n[4] Inserting employee_accounts …")

    role_map = fetch_map(engine, "roles")
    dept_map = fetch_map(engine, "departments", "department_name")

    inserted = 0
    with engine.begin() as conn:
        for acc in ACCESS_ACCOUNTS:
            pw_hash = bcrypt.hashpw(
                acc["plain_password"].encode(), bcrypt.gensalt()
            ).decode()

            role_id = role_map.get(acc["role"].strip().lower())
            dept_id = dept_map.get(
                (acc.get("department_name") or "").strip().lower()
            ) or None

            # Look up UUID from employee_id int
            emp_uuid = emp_map.get(acc.get("employee_id")) if acc.get("employee_id") else None

            # Also try DB lookup in case emp_map is empty
            if not emp_uuid and acc.get("employee_id"):
                row = conn.execute(text(
                    "SELECT id FROM employees WHERE employee_code = :c"
                ), {"c": str(acc["employee_id"])}).fetchone()
                if row:
                    emp_uuid = str(row[0])

            conn.execute(text("""
                INSERT INTO employee_accounts
                    (username, email, password_hash, role_id, department_id, employee_id)
                VALUES (:u, :e, :ph, :r, :d, :eid)
                ON CONFLICT (email) DO UPDATE SET
                    username      = EXCLUDED.username,
                    password_hash = EXCLUDED.password_hash,
                    role_id       = EXCLUDED.role_id,
                    department_id = EXCLUDED.department_id,
                    updated_at    = NOW()
            """), {
                "u":   acc["username"],
                "e":   acc["email"],
                "ph":  pw_hash,
                "r":   role_id,
                "d":   dept_id,
                "eid": emp_uuid,
            })
            inserted += 1
            print(f"   → {acc['username']} ({acc['role']})")

    print(f"   ✅ {inserted} accounts inserted/updated.")


# ═════════════════════════════════════════════════════════════
#  MAIN
# ═════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("  ETL: Excel → Supabase PostgreSQL")
    print("=" * 60)
    print(f"\nExcel file : {EXCEL_FILE}")
    print("Database   : Supabase Pooler")

    # ── Read Excel ────────────────────────────────────────────
    print("\nReading Excel …")
    df_raw = pd.read_excel(EXCEL_FILE, sheet_name=0)

    # Drop pure-unnamed columns (index artifacts)
    df = df_raw.loc[:, ~df_raw.columns.str.startswith("Unnamed")]

    # Drop the broken timestamp column (31-12-1899 08:03:05)
    df = df.loc[:, ~df.columns.astype(str).str.startswith("31-12")]

    print(f"Columns : {len(df.columns)}  |  Rows : {len(df):,}")

    # ── Connect ───────────────────────────────────────────────
    print("\nConnecting to Supabase …")
    try:
        engine = make_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("   ✅ Connected.")
    except Exception as e:
        print(f"\n❌  Connection failed: {e}")
        sys.exit(1)

    # ── ETL stages ────────────────────────────────────────────
    # ensure_schema(engine)
    seed_lookups(engine, df)
    emp_map = insert_employees(engine, df)
    insert_metrics(engine, df, emp_map)
    insert_accounts(engine, emp_map)

    print("\n" + "=" * 60)
    print("  🎉  ETL complete!")
    print("=" * 60)
    print(f"\n  Employees loaded : {len(emp_map):,}")
    print(f"  Metrics loaded   : {len(emp_map):,}")
    print(f"  Accounts created : {len(ACCESS_ACCOUNTS)}")
    print()


if __name__ == "__main__":
    main()
