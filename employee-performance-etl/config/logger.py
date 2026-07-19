"""
Centralized logging configuration using Loguru.
"""
import sys
from loguru import logger

logger.remove()
logger.add(sys.stdout, level="INFO", colorize=True,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | {message}")
logger.add("logs/etl.log", level="DEBUG", rotation="5 MB", retention="10 days")

__all__ = ["logger"]
