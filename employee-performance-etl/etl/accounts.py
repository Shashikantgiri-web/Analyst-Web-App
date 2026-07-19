"""
Creates non-employee system accounts: CEO, one Manager per department, and a Tester.
These are NOT sourced from Excel — Python creates them directly.
"""
from sqlalchemy.orm import Session

from config.logger import logger
from config.settings import settings
from models import Department, EmployeeAccount
from utils.helper import hash_password


def seed_ceo_account(session: Session) -> None:
    if session.query(EmployeeAccount).filter_by(username="ceo").one_or_none():
        logger.info("CEO account already exists — skipping")
        return

    session.add(EmployeeAccount(
        employee_id=None,
        username="ceo",
        password_hash=hash_password(settings.CEO_PASSWORD),
        role="CEO",
        status="active",
    ))
    session.commit()
    logger.info("✅ CEO account created (username: ceo)")


def seed_manager_accounts(session: Session) -> None:
    departments = session.query(Department).all()

    for dept in departments:
        username = f"manager_{dept.name.lower().replace(' ', '_')}"

        if session.query(EmployeeAccount).filter_by(username=username).one_or_none():
            continue

        plain_password = f"{username.upper()}@2026"
        session.add(EmployeeAccount(
            employee_id=None,
            username=username,
            password_hash=hash_password(plain_password),
            role="Manager",
            status="active",
        ))
        logger.debug(f"Created manager account: {username}")

    session.commit()
    logger.info(f"✅ Manager accounts created for {len(departments)} department(s)")


def seed_tester_account(session: Session) -> None:
    if session.query(EmployeeAccount).filter_by(username="tester").one_or_none():
        logger.info("Tester account already exists — skipping")
        return

    session.add(EmployeeAccount(
        employee_id=None,
        username="tester",
        password_hash=hash_password("Tester@2026"),
        role="Tester",
        status="active",
    ))
    session.commit()
    logger.info("✅ Tester account created (username: tester)")


def seed_system_accounts(session: Session) -> None:
    seed_ceo_account(session)
    seed_manager_accounts(session)
    seed_tester_account(session)
