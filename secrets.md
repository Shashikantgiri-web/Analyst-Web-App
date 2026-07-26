Databasic-Passwords:Web_App@1234
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

---

## 1. Client Environment Variables

These variables are exposed to the browser and should only contain public information.

```env
NEXT_PUBLIC_SUPABASE_URL="https://cwzrtlqcuvigboblsusw.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_q9XRP3KBLvAqjAJfdhzTLg_GLJqfyAR"
```

---

## 2. Server Environment Variables

These variables should only be used on the server.

```env
SUPABASE_URL="https://cwzrtlqcuvigboblsusw.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_q9XRP3KBLvAqjAJfdhzTLg_GLJqfyAR"
SUPABASE_SECRET_KEY="sb_secret_VoTa-sVzpptLER8tattg9Q_zUjG_qSu"
SUPABASE_JWKS_URL="https://cwzrtlqcuvigboblsusw.supabase.co/auth/v1/.well-known/jwks.json"
```

---

## 3. Direct PostgreSQL Connection

Use these credentials when connecting directly to the PostgreSQL database (pgAdmin, DBeaver, VS Code extensions, etc.).

```text
Connection String = "postgresql://postgres:Web_App@1234@db.cwzrtlqcuvigboblsusw.supabase.co:5432/postgres "

Host     = "db.cwzrtlqcuvigboblsusw.supabase.co"
Port     = "5432"
Database = "postgres"
User     = "postgres"
Password = "Web_App@1234"
```

---

## 4. Prisma / ORM Connection

### Transaction Pooler (Recommended for Applications)

Used by the application for normal database queries.

```env
Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

---
### Session Pooler (Recommended for Migrations)

Used for database migrations.

```env
Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.bigstuotuzbrhjmdyuwl:Web_App@1234@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

Host     = "aws-0-ap-northeast-1.pooler.supabase.com"
Port     = "5432"
Database = "postgres"
User     = "postgres.cwzrtlqcuvigboblsusw"
Password = "Web_App@1234"
```
---

---
### Transaction pooler (Recommended for Migrations)

Ideal for stateless applications like serverless functions where each interaction with Postgres is brief and isolated.

```env
Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.cwzrtlqcuvigboblsusw:Web_App@1234@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

Host     = "aws-0-ap-northeast-1.pooler.supabase.com"
Port     = "6543"
Database = "postgres
User     = "postgres.cwzrtlqcuvigboblsusw"
Password = "Web_App@1234"
```
---

---
# this is Powerbi environment variable

Share_Link="https://app.powerbi.com/links/p9oZuOX0OH?ctid=f8bc6c81-1924-459e-b798-daa257ccd83f&pbi_source=linkShare&bookmarkGuid=ca359eb7-9945-4866-8265-abfb4e17d68e"


app flow 
```
                         PRD
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
 Technology        Database Design     Functional Spec
        │                 │                 │
        └──────────────┬──┴──────────────┐
                       ▼                 ▼
              Project Structure   API Architecture
                       │                 │
                       └──────────┬──────┘
                                  ▼
                          AI Architecture
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
 Login Dashboard         CEO Dashboard            Manager Dashboard
        ▼                         ▼                         ▼
 Employee Dashboard      Tester Dashboard         QA & Deployment
                                  │
                                  ▼
                        Coding Standards
                                  │
                                  ▼
                        Development Roadmap
```