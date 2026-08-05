import psycopg2

try:
    conn = psycopg2.connect(
        host="aws-0-ap-northeast-1.pooler.supabase.com",
        port=6543,
        dbname="postgres",
        user="postgres.cwzrtlqcuvigboblsusw",
        password="web-app-0987"
    )
    print("SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
