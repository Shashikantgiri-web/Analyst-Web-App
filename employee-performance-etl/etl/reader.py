"""
Reads the source Excel workbook into a pandas DataFrame with normalized column names.
"""
import pandas as pd

from config.logger import logger
from config.settings import settings


def read_excel() -> pd.DataFrame:
    logger.info(f"Reading Excel file: {settings.EXCEL_FILE_PATH}")
    df = pd.read_excel(settings.EXCEL_FILE_PATH)

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
        .str.replace("-", "_", regex=False)
    )

    logger.info(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    logger.debug(f"Columns: {df.columns.tolist()}")
    return df
