# How to Run the ETL

## 1. Install dependencies (one time only)
```
pip install pandas sqlalchemy psycopg2-binary openpyxl bcrypt
```

## 2. Place both files in the SAME folder
```
📁 any folder you like
   ├── etl_excel_to_supabase.py          ← this script
   └── Employee_performance_dataset.xlsx  ← your dataset
```

## 3. Open a terminal / Command Prompt IN that folder

On Windows: hold Shift and right-click the folder → "Open PowerShell window here"

## 4. Run
```
python etl_excel_to_supabase.py
```

That's it. The script auto-detects the Excel file next to itself — no path config needed.

---

## What gets loaded

| Table | Content |
|---|---|
| departments | 9 departments from Excel |
| education_levels | Bachelor, High School, Master, PhD |
| salary_levels | High, Medium, Very High |
| training_levels | Advanced, Beginner, Expert, Intermediate |
| satisfaction_ratings | From Excel data |
| performance_ratings | Excellent, Good, Average, Needs Improvement, Poor |
| employees | 100,000 employee records |
| employee_metrics | 100,000 metric rows (1:1 with employees) |
| employee_accounts | CEO + Tester (add Managers in script) |

## Adding manager accounts

Open the script and edit the `ACCESS_ACCOUNTS` list near the top:
```python
{
    "username":        "mgr_it",
    "email":           "mgr.it@company.com",
    "plain_password":  "Manager_IT@2025!",
    "role":            "Manager",
    "employee_id":     42,          # Employee_ID from Excel
    "department_name": "IT",
},
```
