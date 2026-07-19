"""
Creates dashboard-ready SQL views so Power BI / Next.js can query flat,
pre-joined data instead of performing joins themselves.
"""
from sqlalchemy import text

from config.database import engine
from config.logger import logger

VIEWS = {
    "employee_dashboard": """
        CREATE OR REPLACE VIEW employee_dashboard AS
        SELECT
            e.id                        AS employee_id,
            e.employee_code,
            d.name                      AS department,
            e.education_level,
            e.experience_level,
            e.gender,
            e.current_age,
            e.hire_date,
            e.years_at_company,
            e.emp_status,
            s.monthly_salary,
            s.salary_level,
            p.performance_score,
            p.performance_rating,
            p.overall_performance_index,
            sat.satisfaction_score,
            sat.satisfaction_rating,
            t.training_hours,
            t.training_level,
            w.workload,
            w.work_life_balance,
            w.project_handled,
            w.remaining_projects,
            promo.promotion,
            promo.promotion_status,
            r.retirement_status,
            rw.remote_work_frequency,
            rw.remote_work_type
        FROM employees e
        LEFT JOIN departments d      ON d.id = e.department_id
        LEFT JOIN salaries s         ON s.employee_id = e.id
        LEFT JOIN performance p      ON p.employee_id = e.id
        LEFT JOIN satisfaction sat   ON sat.employee_id = e.id
        LEFT JOIN training t         ON t.employee_id = e.id
        LEFT JOIN work w             ON w.employee_id = e.id
        LEFT JOIN promotions promo   ON promo.employee_id = e.id
        LEFT JOIN retirement r       ON r.employee_id = e.id
        LEFT JOIN remote_work rw     ON rw.employee_id = e.id;
    """,
    "department_dashboard": """
        CREATE OR REPLACE VIEW department_dashboard AS
        SELECT
            d.id                              AS department_id,
            d.name                            AS department,
            COUNT(e.id)                       AS total_employees,
            ROUND(AVG(s.monthly_salary), 2)   AS avg_salary,
            ROUND(AVG(p.performance_score), 2) AS avg_performance_score,
            ROUND(AVG(sat.satisfaction_score), 2) AS avg_satisfaction_score
        FROM departments d
        LEFT JOIN employees e     ON e.department_id = d.id
        LEFT JOIN salaries s      ON s.employee_id = e.id
        LEFT JOIN performance p   ON p.employee_id = e.id
        LEFT JOIN satisfaction sat ON sat.employee_id = e.id
        GROUP BY d.id, d.name;
    """,
    "company_dashboard": """
        CREATE OR REPLACE VIEW company_dashboard AS
        SELECT
            COUNT(DISTINCT e.id)                    AS total_employees,
            COUNT(DISTINCT d.id)                     AS total_departments,
            ROUND(AVG(s.monthly_salary), 2)          AS avg_salary,
            ROUND(AVG(p.performance_score), 2)       AS avg_performance_score,
            ROUND(AVG(sat.satisfaction_score), 2)    AS avg_satisfaction_score,
            SUM(CASE WHEN promo.promotion_status = 'Approved' THEN 1 ELSE 0 END) AS total_promotions
        FROM employees e
        LEFT JOIN departments d    ON d.id = e.department_id
        LEFT JOIN salaries s       ON s.employee_id = e.id
        LEFT JOIN performance p    ON p.employee_id = e.id
        LEFT JOIN satisfaction sat ON sat.employee_id = e.id
        LEFT JOIN promotions promo ON promo.employee_id = e.id;
    """,
    "promotion_summary": """
        CREATE OR REPLACE VIEW promotion_summary AS
        SELECT
            d.name              AS department,
            promo.promotion_status,
            COUNT(*)            AS total
        FROM promotions promo
        JOIN employees e   ON e.id = promo.employee_id
        JOIN departments d ON d.id = e.department_id
        GROUP BY d.name, promo.promotion_status;
    """,
    "performance_summary": """
        CREATE OR REPLACE VIEW performance_summary AS
        SELECT
            d.name                            AS department,
            p.performance_rating,
            COUNT(*)                          AS total,
            ROUND(AVG(p.performance_score), 2) AS avg_score
        FROM performance p
        JOIN employees e   ON e.id = p.employee_id
        JOIN departments d ON d.id = e.department_id
        GROUP BY d.name, p.performance_rating;
    """,
}


def create_all_views():
    with engine.begin() as conn:
        for view_name, ddl in VIEWS.items():
            logger.info(f"Creating view: {view_name}")
            conn.execute(text(ddl))
    logger.info("✅ All views created successfully.")


if __name__ == "__main__":
    create_all_views()
