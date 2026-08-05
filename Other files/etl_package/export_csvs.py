import os
import uuid
import bcrypt
import pandas as pd
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_FILE = os.path.join(SCRIPT_DIR, "Employee performance dataset.xlsx")
OUT_DIR    = os.path.join(SCRIPT_DIR, "csv_exports")

def safe_str(val):
    if pd.isna(val): return None
    return str(val).strip()

def safe_int(val):
    if pd.isna(val): return None
    try: return int(float(val))
    except: return None

def safe_float(val):
    if pd.isna(val): return None
    try: return float(val)
    except: return None

def safe_bool(val):
    if pd.isna(val): return False
    s = str(val).strip().lower()
    return s in ("1", "true", "yes", "y")

def main():
    print(f"Reading Excel: {EXCEL_FILE}")
    df_raw = pd.read_excel(EXCEL_FILE, sheet_name=0)
    df = df_raw.loc[:, ~df_raw.columns.str.startswith("Unnamed")]
    df = df.loc[:, ~df.columns.astype(str).str.startswith("31-12")]

    os.makedirs(OUT_DIR, exist_ok=True)

    # 1. Lookups
    def build_lookup(col_name):
        vals = df[col_name].dropna().unique()
        mapping = {}
        rows = []
        for v in vals:
            s = safe_str(v)
            if s and s.lower() not in [k.lower() for k in mapping]:
                u = str(uuid.uuid4())
                mapping[s.lower()] = u
                rows.append({"id": u, "name": s})
        return mapping, rows

    dept_names = df["Department"].dropna().unique()
    dept_map = {}
    dept_rows = []
    for idx, d in enumerate(dept_names):
        s = safe_str(d)
        if s and s.lower() not in [k.lower() for k in dept_map]:
            u = str(uuid.uuid4())
            dept_map[s.lower()] = u
            code = s[:3].upper() + f"{idx+1:02d}"
            dept_rows.append({"id": u, "department_code": code, "department_name": s, "is_active": True})

    edu_map, edu_rows = build_lookup("Education_Level")
    sal_map, sal_rows = build_lookup("Salary Level")
    train_map, train_rows = build_lookup("Training Level")
    sat_map, sat_rows = build_lookup("Satisfaction Rating")

    perf_map, perf_rows = build_lookup("Work Life Balance")

    remote_types = ["Office", "Hybrid", "Remote"]
    remote_map = {}
    remote_rows = []
    for r in remote_types:
        u = str(uuid.uuid4())
        remote_map[r.lower()] = u
        remote_rows.append({"id": u, "name": r})

    # Roles & Statuses
    roles = ["CEO", "Manager", "Employee", "Tester"]
    role_map = {}
    role_rows = []
    for r in roles:
        u = str(uuid.uuid4())
        role_map[r.lower()] = u
        role_rows.append({"id": u, "name": r})

    statuses = ["Active", "Resigned", "Retired"]
    status_map = {}
    status_rows = []
    for s in statuses:
        u = str(uuid.uuid4())
        status_map[s.lower()] = u
        status_rows.append({"id": u, "name": s})

    def resolve_status(row):
        if safe_bool(row.get("Resigned")): return status_map["resigned"]
        ret = safe_str(row.get("Retirement Status", ""))
        if ret: return status_map.get(ret.lower())
        return status_map["active"]

    # 2. Process Employees and Metrics
    employees_rows = []
    metrics_rows = []
    emp_map = {}

    for _, row in df.iterrows():
        raw_id = row.get("Employee_ID")
        emp_code = safe_str(str(raw_id)) if raw_id is not None else None
        if not emp_code: continue

        emp_uuid = str(uuid.uuid4())
        metric_uuid = str(uuid.uuid4())
        emp_map[int(raw_id)] = emp_uuid

        dept_name = safe_str(row.get("Department", ""))
        edu_name = safe_str(row.get("Education_Level", ""))
        sal_name = safe_str(row.get("Salary Level", ""))
        train_name = safe_str(row.get("Training Level", ""))
        sat_name = safe_str(row.get("Satisfaction Rating", ""))

        hire_dt = row.get("Hire_Date")
        hire_date = hire_dt.strftime('%Y-%m-%d') if pd.notna(hire_dt) else None

        ret_dt = row.get("Retirement On")
        ret_date = ret_dt.strftime('%Y-%m-%d') if pd.notna(ret_dt) else None

        employees_rows.append({
            "id": emp_uuid,
            "employee_code": emp_code,
            "job_title": safe_str(row.get("Job_Title")),
            "gender": safe_str(row.get("Gender")),
            "current_age": safe_int(row.get("Current_Age")),
            "retirement_age": safe_int(row.get("Retirement_On")),
            "hire_date": hire_date,
            "years_at_company": safe_int(row.get("Years_At_Company")),
            "year_at_company_calc": safe_int(row.get("Year at Company")),
            "education_level_id": edu_map.get(edu_name.lower() if edu_name else ""),
            "department_id": dept_map.get(dept_name.lower() if dept_name else ""),
            "employee_status_id": resolve_status(row)
        })

        perf_name = safe_str(row.get("Work Life Balance", ""))
        
        metrics_rows.append({
            "id": metric_uuid,
            "employee_id": emp_uuid,
            "performance_score": safe_float(row.get("Performance_Score")),
            "min_performance_pct": safe_float(row.get("Min_PS(%)")),
            "max_performance_pct": safe_float(row.get("Max_PS(%)")),
            "performance_percentage": safe_float(row.get("Percentage_ PS")),
            "performance_rating_id": perf_map.get(perf_name.lower() if perf_name else ""),
            "monthly_salary": safe_float(row.get("Monthly_Salary")),
            "salary_level_id": sal_map.get(sal_name.lower() if sal_name else ""),
            "normal_work_hours": safe_float(row.get("Normal_Work_Hours")),
            "overtime_hours": safe_float(row.get("Overtime_Hours")),
            "total_work_hours": safe_float(row.get("Total_Work_Hours")),
            "total_work_hours_calc": safe_float(row.get("Total Work Hours")),
            "work_hours_per_week": safe_float(row.get("Work_Hours_Per_Week")),
            "work_hours_per_week_calc": safe_float(row.get("Work Hours Per Week")),
            "training_hours": safe_float(row.get("Training_Hours")),
            "training_hours_calc": safe_float(row.get("Training Hour")),
            "training_level_id": train_map.get(train_name.lower() if train_name else ""),
            "projects_handled": safe_int(row.get("Projects_Handled")),
            "remote_work_frequency": safe_int(row.get("Remote_Work_Frequency")),
            "workload": safe_str(row.get("Workload")),
            "promotions": safe_int(row.get("Promotions")),
            "retirement_on": ret_date,
            "retirement_status": safe_str(row.get("Retirement Status")),
            "year_at_retirement": safe_int(row.get("Year at Retirement")),
            "emp_satisfaction_score": safe_float(row.get("Employee_Satisfaction_Score")),
            "pct_satisfaction_score": safe_float(row.get("Percentage_Satisfaction_score")),
            "satisfaction_rating_id": sat_map.get(sat_name.lower() if sat_name else ""),
            "work_life_balance": safe_str(row.get("Work Life Balance")),
            "sick_days": safe_int(row.get("Sick_Days")),
            "sick_days_calc": safe_int(row.get("Sick Days")),
            "resigned": safe_bool(row.get("Resigned"))
        })

    # 3. Employee Accounts
    accounts_rows = []
    ACCESS_ACCOUNTS = [
        {"username": "shashikant", "email": "shashikant@analyst.com", "role": "CEO",      "dept": "Executive"},
        {"username": "nishikant",  "email": "nishikant@analyst.com",  "role": "CEO",      "dept": "Executive"},
        {"username": "hr_manager", "email": "hr@analyst.com",         "role": "Manager",  "dept": "Human Resources"},
        {"username": "tester",     "email": "tester@analyst.com",     "role": "Tester",   "dept": "Quality Assurance"},
        {"username": "employee1",  "email": "emp1@analyst.com",       "role": "Employee", "dept": "IT"},
    ]
    
    for acc in ACCESS_ACCOUNTS:
        role_uuid = role_map.get(acc["role"].lower())
        dept_uuid = dept_map.get(acc["dept"].lower())
        
        # We don't link these generic accounts to specific employee records (employee_id = None)
        accounts_rows.append({
            "id": str(uuid.uuid4()),
            "employee_id": None,
            "username": acc["username"],
            "email": acc["email"],
            "password_hash": bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode('utf-8'),
            "role_id": role_uuid,
            "department_id": dept_uuid,
            "is_active": True,
            "last_login": None
        })

    # Save all to CSVs
    print("Writing CSVs...")
    pd.DataFrame(dept_rows).to_csv(os.path.join(OUT_DIR, "01_departments.csv"), index=False)
    pd.DataFrame(edu_rows).to_csv(os.path.join(OUT_DIR, "02_education_levels.csv"), index=False)
    pd.DataFrame(sal_rows).to_csv(os.path.join(OUT_DIR, "03_salary_levels.csv"), index=False)
    pd.DataFrame(train_rows).to_csv(os.path.join(OUT_DIR, "04_training_levels.csv"), index=False)
    pd.DataFrame(perf_rows).to_csv(os.path.join(OUT_DIR, "05_performance_ratings.csv"), index=False)
    pd.DataFrame(sat_rows).to_csv(os.path.join(OUT_DIR, "06_satisfaction_ratings.csv"), index=False)
    pd.DataFrame(role_rows).to_csv(os.path.join(OUT_DIR, "07_roles.csv"), index=False)
    pd.DataFrame(status_rows).to_csv(os.path.join(OUT_DIR, "08_employee_statuses.csv"), index=False)
    pd.DataFrame(remote_rows).to_csv(os.path.join(OUT_DIR, "09_remote_work_types.csv"), index=False)
    pd.DataFrame(employees_rows).to_csv(os.path.join(OUT_DIR, "10_employees.csv"), index=False)
    pd.DataFrame(metrics_rows).to_csv(os.path.join(OUT_DIR, "11_employee_metrics.csv"), index=False)
    pd.DataFrame(accounts_rows).to_csv(os.path.join(OUT_DIR, "12_employee_accounts.csv"), index=False)

    print(f"CSVs generated in {OUT_DIR}")

if __name__ == "__main__":
    main()
