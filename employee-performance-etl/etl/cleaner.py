"""
Cleans the raw DataFrame: trims strings, drops exact duplicate rows,
standardizes empty values to NaN so downstream code can rely on pd.isna().
"""
import numpy as np
import pandas as pd

from config.logger import logger


def clean(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)

    # Trim whitespace on all string/object columns
    obj_cols = df.select_dtypes(include="object").columns
    for col in obj_cols:
        df[col] = df[col].astype(str).str.strip().replace({"nan": np.nan, "": np.nan, "None": np.nan})

    # Drop fully duplicate rows
    df = df.drop_duplicates()

    # Require an employee ID for every row — can't build the graph without it
    if "empid" in df.columns:
        df = df.dropna(subset=["empid"])
    elif "emp_id" in df.columns:
        df = df.dropna(subset=["emp_id"])

    after = len(df)
    logger.info(f"Cleaning complete: {before} -> {after} rows ({before - after} dropped)")
    return df.reset_index(drop=True)
