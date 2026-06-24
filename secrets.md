Databasic-Passwords:Web_App@1234
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
