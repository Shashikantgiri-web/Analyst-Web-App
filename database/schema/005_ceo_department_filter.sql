-- Adds an optional department filter to ceo_dashboard_overview(), per
-- 06_CEO_Dashboard.md v2's Global Filters requirement. Passing null
-- (the default) keeps the original company-wide behavior -- existing
-- callers with no argument are unaffected.
--
-- Still uses latest_metrics (one row per employee, see migration 004) so
-- filtering never reintroduces the fan-out bug.

-- Must drop the old zero-argument version first -- otherwise Postgres
-- keeps both signatures and any call with zero arguments becomes
-- ambiguous between this new default-arg version and the old one.
drop function if exists ceo_dashboard_overview();

create or replace function ceo_dashboard_overview(filter_department_id uuid default null)
returns json
language sql
stable
as $$
  with latest_metrics as (
    select distinct on (employee_id) *
    from employee_metrics
    order by employee_id, updated_at desc nulls last, created_at desc nulls last
  ),
  scoped_employees as (
    select * from employees
    where filter_department_id is null or department_id = filter_department_id
  ),
  scoped_metrics as (
    select m.*
    from latest_metrics m
    join scoped_employees e on e.id = m.employee_id
  )
  select json_build_object(
    'totalEmployees', (select count(*) from scoped_employees),
    'totalDepartments', (
      select count(*) from departments
      where filter_department_id is null or id = filter_department_id
    ),
    'avgPerformanceScore', (select avg(performance_score) from scoped_metrics),
    'avgSatisfactionScore', (select avg(emp_satisfaction_score) from scoped_metrics),
    'avgMonthlySalary', (select avg(monthly_salary) from scoped_metrics),
    'avgTrainingHours', (
      select avg(coalesce(training_hours_calc, training_hours)) from scoped_metrics
    ),
    'avgWorkHoursPerWeek', (
      select avg(coalesce(work_hours_per_week_calc, work_hours_per_week)) from scoped_metrics
    ),
    'avgExperienceYears', (select avg(years_at_company) from scoped_employees),
    'promotionRate', (
      select (count(*) filter (where promotions > 0))::numeric
             / nullif(count(*), 0) * 100
      from scoped_metrics
    ),
    'workLifeBalanceDistribution', (
      select coalesce(json_object_agg(coalesce(work_life_balance, 'Unknown'), cnt), '{}'::json)
      from (
        select work_life_balance, count(*) as cnt
        from scoped_metrics
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
        join scoped_employees e on e.department_id = d.id
        join latest_metrics m on m.employee_id = e.id
        where filter_department_id is null or d.id = filter_department_id
        group by d.id, d.department_name
      ) sub
    )
  );
$$;

grant execute on function ceo_dashboard_overview(uuid) to service_role, authenticated, anon;
