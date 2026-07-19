# Proposed Document Structure

```text
Restructuring_Database.md

1. Introduction
    • Why the current database needs restructuring
    • Problems with the flat Excel dataset
    • Goals of the new database

2. Existing Database Analysis
    • Current architecture
    • Current data flow
    • Problems
    • Scalability issues

3. New Database Architecture

4. Database Layers
    Authentication
    Master Tables
    Employee Tables
    Analytics Tables
    Dashboard Views
    Audit Tables

5. Entity Relationship Diagram (ERD)

6. Database Relationship Diagram

7. Authentication Module

8. Employee Module

9. Department Module

10. Salary Module

11. Performance Module

12. Satisfaction Module

13. Attendance Module

14. Project Module

15. Training Module

16. Promotion Module

17. Remote Work Module

18. Retirement Module

19. Dashboard Views

20. PostgreSQL Index Strategy

21. Security Design

22. Row Level Security (Supabase)

23. Data Import Pipeline

24. Application Data Flow

25. API Data Flow

26. CEO Access Flow

27. Manager Access Flow

28. Employee Access Flow

29. Tester Access Flow

30. Recommended Folder Structure

31. Future Expansion

32. Final Recommendations
```

---

## I will also include professional diagrams like these

### Current Architecture

```text
Excel
      │
      ▼
Power BI
      │
      ▼
Excel
      │
      ▼
Python
      │
      ▼
PostgreSQL
      │
      ▼
Next.js
```

---

### Improved Architecture

```text
           Excel Files
                │
                ▼
        Python ETL Pipeline
                │
                ▼
      Data Cleaning & Validation
                │
                ▼
      PostgreSQL (Supabase)
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
 Materialized  REST API   Views
     │
     ▼
 Next.js Dashboard
```

---

### Database Diagram

```text
roles
   │
users
   │
employees
   │
departments
   │
 ├──────────────┐
 │              │
performance   salary
 │              │
training     projects
 │              │
attendance   promotion
 │              │
remote      retirement
```

---

### Login Flow

```text
Login
   │
   ▼
Verify Email
   │
   ▼
Verify Password
   │
   ▼
Find Role
   │
   ├──────── CEO
   │          │
   │          ▼
   │      /ceo
   │
   ├──────── Manager
   │          │
   │          ▼
   │   Department Slug
   │          │
   │          ▼
   │   /manage/hr
   │
   ├──────── Employee
   │          │
   │          ▼
   │ /employee/EMP1023
   │
   └──────── Tester
              │
              ▼
        Choose Role
              │
              ▼
        /test/manager
```

---

### Data Import Pipeline

```text
Excel Workbook
        │
        ▼
Python Import Script
        │
        ▼
Column Validation
        │
        ▼
Data Cleaning
        │
        ▼
Normalize Data
        │
        ▼
Insert into PostgreSQL
        │
        ▼
Refresh Dashboard Views
        │
        ▼
Next.js Application
```

---

## Every table will be documented like this

Example:

### `employees`

| Column        | Data Type | Description         |
| ------------- | --------- | ------------------- |
| employee_id   | UUID      | Primary Key         |
| department_id | UUID      | FK → departments    |
| first_name    | VARCHAR   | Employee first name |
| gender        | VARCHAR   | Gender              |
| hire_date     | DATE      | Hiring date         |
| status        | VARCHAR   | Active/Inactive     |

Then I'll explain:

* Purpose
* Relationships
* Constraints
* Indexes
* Best Practices

---