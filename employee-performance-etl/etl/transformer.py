"""
Transforms one cleaned Excel row (a pandas Series) into a dict-of-dicts,
one dict per destination table, ready for the loader to insert.

Column names in the source Excel vary slightly in wording/casing, so
`pick()` tries several normalized candidate names before giving up.
"""
import pandas as pd


def pick(row: pd.Series, *candidates):
    for name in candidates:
        if name in row.index and pd.notna(row[name]):
            return row[name]
    return None


def to_int(value):
    try:
        return int(value) if value is not None else None
    except (ValueError, TypeError):
        return None


def to_float(value):
    try:
        return float(value) if value is not None else None
    except (ValueError, TypeError):
        return None


def to_date(value):
    if value is None:
        return None
    try:
        return pd.to_datetime(value).date()
    except (ValueError, TypeError):
        return None


def transform_row(row: pd.Series) -> dict:
    employee_code = pick(row, "empid", "emp_id", "employee_id", "employee_code")

    department_name = pick(row, "dept", "department")

    employee = {
        "employee_code": str(employee_code),
        "education_level": pick(row, "education_level"),
        "experience_level": pick(row, "experience_level"),
        "gender": pick(row, "gender"),
        "current_age": to_int(pick(row, "current_age")),
        "hire_date": to_date(pick(row, "hiredate", "hire_date")),
        "hire_time": pick(row, "hire_time"),
        "years_at_company": to_int(pick(row, "year_at_company", "years_at_company")),
        "emp_status": pick(row, "emp_status", "employee_status"),
    }

    salary = {
        "monthly_salary": to_float(pick(row, "monthly_salary")),
        "salary_level": pick(row, "salary_level"),
    }

    performance = {
        "performance_score": to_float(pick(row, "performance_score")),
        "performance_rating": pick(row, "performance_rating"),
        "overall_rating": pick(row, "overall_rating"),
        "overall_performance_index": to_float(pick(row, "overall_performance_index")),
        "percentage_pe": to_float(pick(row, "percentage_pe")),
        "min_ps": to_float(pick(row, "min_ps")),
        "max_ps": to_float(pick(row, "max_ps")),
    }

    satisfaction = {
        "satisfaction_score": to_float(pick(row, "emp_satisfaction_score", "satisfaction_score")),
        "satisfaction_rating": pick(row, "satisfaction_rating"),
        "percentage_satisfaction_score": to_float(pick(row, "percentage_satisfaction_score")),
    }

    training = {
        "training_hours": to_float(pick(row, "training_hour", "training_hours")),
        "training_level": pick(row, "training_level"),
    }

    work = {
        "normal_work_hours": to_float(pick(row, "normal_work_hours")),
        "overall_hours": to_float(pick(row, "overall_hours")),
        "total_work_hours": to_float(pick(row, "total_work_hours")),
        "work_hours_per_week": to_float(pick(row, "work_hours_per_week")),
        "overtime_category": pick(row, "overtime_category"),
        "project_handled": to_int(pick(row, "project_handled")),
        "remaining_projects": to_int(pick(row, "remaining_projects")),
        "workload": pick(row, "workload"),
        "work_life_balance": pick(row, "work_life_balance"),
        "sick_days": to_int(pick(row, "sick_days")),
    }

    promotion = {
        "promotion": pick(row, "promotion"),
        "promotion_status": pick(row, "promotion_status"),
    }

    retirement = {
        "retirement_on": to_date(pick(row, "retirement_on")),
        "retirement_status": pick(row, "retirement_status"),
        "year_at_retirement": to_int(pick(row, "year_at_retirement")),
    }

    remote_work = {
        "remote_work_frequency": pick(row, "remote_work_frequency"),
        "remote_work_type": pick(row, "remote_work_type"),
    }

    return {
        "department_name": department_name,
        "employee": employee,
        "salary": salary,
        "performance": performance,
        "satisfaction": satisfaction,
        "training": training,
        "work": work,
        "promotion": promotion,
        "retirement": retirement,
        "remote_work": remote_work,
    }
