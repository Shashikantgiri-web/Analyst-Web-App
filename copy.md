# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add `import "dotenv/config";` to your `prisma.config.ts` file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres
# server with the `prisma dev` CLI command, when not choosing any non-default ports or settings. The API key, unlike the
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
# DATABASE_URL=""

# Connect to Postgres via the shared session-mode pooler (used for migrations)
# DIRECT_URL=""

---

## 1. Client Environment Variables

These variables are exposed to the browser and should only contain public information.

```env
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
```

---

## 2. Server Environment Variables

These variables should only be used on the server.

```env
SUPABASE_URL=""
SUPABASE_PUBLISHABLE_KEY=""
SUPABASE_SECRET_KEY=""
SUPABASE_JWKS_URL=""
```

---

## 3. Direct PostgreSQL Connection

Use these credentials when connecting directly to the PostgreSQL database (pgAdmin, DBeaver, VS Code extensions, etc.).

```text
Connection String = ""

Host     = ""
Port     = ""
Database = ""
User     = ""
Password = ""
```

---

## 4. Prisma / ORM Connection

### Transaction Pooler (Recommended for Applications)

Used by the application for normal database queries.

```env
Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL=""
```

---

### Session Pooler (Recommended for Migrations)

Used for database migrations.

```env
Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL=""
```

# this is Powerbi environment variable

Share_Link=""
