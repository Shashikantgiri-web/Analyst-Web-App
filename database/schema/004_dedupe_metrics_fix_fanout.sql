-- Fixes two related bugs reported against the live app:
--   1. Manager dashboard showing implausible totals (e.g. "11,122 employees"
--      in one department, "274,796 projects handled") -- a classic SQL
--      fan-out symptom: joining employees to employee_metrics inflates row
--      counts if employee_metrics has more than one row per employee_id.
--   2. Performance Rating Distribution and Work-Life Balance showing
--      identical numbers -- consistent with the same fan-out multiplying
--      both groupings by the same factor.
--
-- Fix: force exactly one metrics row per employee (the most recently
-- updated one) via DISTINCT ON, before joining anything else. This is
-- safe regardless of *why* duplicates exist -- multiple snapshots over
-- time, a bad import, etc.

create or replace function ceo_dashboard_overview()
returns json
language sql
stable
as $$
  with latest_metrics as (
    select distinct on (employee_id) *
    from employee_metrics
    order by employee_id, updated_at desc nulls last, created_at desc nulls last
  )
  select json_build_object(
    'totalEmployees', (select count(*) from employees),
    'totalDepartments', (select count(*) from departments),
    'avgPerformanceScore', (select avg(performance_score) from latest_metrics),
    'avgSatisfactionScore', (select avg(emp_satisfaction_score) from latest_metrics),
    'avgMonthlySalary', (select avg(monthly_salary) from latest_metrics),
    'avgTrainingHours', (
      select avg(coalesce(training_hours_calc, training_hours)) from latest_metrics
    ),
    'avgWorkHoursPerWeek', (
      select avg(coalesce(work_hours_per_week_calc, work_hours_per_week)) from latest_metrics
    ),
    'avgExperienceYears', (select avg(years_at_company) from employees),
    'promotionRate', (
      select (count(*) filter (where promotions > 0))::numeric
             / nullif(count(*), 0) * 100
      from latest_metrics
    ),
    'workLifeBalanceDistribution', (
      select coalesce(json_object_agg(coalesce(work_life_balance, 'Unknown'), cnt), '{}'::json)
      from (
        select work_life_balance, count(*) as cnt
        from latest_metrics
        group by work_life_balance
      ) t
    ),
    'departmentRanking', (
      select coalesce(json_agg(
        json_build_object(
          'id', sub.id,
          'name', sub.name,
          'avgPerformanceScore', sub.avg_score,
          'employeeCount', sub.employee_count
        ) order by sub.avg_score desc
      ), '[]'::json)
      from (
        select d.id, d.department_name as name,
               avg(m.performance_score) as avg_score,
               count(*) as employee_count
        from departments d
        join employees e on e.department_id = d.id
        join latest_metrics m on m.employee_id = e.id
        group by d.id, d.department_name
      ) sub
    )
  );
$$;

grant execute on function ceo_dashboard_overview() to service_role, authenticated, anon;


create or replace function manager_department_overview(dept_id uuid)
returns json
language sql
stable
as $$
  with latest_metrics as (
    select distinct on (employee_id) *
    from employee_metrics
    order by employee_id, updated_at desc nulls last, created_at desc nulls last
  )
  select json_build_object(
    'department', (
      select json_build_object('id', d.id, 'name', d.department_name)
      from departments d where d.id = dept_id
    ),
    'kpis', (
      select json_build_object(
        'totalEmployees', count(*),
        'avgPerformanceScore', avg(m.performance_score),
        'avgMonthlySalary', avg(m.monthly_salary),
        'avgYearsAtCompany', avg(e.years_at_company),
        'avgTrainingHours', avg(coalesce(m.training_hours_calc, m.training_hours)),
        'totalProjectsHandled', sum(m.projects_handled),
        'avgWorkHoursPerWeek', avg(coalesce(m.work_hours_per_week_calc, m.work_hours_per_week))
      )
      from employees e
      join latest_metrics m on m.employee_id = e.id
      where e.department_id = dept_id
    ),
    'workLifeBalanceDistribution', (
      select coalesce(json_object_agg(coalesce(work_life_balance, 'Unknown'), cnt), '{}'::json)
      from (
        select m.work_life_balance, count(*) as cnt
        from employees e
        join latest_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.work_life_balance
      ) t
    ),
    'performanceRatingDistribution', (
      select coalesce(json_object_agg(coalesce(pr.name, 'Unrated'), cnt), '{}'::json)
      from (
        select m.performance_rating_id, count(*) as cnt
        from employees e
        join latest_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.performance_rating_id
      ) t
      left join performance_ratings pr on pr.id = t.performance_rating_id
    ),
    'employees', (
      select coalesce(json_agg(
        json_build_object(
          'id', e.id,
          'employeeCode', e.employee_code,
          'jobTitle', e.job_title,
          'performanceScore', m.performance_score,
          'monthlySalary', m.monthly_salary,
          'yearsAtCompany', e.years_at_company
        ) order by m.performance_score desc nulls last
      ), '[]'::json)
      from employees e
      join latest_metrics m on m.employee_id = e.id
      where e.department_id = dept_id
    )
  );
$$;

grant execute on function manager_department_overview(uuid) to service_role, authenticated, anon;


create or replace function employee_own_overview(emp_id uuid)
returns json
language sql
stable
as $$
  with latest_metrics as (
    select distinct on (employee_id) *
    from employee_metrics
    where employee_id = emp_id
    order by employee_id, updated_at desc nulls last, created_at desc nulls last
  )
  select json_build_object(
    'employee', (
      select json_build_object(
        'id', e.id,
        'employeeCode', e.employee_code,
        'jobTitle', e.job_title,
        'departmentName', d.department_name,
        'hireDate', e.hire_date,
        'yearsAtCompany', e.years_at_company
      )
      from employees e
      left join departments d on d.id = e.department_id
      where e.id = emp_id
    ),
    'metrics', (
      select json_build_object(
        'performanceScore', m.performance_score,
        'performanceRating', pr.name,
        'monthlySalary', m.monthly_salary,
        'trainingHours', coalesce(m.training_hours_calc, m.training_hours),
        'workHoursPerWeek', coalesce(m.work_hours_per_week_calc, m.work_hours_per_week),
        'projectsHandled', m.projects_handled,
        'satisfactionScore', m.emp_satisfaction_score,
        'satisfactionRating', sr.name,
        'workLifeBalance', m.work_life_balance,
        'sickDays', coalesce(m.sick_days_calc, m.sick_days),
        'promotions', m.promotions
      )
      from latest_metrics m
      left join performance_ratings pr on pr.id = m.performance_rating_id
      left join satisfaction_ratings sr on sr.id = m.satisfaction_rating_id
    )
  );
$$;

grant execute on function employee_own_overview(uuid) to service_role, authenticated, anon;
