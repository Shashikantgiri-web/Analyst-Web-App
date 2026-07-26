import pandas as pd
from sqlalchemy import create_engine
import os
import urllib.parse

def main():
    excel_file = r"d:\Shashikant\Github\Analyst-Web-App\Employee performance dataset.xlsx"
    
    # Check if file exists
    if not os.path.exists(excel_file):
        print(f"Error: Excel file not found at {excel_file}")
        return

    print("Reading Excel file...")
    try:
        df = pd.read_excel(excel_file)
        print(f"Successfully read {len(df)} rows from Excel.")
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return

    # Database connection string from secrets.md
    # Using the direct PostgreSQL connection
    # Note: Using urllib.parse.quote_plus for the password because of the '@' symbol in "Web_App@1234"
    password = urllib.parse.quote_plus("Web_App@1234")
    db_url = f"postgresql://postgres:{password}@db.cwzrtlqcuvigboblsusw.supabase.co:5432/postgres"
    
    print("Connecting to PostgreSQL database...")
    try:
        engine = create_engine(db_url)
        
        # Write to PostgreSQL
        # We'll use a generic table name "employee_performance". Change it if needed.
        table_name = "employee_performance"
        print(f"Transferring data to table '{table_name}'...")
        
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        print("Data transfer complete!")
    except Exception as e:
        print(f"Error connecting to or writing to database: {e}")

if __name__ == "__main__":
    main()
