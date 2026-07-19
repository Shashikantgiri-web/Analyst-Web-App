# Employee Performance ETL

Normalizes the Employee Performance Excel dataset into a related PostgreSQL
(Supabase) schema, generates login accounts, and builds dashboard-ready views
for Power BI / Next.js.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env   # then fill in your real Supabase values
```

Place your Excel file at the path set by `EXCEL_FILE_PATH` in `.env`
(default: `data/Employee_performance_dataset.xlsx`).

## Run

```bash
python main.py
```

This will, in order:
1. Create all tables (`departments`, `employees`, `salaries`, `performance`,
   `satisfaction`, `training`, `work`, `promotions`, `retirement`,
   `remote_work`, `employee_accounts`)
2. Read, clean, and load the Excel data
3. Generate an `Employee` login account per row (bcrypt-hashed password:
   `XYZ@EMP1001`)
4. Seed system accounts: `ceo`, one `manager_<department>` per department,
   and `tester`
5. Create SQL views: `employee_dashboard`, `department_dashboard`,
   `company_dashboard`, `promotion_summary`, `performance_summary`

Re-running `main.py` is safe — employees and system accounts that already
exist are skipped rather than duplicated.

## Project structure

```
config/     settings, database engine, logging
models/     one SQLAlchemy model per normalized table
schema/     table + view creation scripts
etl/        reader -> cleaner -> transformer -> loader, plus account seeding
utils/      password generation / bcrypt hashing
main.py     orchestrates the full pipeline
```

## Security

- Never commit `.env` — it's already covered by `.gitignore`.
- Rotate your Supabase DB password if it was ever pasted into a chat,
  script, or shared publicly.
- Only password *hashes* are stored — plaintext passwords are never saved
  to the database.
