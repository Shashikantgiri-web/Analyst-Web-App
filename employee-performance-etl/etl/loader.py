"""
Loads transformed rows into PostgreSQL:
1. Get-or-create Department
2. Insert Employee
3. Insert related 1:1 tables (salary, performance, satisfaction, training,
   work, promotion, retirement, remote_work)
4. Generate an EmployeeAccount (role=Employee) with a bcrypt-hashed password
"""
import pandas as pd
from sqlalchemy.orm import Session

from config.logger import logger
from models import (
    Department, Employee, Salary, Performance, Satisfaction,
    Training, Work, Promotion, Retirement, RemoteWork, EmployeeAccount,
)
from utils.helper import generate_default_password, hash_password, username_from_employee_code


def get_or_create_department(session: Session, name: str, cache: dict) -> Department:
    if not name:
        name = "Unassigned"

    if name in cache:
        return cache[name]

    department = session.query(Department).filter_by(name=name).one_or_none()
    if department is None:
        department = Department(name=name)
        session.add(department)
        session.flush()  # get department.id without committing
        logger.debug(f"Created department: {name}")

    cache[name] = department
    return department


def load_dataframe(session: Session, df: pd.DataFrame, transform_row) -> None:
    department_cache: dict = {}
    inserted, skipped = 0, 0

    for _, row in df.iterrows():
        data = transform_row(row)
        employee_code = data["employee"]["employee_code"]

        # Skip if employee already exists (idempotent re-runs)
        existing = session.query(Employee).filter_by(employee_code=employee_code).one_or_none()
        if existing is not None:
            skipped += 1
            continue

        department = get_or_create_department(session, data["department_name"], department_cache)

        employee = Employee(department_id=department.id, **data["employee"])
        session.add(employee)
        session.flush()  # get employee.id for FK use below

        session.add(Salary(employee_id=employee.id, **data["salary"]))
        session.add(Performance(employee_id=employee.id, **data["performance"]))
        session.add(Satisfaction(employee_id=employee.id, **data["satisfaction"]))
        session.add(Training(employee_id=employee.id, **data["training"]))
        session.add(Work(employee_id=employee.id, **data["work"]))
        session.add(Promotion(employee_id=employee.id, **data["promotion"]))
        session.add(Retirement(employee_id=employee.id, **data["retirement"]))
        session.add(RemoteWork(employee_id=employee.id, **data["remote_work"]))

        # Auto-generate a login account for this employee
        plain_password = generate_default_password(employee_code)
        session.add(EmployeeAccount(
            employee_id=employee.id,
            username=username_from_employee_code(employee_code),
            password_hash=hash_password(plain_password),
            role="Employee",
            status="active",
        ))

        inserted += 1

        if inserted % 200 == 0:
            session.commit()
            logger.info(f"Committed {inserted} employees so far...")

    session.commit()
    logger.info(f"✅ Load complete: {inserted} inserted, {skipped} skipped (already existed)")
