import psycopg2

try:
    conn = psycopg2.connect(
        host="aws-0-ap-northeast-1.pooler.supabase.com",
        port=5432,
        dbname="postgres",
        user="postgres.cwzrtlqcuvigboblsusw",
        password="web-app-0987"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("""
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE state = 'idle in transaction' 
          AND pid <> pg_backend_pid();
    """)
    print("Terminated idle transactions successfully.")
except Exception as e:
    print(f"FAILED: {e}")
