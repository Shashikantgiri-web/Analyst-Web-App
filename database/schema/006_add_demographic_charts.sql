-- Adds Gender, Education Level, and Salary Level distributions to both
-- ceo_dashboard_overview() and manager_department_overview(), plus
-- Workload distribution to manager_department_overview() only (that
-- column doesn't apply at the company-wide level the same way).
--
-- Built on the same latest_metrics dedup pattern as migrations 004/005 --
-- never re-introduces the fan-out bug.

drop function if exists ceo_dashboard_overview(uuid);

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
    'genderDistribution', (
      select coalesce(json_object_agg(coalesce(gender, 'Unknown'), cnt), '{}'::json)
      from (
        select gender, count(*) as cnt
        from scoped_employees
        group by gender
      ) t
    ),
    'educationDistribution', (
      select coalesce(json_object_agg(coalesce(el.name, 'Unknown'), cnt), '{}'::json)
      from (
        select education_level_id, count(*) as cnt
        from scoped_employees
        group by education_level_id
      ) t
      left join education_levels el on el.id = t.education_level_id
    ),
    'salaryDistribution', (
      select coalesce(json_object_agg(coalesce(sl.name, 'Unknown'), cnt), '{}'::json)
      from (
        select salary_level_id, count(*) as cnt
        from scoped_metrics
        group by salary_level_id
      ) t
      left join salary_levels sl on sl.id = t.salary_level_id
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
    'genderDistribution', (
      select coalesce(json_object_agg(coalesce(gender, 'Unknown'), cnt), '{}'::json)
      from (
        select gender, count(*) as cnt
        from employees
        where department_id = dept_id
        group by gender
      ) t
    ),
    'educationDistribution', (
      select coalesce(json_object_agg(coalesce(el.name, 'Unknown'), cnt), '{}'::json)
      from (
        select education_level_id, count(*) as cnt
        from employees
        where department_id = dept_id
        group by education_level_id
      ) t
      left join education_levels el on el.id = t.education_level_id
    ),
    'salaryDistribution', (
      select coalesce(json_object_agg(coalesce(sl.name, 'Unknown'), cnt), '{}'::json)
      from (
        select m.salary_level_id, count(*) as cnt
        from employees e
        join latest_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.salary_level_id
      ) t
      left join salary_levels sl on sl.id = t.salary_level_id
    ),
    'workloadDistribution', (
      select coalesce(json_object_agg(coalesce(t.workload, 'Unknown'), cnt), '{}'::json)
      from (
        select m.workload, count(*) as cnt
        from employees e
        join latest_metrics m on m.employee_id = e.id
        where e.department_id = dept_id
        group by m.workload
      ) t
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
