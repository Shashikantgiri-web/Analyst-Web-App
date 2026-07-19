"""
Helper utilities: password generation, bcrypt hashing, and username rules.
"""
import bcrypt

from config.settings import settings


def generate_default_password(employee_code: str) -> str:
    """e.g. 'EMP1001' -> 'XYZ@EMP1001' """
    return f"{settings.DEFAULT_PASSWORD_PREFIX}@{employee_code}"


def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))


def username_from_employee_code(employee_code: str) -> str:
    return employee_code.lower()
